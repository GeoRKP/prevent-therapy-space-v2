// Λίστα επερχόμενων ραντεβού για το admin — ζωντανά από το Google Calendar.

import { isAuthorized } from "@/lib/admin-auth";
import { listBookingEventsBetween } from "@/lib/google-calendar";
import { getBookingConfig } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const config = await getBookingConfig();
    const now = new Date();
    const until = new Date(now.getTime() + (config.maxAdvanceDays + 1) * 86_400_000);
    const events = await listBookingEventsBetween(now, until);

    const appointments = events
      .filter((e) => e.start?.dateTime)
      .map((e) => {
        const props = e.extendedProperties?.private || {};
        return {
          id: e.id,
          start: e.start.dateTime,
          name: props.patientName || e.summary || "",
          phone: props.patientPhone || "",
          email: props.patientEmail || "",
          locale: props.patientLocale || "el",
        };
      });

    return Response.json({ appointments, timeZone: config.timeZone });
  } catch (err) {
    console.error("[admin/appointments]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
