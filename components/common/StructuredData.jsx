"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { businessJsonLd } from "@/lib/structured-data";

// Το JSON-LD αποδίδεται ήδη server-side (app/layout.jsx, id="ld-business").
// Εδώ απλώς ενημερώνεται στη γλώσσα του επισκέπτη μετά το mount.
export default function StructuredData() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language === "en" ? "en" : "el";
    let script = document.getElementById("ld-business");
    if (!script) {
      script = document.createElement("script");
      script.id = "ld-business";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(businessJsonLd(lang));
  }, [i18n.language]);

  return null;
}
