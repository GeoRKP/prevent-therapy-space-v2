"use client";

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLocale = () => {
    const next = i18n.language === "el" ? "en" : "el";
    i18n.changeLanguage(next);
  };

  const otherLang = i18n.language === "el" ? "EN" : "EL";

  return (
    <button
      onClick={toggleLocale}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-ink-70 hover:text-ink hover:bg-ink/[0.04] transition-colors"
      aria-label={`Switch to ${otherLang}`}
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-semibold uppercase">{otherLang}</span>
    </button>
  );
}
