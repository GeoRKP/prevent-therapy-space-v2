// Ρυθμίσεις κρατήσεων — τις αλλάζει ο φυσικοθεραπευτής εδώ (ή μέσω env vars).
// Δεν χρειάζεται βάση δεδομένων: η διαθεσιμότητα προκύπτει από το Google Calendar.

export const bookingConfig = {
  // Ζώνη ώρας του ιατρείου
  timeZone: "Europe/Athens",

  // Διάρκεια ραντεβού σε λεπτά (override με BOOKING_DURATION_MINUTES στο .env)
  durationMinutes: Number(process.env.BOOKING_DURATION_MINUTES) || 45,

  // Ελάχιστη προειδοποίηση: πόσες ώρες πριν δεν επιτρέπεται νέα κράτηση
  minNoticeHours: Number(process.env.BOOKING_MIN_NOTICE_HOURS) || 2,

  // Πόσες μέρες μπροστά μπορεί να κλείσει κανείς ραντεβού
  maxAdvanceDays: Number(process.env.BOOKING_MAX_ADVANCE_DAYS) || 30,

  // Ωράριο ανά ημέρα εβδομάδας (0=Κυριακή, 1=Δευτέρα ... 6=Σάββατο).
  // Κάθε ημέρα δέχεται λίστα διαστημάτων ώστε να υποστηρίζεται και διάλειμμα,
  // π.χ. [{ from: "09:00", to: "14:00" }, { from: "17:00", to: "21:00" }].
  // null ή [] σημαίνει κλειστά.
  workingHours: {
    0: null,
    1: [{ from: "09:00", to: "21:00" }],
    2: [{ from: "09:00", to: "21:00" }],
    3: [{ from: "09:00", to: "21:00" }],
    4: [{ from: "09:00", to: "21:00" }],
    5: [{ from: "09:00", to: "21:00" }],
    6: null,
  },
};
