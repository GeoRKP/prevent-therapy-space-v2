// Ακύρωση ραντεβού από τον θεραπευτή: χωρίς χρονικό όριο, ο ασθενής
// ενημερώνεται με email (+ Google cancellation) και οι προγραμματισμένες
// υπενθυμίσεις ακυρώνονται.

import { isAuthorized } from "@/lib/admin-auth";
import { getBookingEvent, deleteBookingEvent } from "@/lib/google-calendar";
import { sendCancellationEmails, cancelScheduledEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    if (!body.id) return Response.json({ error: "invalid" }, { status: 400 });

    let event;
    try {
      event = await getBookingEvent(body.id);
    } catch (err) {
      if (err?.status === 404 || err?.status === 410) {
        return Response.json({ error: "gone" }, { status: 410 });
      }
      throw err;
    }
    if (event.status === "cancelled") {
      return Response.json({ error: "gone" }, { status: 410 });
    }

    await deleteBookingEvent(event.id);

    const props = event.extendedProperties?.private || {};
    const startISO = event.start?.dateTime;
    if (startISO) {
      sendCancellationEmails({
        startISO,
        name: props.patientName || "",
        email: props.patientEmail || "",
        phone: props.patientPhone || "",
        locale: props.patientLocale || "el",
      }).catch((err) => console.error("[admin cancel emails]", err));
    }
    cancelScheduledEmails([
      props.reminder24EmailId,
      props.reminder2EmailId,
      props.reviewEmailId,
    ]).catch((err) => console.error("[admin cancel scheduled]", err));

    return Response.json({ success: true });
  } catch (err) {
    console.error("[admin/appointments/cancel]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
