import { z } from "zod";
import { assertSlotAvailable } from "@/lib/booking";
import { createBookingEvent, patchBookingEventProps } from "@/lib/google-calendar";
import { cancelUrl } from "@/lib/booking-token";
import { sendBookingEmails, scheduleReminderEmails } from "@/lib/email";
import { validateBooking } from "@/lib/form-validation";

export const dynamic = "force-dynamic";

// Το zod ελέγχει τύπους και το σχήμα ημερομηνίας/ώρας· οι κανόνες των πεδίων
// του ασθενή (και τα μηνύματά τους) είναι οι ίδιοι με της φόρμας:
// lib/form-validation.js — ένα λάθος επιστρέφεται ανά πεδίο στο `fields`.
const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().max(1000),
  email: z.string().max(1000),
  phone: z.string().max(200),
  notes: z.string().max(20000).optional().default(""),
  locale: z.enum(["el", "en"]).optional().default("el"),
  // Ρητή συναίνεση (GDPR) — υποχρεωτική για την καταχώρηση (validateBooking)
  consent: z.boolean().optional().default(false),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const fields = validateBooking(parsed);
    if (Object.keys(fields).length) {
      return Response.json({ error: "validation", fields }, { status: 400 });
    }
    const data = {
      ...parsed,
      name: parsed.name.trim(),
      email: parsed.email.trim(),
      phone: parsed.phone.trim(),
      notes: parsed.notes.trim(),
    };

    // Επαλήθευση ότι το slot είναι έγκυρο και ακόμα ελεύθερο στο Google Calendar
    const { start, end, config } = await assertSlotAvailable(data.date, data.time);

    const event = await createBookingEvent({
      start,
      end,
      timeZone: config.timeZone,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      locale: data.locale,
    });

    // Emails best-effort: μια αποτυχία τους δεν ακυρώνει την κράτηση.
    const emailInfo = {
      startISO: start.toISOString(),
      name: data.name,
      email: data.email,
      locale: data.locale,
      cancelLink: cancelUrl(event.id),
    };
    sendBookingEmails({ ...emailInfo, phone: data.phone }).catch((err) =>
      console.error("[booking emails]", err)
    );
    // Υπενθυμίσεις T-24h/T-2h ως προγραμματισμένα Resend emails — τα ids
    // αποθηκεύονται στο event ώστε να ακυρωθούν μαζί με το ραντεβού.
    scheduleReminderEmails(emailInfo)
      .then((ids) =>
        Object.keys(ids).length ? patchBookingEventProps(event.id, ids) : null
      )
      .catch((err) => console.error("[booking reminders]", err));

    return Response.json({ success: true, id: event.id });
  } catch (err) {
    if (err?.issues) {
      return Response.json({ error: "validation", issues: err.issues }, { status: 400 });
    }
    if (err?.code === "invalid_slot") {
      return Response.json({ error: "invalid_slot" }, { status: 400 });
    }
    if (err?.code === "slot_taken") {
      return Response.json({ error: "slot_taken" }, { status: 409 });
    }
    console.error("[booking]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
