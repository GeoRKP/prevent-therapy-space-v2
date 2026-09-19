// Έναρξη σύνδεσης Google Calendar από το /admin: ανακατεύθυνση στη σελίδα
// συγκατάθεσης της Google με υπογεγραμμένο state (cookie) κατά CSRF.
import { isAuthorized } from "@/lib/admin-auth";
import { SITE_URL } from "@/lib/site";
import { createState, authUrl, stateCookieHeader } from "@/lib/google-oauth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.redirect(`${SITE_URL}/admin`, 302);
  }
  try {
    const state = createState();
    return new Response(null, {
      status: 302,
      headers: { Location: authUrl(state), "Set-Cookie": stateCookieHeader(state) },
    });
  } catch (err) {
    console.error("[admin/google/connect]", err);
    return Response.redirect(`${SITE_URL}/admin?google=error&reason=config`, 302);
  }
}
