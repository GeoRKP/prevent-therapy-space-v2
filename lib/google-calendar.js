// Ελαφρύς client για το Google Calendar API v3 (REST) — χωρίς εξωτερικές βιβλιοθήκες.
// Χρησιμοποιεί το refresh token του φυσικοθεραπευτή (μία φορά εγγραφή, βλ. scripts/google-setup.mjs).
// Server-side μόνο.

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_BASE = "https://www.googleapis.com/calendar/v3";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Λείπει η μεταβλητή περιβάλλοντος ${name}`);
  return value;
}

export function getCalendarId() {
  return process.env.GOOGLE_CALENDAR_ID || "primary";
}

// Cache του access token στη μνήμη του server — ανανεώνεται λίγο πριν λήξει.
let tokenCache = { accessToken: null, expiresAt: 0 };

async function getAccessToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.accessToken;
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: requiredEnv("GOOGLE_CLIENT_ID"),
      client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      refresh_token: requiredEnv("GOOGLE_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Αποτυχία ανανέωσης Google token (${res.status}): ${body}`);
  }

  const data = await res.json();
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return tokenCache.accessToken;
}

async function calendarFetch(path, init = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Google Calendar API ${path} (${res.status}): ${body}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Επιστρέφει τα κατειλημμένα διαστήματα του ημερολογίου ως [{ start: Date, end: Date }].
 * @param {Date} timeMin
 * @param {Date} timeMax
 */
export async function getBusyIntervals(timeMin, timeMax) {
  const data = await calendarFetch("/freeBusy", {
    method: "POST",
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: getCalendarId() }],
    }),
  });

  const calendar = data.calendars?.[getCalendarId()];
  if (calendar?.errors?.length) {
    throw new Error(
      `Το freeBusy επέστρεψε σφάλμα για το ημερολόγιο: ${JSON.stringify(calendar.errors)}`
    );
  }

  return (calendar?.busy || []).map((b) => ({
    start: new Date(b.start),
    end: new Date(b.end),
  }));
}

/**
 * Δημιουργεί event ραντεβού στο ημερολόγιο του φυσικοθεραπευτή.
 * Ο ασθενής μπαίνει ως attendee, οπότε το Google του στέλνει αυτόματα
 * πρόσκληση/επιβεβαίωση με email (sendUpdates=all) — δεν χρειάζεται δικό μας email service.
 */
export async function createBookingEvent({ start, end, timeZone, name, email, phone, notes, locale }) {
  const description = [
    `Τηλέφωνο: ${phone}`,
    `Email: ${email}`,
    notes ? `Σημειώσεις: ${notes}` : null,
    "",
    "Κράτηση μέσω prevent-therapy.gr",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return calendarFetch(
    `/calendars/${encodeURIComponent(getCalendarId())}/events?sendUpdates=all`,
    {
      method: "POST",
      body: JSON.stringify({
        summary: `Ραντεβού — ${name}`,
        description,
        start: { dateTime: start.toISOString(), timeZone },
        end: { dateTime: end.toISOString(), timeZone },
        attendees: [{ email, displayName: name }],
        reminders: { useDefault: true },
        // Στοιχεία ασθενή πάνω στο ίδιο το event — για τη ροή ακύρωσης και τις
        // μελλοντικές υπενθυμίσεις, χωρίς εύθραυστο parsing του description.
        extendedProperties: {
          private: {
            patientName: name,
            patientEmail: email,
            patientPhone: phone,
            patientLocale: locale || "el",
            source: "prevent-booking",
          },
        },
      }),
    }
  );
}

/** Ενημερώνει τα private extendedProperties ενός event (merge, όχι αντικατάσταση). */
export async function patchBookingEventProps(eventId, privateProps) {
  return calendarFetch(
    `/calendars/${encodeURIComponent(getCalendarId())}/events/${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ extendedProperties: { private: privateProps } }),
    }
  );
}

/** Επιστρέφει ένα event, ή πετάει Error με .status (404/410 όταν δεν υπάρχει πια). */
export async function getBookingEvent(eventId) {
  return calendarFetch(
    `/calendars/${encodeURIComponent(getCalendarId())}/events/${encodeURIComponent(eventId)}`
  );
}

/** Διαγράφει event ραντεβού. Το sendUpdates=all στέλνει στον ασθενή και το email ακύρωσης της Google. */
export async function deleteBookingEvent(eventId) {
  return calendarFetch(
    `/calendars/${encodeURIComponent(getCalendarId())}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
    { method: "DELETE" }
  );
}
