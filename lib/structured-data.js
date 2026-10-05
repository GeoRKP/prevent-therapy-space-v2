// Schema.org JSON-LD της επιχείρησης. Αποδίδεται server-side στο root layout
// (ελληνικά) και ενημερώνεται client-side από το StructuredData όταν αλλάζει γλώσσα.
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { googleReviews } from "@/data/reviews";

export function businessJsonLd(lang = "el") {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.webp`,
    image: `${SITE_URL}/images/og-image-el.jpg`,
    description:
      lang === "en"
        ? "Modern physiotherapy clinic in Patisia, Athens — specialized physiotherapy, osteopathy, and therapeutic exercise."
        : "Σύγχρονο φυσικοθεραπευτήριο στα Πατήσια, Αθήνα — εξειδικευμένη φυσικοθεραπεία, οστεοπαθητική και θεραπευτική άσκηση.",
    address:
      lang === "en"
        ? {
            "@type": "PostalAddress",
            streetAddress: "Theotokopoulou 55",
            addressLocality: "Patisia, Athens",
            addressRegion: "Attica",
            postalCode: "111 44",
            addressCountry: "GR",
          }
        : {
            "@type": "PostalAddress",
            streetAddress: "Θεοτοκοπούλου 55",
            addressLocality: "Πατήσια, Αθήνα",
            addressRegion: "Αττική",
            postalCode: "111 44",
            addressCountry: "GR",
          },
    // Συντεταγμένες και λινκ της καταχώρησης στο Google Maps (2026-10-05)
    geo: { "@type": "GeoCoordinates", latitude: 38.0177459, longitude: 23.7335341 },
    hasMap: googleReviews.url,
    sameAs: [
      "https://www.instagram.com/prevent_therapy_space/",
      "https://www.doctoranytime.gr/d/Physicotherapeftis/patsakis-konstantinos-2",
    ],
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
