// Αφαίρεση της σύνδεσης Google Calendar που έγινε από το /admin.
import { isAuthorized } from "@/lib/admin-auth";
import { clearGoogleConnection } from "@/lib/google-auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    await clearGoogleConnection();
    return Response.json({
      success: true,
      fallbackToEnv: Boolean(process.env.GOOGLE_REFRESH_TOKEN),
    });
  } catch (err) {
    console.error("[admin/google/disconnect]", err);
    return Response.json({ error: "server" }, { status: 500 });
  }
}
