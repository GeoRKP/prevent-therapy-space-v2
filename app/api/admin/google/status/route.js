// Κατάσταση σύνδεσης Google Calendar για το /admin (χωρίς να εκτίθεται το token).
import { isAuthorized } from "@/lib/admin-auth";
import { getGoogleConnection } from "@/lib/google-auth";
import { getCalendarId, probeGoogleAccess } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const conn = await getGoogleConnection();
  const probe = conn ? await probeGoogleAccess() : null;
  return Response.json({
    connected: Boolean(conn),
    source: conn?.source || null,
    email: conn?.email || null,
    connectedAt: conn?.connectedAt || null,
    calendarId: getCalendarId(),
    probe,
  });
}
