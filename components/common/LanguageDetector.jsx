"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageDetector() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("i18nextLng");
    if (saved && (saved === "el" || saved === "en")) {
      if (saved !== i18n.language) i18n.changeLanguage(saved);
      return;
    }

    const browserLang = (navigator.language || "el").split("-")[0].toLowerCase();
    const target = browserLang === "en" ? "en" : "el";
    if (target !== i18n.language) i18n.changeLanguage(target);
  }, [i18n]);

  return null;
}
