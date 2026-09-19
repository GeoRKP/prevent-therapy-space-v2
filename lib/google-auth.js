// Η σύνδεση με το Google Calendar του θεραπευτή (refresh token).
// Προτεραιότητα: (1) ό,τι συνέδεσε ο θεραπευτής από το /admin → πίνακας
// prevent_google_auth στη Neon, (2) fallback το env GOOGLE_REFRESH_TOKEN
// (τοπική ανάπτυξη / παλιός τρόπος με npm run google:setup). Server-side μόνο.
import { getPool } from "@/lib/db";

const TABLE = "prevent_google_auth";
const CACHE_TTL_MS = 60_000;

// undefined = δεν έχει διαβαστεί ακόμα, null = δεν υπάρχει καμία σύνδεση
let cache = { value: undefined, at: 0 };

async function ensureTable(p) {
  await p.query(`CREATE TABLE IF NOT EXISTS ${TABLE} (
    id smallint PRIMARY KEY,
    refresh_token text NOT NULL,
    account_email text,
    connected_at timestamptz NOT NULL DEFAULT now()
  )`);
}

/**
 * Η ενεργή σύνδεση: { refreshToken, email, connectedAt, source: "db" | "env" }
 * ή null. Cache 60" ώστε η αλλαγή λογαριασμού να «πιάνει» γρήγορα σε όλα τα
 * instances χωρίς query σε κάθε κλήση του ημερολογίου.
 */
export async function getGoogleConnection() {
  if (cache.value !== undefined && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.value;
  }

  let conn = null;
  try {
    const p = getPool();
    if (p) {
      const res = await p.query(
        `SELECT refresh_token, account_email, connected_at FROM ${TABLE} WHERE id = 1`
      );
      const row = res.rows[0];
      if (row?.refresh_token) {
        conn = {
          refreshToken: row.refresh_token,
          email: row.account_email || null,
          connectedAt: row.connected_at,
          source: "db",
        };
      }
    }
  } catch (err) {
    // 42P01 = ο πίνακας δεν υπάρχει ακόμα (καμία σύνδεση από το /admin) — φυσιολογικό
    if (err.code !== "42P01") console.error("[google-auth] fallback στο env:", err.message);
  }

  if (!conn && process.env.GOOGLE_REFRESH_TOKEN) {
    conn = {
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      email: null,
      connectedAt: null,
      source: "env",
    };
  }

  cache = { value: conn, at: Date.now() };
  return conn;
}

/** Αποθήκευση νέας σύνδεσης (μία γραμμή, id = 1). */
export async function saveGoogleConnection({ refreshToken, email }) {
  const p = getPool();
  if (!p) throw new Error("Λείπει το DATABASE_URL");
  await ensureTable(p);
  await p.query(
    `INSERT INTO ${TABLE} (id, refresh_token, account_email, connected_at)
     VALUES (1, $1, $2, now())
     ON CONFLICT (id) DO UPDATE
       SET refresh_token = EXCLUDED.refresh_token,
           account_email = EXCLUDED.account_email,
           connected_at = now()`,
    [refreshToken, email || null]
  );
  cache = { value: undefined, at: 0 };
}

/** Αφαίρεση της σύνδεσης από τη βάση (μένει μόνο το τυχόν env fallback). */
export async function clearGoogleConnection() {
  const p = getPool();
  if (!p) throw new Error("Λείπει το DATABASE_URL");
  try {
    await p.query(`DELETE FROM ${TABLE} WHERE id = 1`);
  } catch (err) {
    if (err.code !== "42P01") throw err;
  }
  cache = { value: undefined, at: 0 };
}
