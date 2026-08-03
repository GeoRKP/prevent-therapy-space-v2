"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// Μοναδικός μηχανισμός ανίχνευσης/διατήρησης γλώσσας. Τρέχει ΜΟΝΟ μετά το mount:
// το αρχικό render είναι πάντα "el" σε server και client (βλ. lib/i18n.js),
// αλλιώς προκύπτει hydration mismatch.
export default function LanguageDetector() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const persist = (lng) => {
      document.documentElement.lang = lng;
      try {
        localStorage.setItem("i18nextLng", lng);
      } catch {
        // ιδιωτική περιήγηση/γεμάτο storage — η γλώσσα απλώς δεν θα απομνημονευτεί
      }
    };
    i18n.on("languageChanged", persist);

    let saved = null;
    try {
      saved = localStorage.getItem("i18nextLng");
    } catch {}

    const target =
      saved === "el" || saved === "en"
        ? saved
        : (navigator.language || "el").split("-")[0].toLowerCase() === "en"
          ? "en"
          : "el";

    if (target !== i18n.language) i18n.changeLanguage(target);

    return () => i18n.off("languageChanged", persist);
  }, [i18n]);

  return null;
}
