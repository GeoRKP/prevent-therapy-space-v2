"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function StructuredData() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const lang = i18n.language || "el";
    const url = process.env.NEXT_PUBLIC_SITE_URL || "https://preventtherapy.gr";

    const business = {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: "PREVENT Therapy Space",
      url,
      logo: `${url}/images/logo.webp`,
      image: `${url}/images/og-image.webp`,
      description:
        lang === "el"
          ? "Σύγχρονο φυσικοθεραπευτήριο στα Πατήσια, Αθήνα — εξειδικευμένη φυσικοθεραπεία, οστεοπαθητική και θεραπευτική άσκηση."
          : "Modern physiotherapy clinic in Patisia, Athens — specialized physiotherapy, osteopathy, and therapeutic exercise.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Theotokopoulou 55",
        addressLocality: "Patisia",
        addressRegion: "Attica",
        addressCountry: "GR",
      },
      telephone: "+302101234567",
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

    let script = document.getElementById("ld-business");
    if (!script) {
      script = document.createElement("script");
      script.id = "ld-business";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(business);
  }, [i18n.language]);

  return null;
}
