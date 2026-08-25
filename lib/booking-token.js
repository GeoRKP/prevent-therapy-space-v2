// Υπογεγραμμένα links ακύρωσης χωρίς βάση δεδομένων: το event id υπογράφεται
// με HMAC ώστε κανείς να μην μπορεί να ακυρώσει ραντεβού άλλου μαντεύοντας ids.
// Server-side μόνο.

import { createHmac, timingSafeEqual } from "node:crypto";

// Δικό του secret αν οριστεί, αλλιώς το GOOGLE_CLIENT_SECRET (υπάρχει σίγουρα
// αφού χωρίς αυτό δεν λειτουργεί καθόλου το booking).
function signingKey() {
  const secret =
    process.env.BOOKING_LINK_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  if (!secret) throw new Error("Λείπει BOOKING_LINK_SECRET / GOOGLE_CLIENT_SECRET");
  return createHmac("sha256", secret).update("booking-cancel-links").digest();
}

export function signEventId(eventId) {
  return createHmac("sha256", signingKey()).update(eventId).digest("base64url");
}

export function verifyEventSignature(eventId, signature) {
  if (!eventId || !signature) return false;
  const expected = Buffer.from(signEventId(eventId));
  const given = Buffer.from(String(signature));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function cancelUrl(eventId) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/cancel?id=${encodeURIComponent(eventId)}&sig=${signEventId(eventId)}`;
}
