"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Τα τρία δοκιμαστικά στιλ για το κινητό (βλ. /palette και globals.css).
export const PALETTES = [
  { id: "teal", label: "Πετρόλ" },
  { id: "graphite", label: "Γραφίτης" },
  { id: "sage", label: "Φασκόμηλο" },
];

// ?palette=teal|graphite|sage βάζει data-palette στο <html> ώστε ολόκληρο το
// site να φαίνεται με το στιλ αυτό· η επιλογή κρατιέται για τη συνεδρία
// (sessionStorage), ?palette=off την καθαρίζει. Χωρίς παράμετρο και χωρίς
// αποθηκευμένη επιλογή δεν κάνει τίποτα — το site είναι ως έχει.
// Τρέχει ξανά σε κάθε αλλαγή διαδρομής (το AppShell δεν ξαναμοντάρεται σε
// client-side navigation, οπότε το [] θα διάβαζε την παράμετρο μόνο μία φορά).
export default function PaletteParam() {
  const pathname = usePathname();
  useEffect(() => {
    const ids = PALETTES.map((p) => p.id);
    let wanted = null;
    try {
      const q = new URLSearchParams(window.location.search).get("palette");
      if (q === "off") {
        sessionStorage.removeItem("palette");
      } else if (q && ids.includes(q)) {
        sessionStorage.setItem("palette", q);
        wanted = q;
      } else {
        const saved = sessionStorage.getItem("palette");
        if (saved && ids.includes(saved)) wanted = saved;
      }
    } catch {
      /* private mode / blocked storage — απλά χωρίς επιμονή */
    }
    if (wanted) document.documentElement.setAttribute("data-palette", wanted);
    else document.documentElement.removeAttribute("data-palette");
  }, [pathname]);
  return null;
}
