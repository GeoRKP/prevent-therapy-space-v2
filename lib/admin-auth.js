// Auth του admin (ένας χρήστης — ο θεραπευτής): σύγκριση με ADMIN_PASSWORD
// και υπογεγραμμένο session cookie 7 ημερών. Server-side μόνο.

import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "prevent_admin";
const SESSION_DAYS = 7;

function key() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("Λείπει το ADMIN_PASSWORD");
  return createHmac("sha256", secret).update("admin-session").digest();
}

function sign(value) {
  return createHmac("sha256", key()).update(value).digest("base64url");
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(password || "", expected);
}

export function createSessionToken() {
  const exp = String(Date.now() + SESSION_DAYS * 86_400_000);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token) {
  if (!token) return false;
  const [exp, sig] = String(token).split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  try {
    return safeEqual(sig, sign(exp));
  } catch {
    return false;
  }
}

/** Έλεγχος session από το cookie ενός Request. */
export function isAuthorized(request) {
  const cookies = request.headers.get("cookie") || "";
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`));
  return verifySessionToken(match?.[1]);
}

// Το Secure μόνο σε production — τοπικά (http) θα εμπόδιζε το cookie.
const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";

export function sessionCookieHeader(token) {
  const maxAge = SESSION_DAYS * 86_400;
  return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax${secureFlag}; Max-Age=${maxAge}`;
}

export function clearCookieHeader() {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax${secureFlag}; Max-Age=0`;
}
