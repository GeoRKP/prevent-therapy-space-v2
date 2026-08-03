import { z } from "zod";
import { bookingConfig } from "@/data/booking";
import { assertSlotAvailable } from "@/lib/booking";
import { createBookingEvent } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  notes: z.string().max(1000).optional().default(""),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    // Επαλήθευση ότι το slot είναι έγκυρο και ακόμα ελεύθερο στο Google Calendar
    const { start, end } = await assertSlotAvailable(data.date, data.time);

    const event = await createBookingEvent({
      start,
      end,
      timeZone: bookingConfig.timeZone,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
    });

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
