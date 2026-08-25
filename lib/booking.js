// Υπολογισμός διαθέσιμων ραντεβού: ωράριο (ρυθμίσεις από lib/settings.js)
// μείον κατειλημμένα διαστήματα από το Google Calendar. Server-side μόνο.

import { getBookingConfig } from "@/lib/settings";
import { getBusyIntervals } from "@/lib/google-calendar";

// --- Βοηθητικά ζώνης ώρας (χωρίς εξωτερική βιβλιοθήκη) ---

// Απόκλιση (ms) της ζώνης ώρας από UTC τη δεδομένη στιγμή (σέβεται θερινή ώρα).
function tzOffsetMs(date, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(date).map((p) => [p.type, p.value])
  );
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );
  return asUTC - date.getTime();
}

// Μετατρέπει τοπική ώρα ιατρείου ("YYYY-MM-DD", "HH:mm") σε UTC Date.
export function zonedTimeToUtc(dateStr, timeStr, timeZone) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = timeStr.split(":").map(Number);
  const utcGuess = Date.UTC(y, mo - 1, d, h, mi);
  const offset = tzOffsetMs(new Date(utcGuess), timeZone);
  return new Date(utcGuess - offset);
}

// "YYYY-MM-DD" της δεδομένης στιγμής στη ζώνη ώρας του ιατρείου.
function dateStrInTz(date, timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDays(dateStr, days) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const next = new Date(Date.UTC(y, mo - 1, d + days));
  return next.toISOString().slice(0, 10);
}

function dayOfWeek(dateStr) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
}

function minutesOf(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function timeStrOf(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// --- Παραγωγή slots ---

// Όλα τα slots μιας ημέρας βάσει ωραρίου (χωρίς έλεγχο διαθεσιμότητας): ["09:00", "09:45", ...]
export function slotsForDay(dateStr, config) {
  const { workingHours, durationMinutes } = config;
  const ranges = workingHours[dayOfWeek(dateStr)];
  if (!ranges || ranges.length === 0) return [];

  const slots = [];
  for (const range of ranges) {
    const from = minutesOf(range.from);
    const to = minutesOf(range.to);
    for (let t = from; t + durationMinutes <= to; t += durationMinutes) {
      slots.push(timeStrOf(t));
    }
  }
  return slots;
}

function overlapsBusy(start, end, busy) {
  return busy.some((b) => start < b.end && end > b.start);
}

/**
 * Διαθεσιμότητα για όλο το παράθυρο κρατήσεων με ΜΙΑ κλήση freeBusy.
 * Επιστρέφει { timeZone, durationMinutes, days: [{ date, slots: ["09:00", ...] }] }.
 */
export async function getAvailability() {
  const config = await getBookingConfig();
  const { timeZone, durationMinutes, minNoticeHours, maxAdvanceDays } = config;

  const now = new Date();
  const earliest = new Date(now.getTime() + minNoticeHours * 3_600_000);
  const firstDay = dateStrInTz(now, timeZone);
  const lastDay = addDays(firstDay, maxAdvanceDays);

  const windowStart = zonedTimeToUtc(firstDay, "00:00", timeZone);
  const windowEnd = zonedTimeToUtc(addDays(lastDay, 1), "00:00", timeZone);
  const busy = await getBusyIntervals(windowStart, windowEnd);

  const days = [];
  for (let day = firstDay; day <= lastDay; day = addDays(day, 1)) {
    const slots = slotsForDay(day, config).filter((time) => {
      const start = zonedTimeToUtc(day, time, timeZone);
      const end = new Date(start.getTime() + durationMinutes * 60_000);
      return start >= earliest && !overlapsBusy(start, end, busy);
    });
    if (slots.length > 0) days.push({ date: day, slots });
  }

  return { timeZone, durationMinutes, days };
}

/**
 * Έλεγχος ότι το ζητούμενο slot είναι έγκυρο (μέσα στο ωράριο/παράθυρο)
 * και ακόμα ελεύθερο στο Google Calendar. Επιστρέφει { start, end } σε UTC.
 * Πετάει Error με .code = "invalid_slot" ή "slot_taken".
 */
export async function assertSlotAvailable(dateStr, timeStr) {
  const config = await getBookingConfig();
  const { timeZone, durationMinutes, minNoticeHours, maxAdvanceDays } = config;

  const now = new Date();
  const firstDay = dateStrInTz(now, timeZone);
  const lastDay = addDays(firstDay, maxAdvanceDays);

  const validDay = dateStr >= firstDay && dateStr <= lastDay;
  const validTime = slotsForDay(dateStr, config).includes(timeStr);
  const start = zonedTimeToUtc(dateStr, timeStr, timeZone);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const earliest = new Date(now.getTime() + minNoticeHours * 3_600_000);

  if (!validDay || !validTime || start < earliest) {
    const err = new Error("Μη έγκυρο slot ραντεβού");
    err.code = "invalid_slot";
    throw err;
  }

  const busy = await getBusyIntervals(start, end);
  if (overlapsBusy(start, end, busy)) {
    const err = new Error("Το slot μόλις κρατήθηκε");
    err.code = "slot_taken";
    throw err;
  }

  return { start, end, config };
}
