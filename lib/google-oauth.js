// OAuth 2.0 της Google για τη σύνδεση του ημερολογίου από το /admin:
// state κατά CSRF (υπογεγραμμένο με HMAC, σε cookie) και ανταλλαγή του
// authorization code με refresh token. Server-side μόνο.
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/site";

export const STATE_COOKIE = "prevent_google_oauth";
const STATE_TTL_MS = 10 * 60_000;

// Μόνο ό,τι χρειάζεται: ραντεβού + διαθεσιμότητα, και το email ώστε να
// φαίνεται στο /admin ποιος λογαριασμός είναι συνδεδεμένος.
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
  "openid",
  "email",
];

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Λείπει η μεταβλητή περιβάλλοντος ${name}`);
  return value;
}

// Πρέπει να είναι δηλωμένο ως "Authorized redirect URI" στο OAuth client
// (Google Cloud console), π.χ. https://www.preventtherapy.gr/api/admin/google/callback
export function redirectUri() {
  return `${SITE_URL}/api/admin/google/callback`;
}

function stateKey() {
  return createHmac("sha256", requiredEnv("GOOGLE_CLIENT_SECRET"))
    .update("google-oauth-state")
    .digest();
}

function signState(payload) {
  return createHmac("sha256", stateKey()).update(payload).digest("base64url");
}

export function createState() {
  const payload = `${randomBytes(16).toString("base64url")}.${Date.now() + STATE_TTL_MS}`;
  return `${payload}.${signState(payload)}`;
}

export function verifyState(state) {
  const parts = String(state || "").split(".");
  if (parts.length !== 3) return false;
  const [nonce, exp, sig] = parts;
  if (!nonce || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  try {
    const expected = Buffer.from(signState(`${nonce}.${exp}`));
    const given = Buffer.from(sig);
    return expected.length === given.length && timingSafeEqual(expected, given);
  } catch {
    return false;
  }
}

export function authUrl(state) {
  return (
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: requiredEnv("GOOGLE_CLIENT_ID"),
      redirect_uri: redirectUri(),
      response_type: "code",
      scope: GOOGLE_SCOPES.join(" "),
      access_type: "offline",
      // Πάντα νέο refresh token, ακόμα κι αν ο λογαριασμός είχε ήδη δώσει άδεια
      prompt: "consent",
      state,
    })
  );
}

/** Ανταλλαγή του authorization code με tokens → { refreshToken, email }. */
export async function exchangeCode(code) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: requiredEnv("GOOGLE_CLIENT_ID"),
      client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      redirect_uri: redirectUri(),
      grant_type: "authorization_code",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Google token exchange (${res.status}): ${data.error || ""} ${data.error_description || ""}`.trim()
    );
  }
  return { refreshToken: data.refresh_token || null, email: emailFromIdToken(data.id_token) };
}

// Το id_token φτάνει απευθείας από τη Google μέσω TLS — αρκεί η αποκωδικοποίηση.
function emailFromIdToken(idToken) {
  try {
    const payload = String(idToken || "").split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof json.email === "string" ? json.email : null;
  } catch {
    return null;
  }
}

// Το Secure μόνο σε production — τοπικά (http) θα εμπόδιζε το cookie.
const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
const COOKIE_PATH = "/api/admin/google";

export function stateCookieHeader(state) {
  return `${STATE_COOKIE}=${state}; Path=${COOKIE_PATH}; HttpOnly; SameSite=Lax${secureFlag}; Max-Age=${STATE_TTL_MS / 1000}`;
}

export function clearStateCookieHeader() {
  return `${STATE_COOKIE}=; Path=${COOKIE_PATH}; HttpOnly; SameSite=Lax${secureFlag}; Max-Age=0`;
}

export function readStateCookie(request) {
  const cookies = request.headers.get("cookie") || "";
  const m = cookies.match(new RegExp(`(?:^|;\s*)${STATE_COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}
