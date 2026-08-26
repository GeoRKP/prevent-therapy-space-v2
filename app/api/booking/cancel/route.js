// Ακύρωση ραντεβού με υπογεγραμμένο link (χωρίς βάση): GET επιστρέφει τα
// στοιχεία για τη σελίδα επιβεβαίωσης, POST εκτελεί την ακύρωση.

import { getBookingConfig } from "@/lib/settings";
import { verifyEventSignature } from "@/lib/booking-token";
import { getBookingEvent, deleteBookingEvent } from "@/lib/google-calendar";
import { sendCancellationEmails, cancelScheduledEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

// Κοινός έλεγχος: υπογραφή -> ύπαρξη event -> χρονικό όριο.
// Επιστρέφει { event, start } ή { error, status }.
async function loadCancellableEvent(id, sig) {
  if (!id || !verifyEventSignature(id, sig)) {
    return { error: "invalid", status: 400 };
  }

  let event;
  try {
    event = await getBookingEvent(id);
  } catch (err) {
    if (err?.status === 404 || err?.status === 410) {
      return { error: "gone", status: 410 };
    }
    throw err;
  }

  if (event.status === "cancelled") return { error: "gone", status: 410 };

  const start = new Date(event.start?.dateTime || event.start?.date);
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
    return { error: "gone", status: 410 };
  }

  const config = await getBookingConfig();
  const deadline = start.getTime() - config.cancelNoticeHours * 3_600_000;
  if (Date.now() > deadline) return { error: "too_late", status: 409 };

  return { event, start, config };
}

function eventDetails(event, start, timeZone) {
  const props = event.extendedProperties?.private || {};
  return {
    date: new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(start),
    time: new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(start),
    name: props.patientName || "",
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await loadCancellableEvent(searchParams.get("id"), searchParams.get("sig"));
    if (result.error) {
      return Response.json({ error: result.error }, { status: result.status });
    }
    return Response.json(eventDetails(result.event, result.start, result.config.timeZone));
  } catch (err) {
    console.error("[booking/cancel GET]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await loadCancellableEvent(body.id, body.sig);
    if (result.error) {
      return Response.json({ error: result.error }, { status: result.status });
    }

    const { event, start, config } = result;
    await deleteBookingEvent(event.id);

    const props = event.extendedProperties?.private || {};
    sendCancellationEmails({
      startISO: start.toISOString(),
      name: props.patientName || "",
      email: props.patientEmail || event.attendees?.find((a) => !a.organizer)?.email || "",
      phone: props.patientPhone || "",
      locale: props.patientLocale || "el",
    }).catch((err) => console.error("[cancel emails]", err));

    // Υπενθυμίσεις και review email του ραντεβού δεν έχουν πια λόγο ύπαρξης.
    cancelScheduledEmails([
      props.reminder24EmailId,
      props.reminder2EmailId,
      props.reviewEmailId,
    ]).catch((err) => console.error("[cancel scheduled]", err));

    return Response.json({ success: true, ...eventDetails(event, start, config.timeZone) });
  } catch (err) {
    console.error("[booking/cancel POST]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
