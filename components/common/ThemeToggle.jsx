"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

// Εναλλαγή light/dark. Η αλήθεια ζει στο data-theme του <html> (το ορίζει το
// inline script στο app/layout.jsx πριν το paint) και στο localStorage "theme".
// Τα εικονίδια τα διαλέγει το CSS (globals.css .theme-toggle-*), οπότε είναι
// σωστά από το πρώτο render· το state εδώ χρειάζεται μόνο για το aria-label.
export function ThemeToggle({ className }) {
  const { t, ready } = useTranslation("header");
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "dark");
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode / blocked storage: η επιλογή ισχύει για τη σελίδα μόνο */
    }
  };

  const label =
    ready && theme
      ? t(theme === "light" ? "header:theme.toDark" : "header:theme.toLight")
      : "Light / dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-ink-70 hover:text-ink hover:bg-ink/[0.04] transition-colors",
        className
      )}
      aria-label={label}
      title={label}
    >
      <Sun className="w-[18px] h-[18px] theme-toggle-sun" aria-hidden="true" />
      <Moon className="w-[18px] h-[18px] theme-toggle-moon" aria-hidden="true" />
    </button>
  );
}
