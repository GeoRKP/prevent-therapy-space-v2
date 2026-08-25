// Ρυθμίσεις κρατήσεων από τη Neon (πίνακας prevent_booking_settings, 1 γραμμή
// JSONB) με μικρό in-memory cache. Αν η βάση λείπει ή αποτύχει, επιστρέφονται
// τα defaults από το data/booking.js — το booking δεν σταματά ποτέ εξαιτίας
// της βάσης. Τα ραντεβού ΔΕΝ αποθηκεύονται εδώ: πηγή αλήθειας το Calendar.
// Server-side μόνο.

import { Pool } from "pg";
import { bookingConfig as defaults } from "@/data/booking";

let pool = null;
function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 1,
    });
  }
  return pool;
}

let cache = { value: null, at: 0 };
const CACHE_TTL_MS = 30_000;

export async function getBookingConfig() {
  if (cache.value && Date.now() - cache.at < CACHE_TTL_MS) return cache.value;

  let merged = { ...defaults };
  try {
    const p = getPool();
    if (p) {
      const res = await p.query(
        "SELECT data FROM prevent_booking_settings WHERE id = 1"
      );
      if (res.rows[0]?.data) {
        // Η ζώνη ώρας μένει πάντα αυτή του κώδικα — δεν είναι ρύθμιση.
        merged = { ...defaults, ...res.rows[0].data, timeZone: defaults.timeZone };
      }
    }
  } catch (err) {
    console.error("[settings] fallback στα defaults:", err.message);
  }

  cache = { value: merged, at: Date.now() };
  return merged;
}

export async function saveBookingConfig(data) {
  const p = getPool();
  if (!p) throw new Error("Λείπει το DATABASE_URL");
  await p.query(
    `INSERT INTO prevent_booking_settings (id, data, updated_at)
     VALUES (1, $1::jsonb, now())
     ON CONFLICT (id) DO UPDATE SET data = $1::jsonb, updated_at = now()`,
    [JSON.stringify(data)]
  );
  cache = { value: null, at: 0 };
}
