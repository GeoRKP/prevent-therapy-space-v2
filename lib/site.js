// Κεντρικά στοιχεία του site — ένα σημείο αλήθειας για URL και όνομα.
// Το NEXT_PUBLIC_SITE_URL ορίζεται στο Vercel (production: https://www.preventtherapy.gr)
// και στο .env.local (τοπικά: http://localhost:3000). Χωρίς αυτό, fallback στο live domain.
export const SITE_NAME = "PREVENT Therapy Space";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.preventtherapy.gr"
).replace(/\/$/, "");

export const HOME_TITLE =
  "PREVENT Therapy Space | Φυσικοθεραπεία & Οστεοπαθητική στα Πατήσια";

export const HOME_DESCRIPTION =
  "Σύγχρονο φυσικοθεραπευτήριο στα Πατήσια, Αθήνα. Εξειδικευμένη φυσικοθεραπεία, οστεοπαθητική & θεραπευτική άσκηση.";
