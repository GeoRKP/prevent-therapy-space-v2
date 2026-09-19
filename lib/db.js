// Κοινό connection pool προς τη Neon Postgres (DATABASE_URL). Server-side μόνο.
// Η βάση κρατά ΜΟΝΟ ρυθμίσεις (κρατήσεων, σύνδεσης Google) — όχι ραντεβού:
// πηγή αλήθειας των ραντεβού είναι το Google Calendar.
import { Pool } from "pg";

let pool = null;

export function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 1,
    });
  }
  return pool;
}
