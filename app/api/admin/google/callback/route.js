// Επιστροφή από τη Google: έλεγχος state, ανταλλαγή code → refresh token,
// αποθήκευση στη Neon, επιστροφή στο /admin με αποτέλεσμα στο query string.
import { isAuthorized } from "@/lib/admin-auth";
import { SITE_URL } from "@/lib/site";
import {
  readStateCookie,
  verifyState,
  exchangeCode,
  clearStateCookieHeader,
  missingScopes,
} from "@/lib/google-oauth";
import { saveGoogleConnection } from "@/lib/google-auth";

export const dynamic = "force-dynamic";

function backToAdmin(result, reason) {
  const url = new URL("/admin", SITE_URL);
  url.searchParams.set("google", result);
  if (reason) url.searchParams.set("reason", reason);
  return new Response(null, {
    status: 302,
    headers: { Location: url.toString(), "Set-Cookie": clearStateCookieHeader() },
  });
}

export async function GET(request) {
  if (!isAuthorized(request)) return backToAdmin("error", "unauthorized");

  const { searchParams } = new URL(request.url);
  if (searchParams.get("error")) return backToAdmin("denied");

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieState = readStateCookie(request);
  if (!code || !state || !cookieState || state !== cookieState || !verifyState(state)) {
    return backToAdmin("error", "state");
  }

  try {
    const { refreshToken, email, scope } = await exchangeCode(code);
    if (!refreshToken) return backToAdmin("error", "no_refresh_token");
    // Η Google επιτρέπει στον χρήστη να αφήσει ατσέκαριστα τα δικαιώματα ημερολογίου —
    // τότε το token είναι άχρηστο και ΔΕΝ αποθηκεύεται (θα «έκρυβε» το fallback που δουλεύει).
    if (missingScopes(scope).length) return backToAdmin("error", "scopes");
    await saveGoogleConnection({ refreshToken, email });
    return backToAdmin("connected");
  } catch (err) {
    console.error("[admin/google/callback]", err);
    return backToAdmin("error", "exchange");
  }
}
