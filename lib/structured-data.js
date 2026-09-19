// Schema.org JSON-LD της επιχείρησης. Αποδίδεται server-side στο root layout
// (ελληνικά) και ενημερώνεται client-side από το StructuredData όταν αλλάζει γλώσσα.
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function businessJsonLd(lang = "el") {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.webp`,
    image: `${SITE_URL}/images/og-image.jpg`,
    description:
      lang === "en"
        ? "Modern physiotherapy clinic in Patisia, Athens — specialized physiotherapy, osteopathy, and therapeutic exercise."
        : "Σύγχρονο φυσικοθεραπευτήριο στα Πατήσια, Αθήνα — εξειδικευμένη φυσικοθεραπεία, οστεοπαθητική και θεραπευτική άσκηση.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Theotokopoulou 55",
      addressLocality: "Patisia",
      addressRegion: "Attica",
      addressCountry: "GR",
    },
    telephone: "+306972952263",
    email: "info@preventtherapy.gr",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
  };
}

// Ασφαλής σειριοποίηση μέσα σε <script>: το "<" δεν πρέπει να κλείσει το tag.
export function jsonLdString(data) {
  return JSON.stringify(data).replace(/</g, "\u003c");
}
