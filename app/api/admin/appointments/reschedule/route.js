// Μετάθεση ραντεβού από τον θεραπευτή σε νέα ημέρα/ώρα:
// - ελέγχεται ότι το νέο slot είναι έγκυρο και ελεύθερο
// - ενημερώνεται το event (ο ασθενής παίρνει και το Google update)
// - οι παλιές προγραμματισμένες υπενθυμίσεις ακυρώνονται και μπαίνουν νέες
// - ο ασθενής ενημερώνεται με email για τη νέα ώρα (με νέο link ακύρωσης)

import { z } from "zod";
import { isAuthorized } from "@/lib/admin-auth";
import { assertSlotAvailable } from "@/lib/booking";
import {
  getBookingEvent,
  updateBookingEventTime,
  patchBookingEventProps,
} from "@/lib/google-calendar";
import {
  sendRescheduledEmail,
  scheduleReminderEmails,
  cancelScheduledEmails,
} from "@/lib/email";
import { cancelUrl } from "@/lib/booking-token";

export const dynamic = "force-dynamic";

const schema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function POST(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json().catch(() => ({})));

    let event;
    try {
      event = await getBookingEvent(data.id);
    } catch (err) {
      if (err?.status === 404 || err?.status === 410) {
        return Response.json({ error: "gone" }, { status: 410 });
      }
      throw err;
    }
    if (event.status === "cancelled") {
      return Response.json({ error: "gone" }, { status: 410 });
    }

    const { start, end, config } = await assertSlotAvailable(data.date, data.time);

    await updateBookingEventTime(event.id, {
      start,
      end,
      timeZone: config.timeZone,
    });

    const props = event.extendedProperties?.private || {};
    const patient = {
      startISO: start.toISOString(),
      name: props.patientName || "",
      email: props.patientEmail || "",
      locale: props.patientLocale || "el",
      cancelLink: cancelUrl(event.id),
    };

    // Παλιές υπενθυμίσεις εκτός — νέες για τη νέα ώρα.
    await cancelScheduledEmails([props.reminder24EmailId, props.reminder2EmailId]);
    const ids = await scheduleReminderEmails(patient);
    await patchBookingEventProps(event.id, {
      reminder24EmailId: ids.reminder24EmailId || "",
      reminder2EmailId: ids.reminder2EmailId || "",
    });

    if (patient.email) {
      sendRescheduledEmail(patient).catch((err) =>
        console.error("[reschedule email]", err)
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    if (err?.issues) {
      return Response.json({ error: "validation" }, { status: 400 });
    }
    if (err?.code === "invalid_slot") {
      return Response.json({ error: "invalid_slot" }, { status: 400 });
    }
    if (err?.code === "slot_taken") {
      return Response.json({ error: "slot_taken" }, { status: 409 });
    }
    console.error("[admin/appointments/reschedule]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
