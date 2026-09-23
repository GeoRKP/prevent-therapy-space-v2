// Κοινοί κανόνες για τις φόρμες επικοινωνίας και κράτησης. Τρέχουν και στον
// browser (μηνύματα κάτω από κάθε πεδίο) και στα API routes (τελικός έλεγχος),
// ώστε ο χρήστης να βλέπει ακριβώς τον ίδιο λόγο που θα απέρριπτε ο server.
//
// Κάθε έλεγχος επιστρέφει null (έγκυρο) ή { code, params }. Το code είναι
// κλειδί στο common:validation.* (el/en) και τα params μπαίνουν στο
// interpolation του i18next (π.χ. πόσα ψηφία λείπουν).

export const LIMITS = {
  nameMax: 120,
  emailMax: 254,
  messageMin: 5,
  messageMax: 3000,
  notesMax: 1000,
  phoneDigits: 10, // ελληνικός αριθμός χωρίς το +30
  intlMin: 8,
  intlMax: 15, // E.164
};

const fail = (code, params) => (params ? { code, params } : { code });
const GREEK = /[Ͱ-Ͽἀ-῿]/;

export function checkName(raw) {
  const v = String(raw ?? "").trim();
  if (!v) return fail("nameRequired");
  if (/\d/.test(v)) return fail("nameDigits");
  if (v.replace(/[^\p{L}]/gu, "").length < 2) return fail("nameTooShort");
  if (v.length > LIMITS.nameMax)
    return fail("nameTooLong", { max: LIMITS.nameMax, count: v.length });
  return null;
}

// Οι κανόνες ακολουθούν το regex email του zod, ώστε ό,τι περνά εδώ να το
// δέχεται και το Resend (replyTo) — αλλά με συγκεκριμένο λόγο ανά λάθος.
export function checkEmail(raw) {
  const v = String(raw ?? "").trim();
  if (!v) return fail("emailRequired");
  if (GREEK.test(v)) return fail("emailGreek");
  if (/\s/.test(v)) return fail("emailSpaces");
  const ats = v.split("@").length - 1;
  if (ats === 0) return fail("emailNoAt");
  if (ats > 1) return fail("emailManyAt");
  const [local, domain] = v.split("@");
  if (!local) return fail("emailNoLocal");
  if (!domain) return fail("emailNoDomain");
  if (!/^[A-Za-z0-9_'+\-.]+$/.test(local)) return fail("emailLocalChars");
  if (local.startsWith(".") || local.endsWith(".") || local.includes(".."))
    return fail("emailDots");
  if (!domain.includes(".")) return fail("emailNoDot");
  const labels = domain.split(".");
  if (labels.some((l) => !l) || !labels.every((l) => /^[A-Za-z0-9][A-Za-z0-9-]*$/.test(l)))
    return fail("emailDomain");
  if (!/^[A-Za-z]{2,}$/.test(labels[labels.length - 1])) return fail("emailTld");
  if (v.length > LIMITS.emailMax) return fail("emailTooLong");
  return null;
}

// Ελληνικός αριθμός: 10 ψηφία, 69… κινητό ή 2… σταθερό (με ή χωρίς +30 /
// 0030). Αριθμός εξωτερικού: + ή 00 και κωδικός χώρας, 8–15 ψηφία συνολικά.
// Κενά, παύλες, τελείες και παρενθέσεις επιτρέπονται και αγνοούνται.
export function checkPhone(raw, { required = true } = {}) {
  const v = String(raw ?? "").trim();
  if (!v) return required ? fail("phoneRequired") : null;
  if (/\p{L}/u.test(v)) return fail("phoneLetters");
  if (/[^\d\s+().\-/]/.test(v)) return fail("phoneChars");
  if ((v.match(/\+/g) || []).length > 1 || v.lastIndexOf("+") > 0) return fail("phonePlus");

  let digits = v.replace(/\D/g, "");
  let intl = v.startsWith("+");
  if (!intl && digits.startsWith("00")) {
    intl = true;
    digits = digits.slice(2);
  }
  if (intl && digits.startsWith("30")) {
    intl = false;
    digits = digits.slice(2);
  }

  if (intl) {
    if (digits.length < LIMITS.intlMin || digits.length > LIMITS.intlMax)
      return fail("phoneIntlLength", {
        count: digits.length,
        min: LIMITS.intlMin,
        max: LIMITS.intlMax,
      });
    return null;
  }

  const n = LIMITS.phoneDigits;
  if (digits !== "6" && !/^(69|2)/.test(digits)) return fail("phonePrefix");
  if (digits.length < n)
    return fail("phoneTooShort", { count: digits.length, missing: n - digits.length, total: n });
  if (digits.length > n)
    return fail("phoneTooLong", { count: digits.length, extra: digits.length - n, total: n });
  return null;
}

export function checkMessage(raw) {
  const v = String(raw ?? "").trim();
  if (!v) return fail("messageRequired");
  if (v.length < LIMITS.messageMin)
    return fail("messageTooShort", { min: LIMITS.messageMin, count: v.length });
  if (v.length > LIMITS.messageMax)
    return fail("messageTooLong", { max: LIMITS.messageMax, count: v.length });
  return null;
}

export function checkNotes(raw) {
  const v = String(raw ?? "").trim();
  if (v.length > LIMITS.notesMax)
    return fail("notesTooLong", { max: LIMITS.notesMax, count: v.length });
  return null;
}

function collect(entries) {
  const errors = {};
  for (const [field, result] of entries) if (result) errors[field] = result;
  return errors;
}

// Σειρά = σειρά των πεδίων στη φόρμα (το πρώτο λάθος παίρνει το focus).
export const CONTACT_FIELDS = ["name", "email", "phone", "message", "consent"];
export const BOOKING_FIELDS = ["name", "email", "phone", "notes", "consent"];

export function validateContact(v) {
  return collect([
    ["name", checkName(v.name)],
    ["email", checkEmail(v.email)],
    ["phone", checkPhone(v.phone, { required: false })],
    ["message", checkMessage(v.message)],
    ["consent", v.consent === true ? null : fail("consentContact")],
  ]);
}

export function validateBooking(v) {
  return collect([
    ["name", checkName(v.name)],
    ["email", checkEmail(v.email)],
    ["phone", checkPhone(v.phone, { required: true })],
    ["notes", checkNotes(v.notes)],
    ["consent", v.consent === true ? null : fail("consentBooking")],
  ]);
}
