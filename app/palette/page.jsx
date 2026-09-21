"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServicesGrid } from "@/components/physio/ServicesGrid";
import { HowItWorks } from "@/components/physio/HowItWorks";
import { PALETTES } from "@/components/common/PaletteParam";

// Σελίδα απόφασης για τον πελάτη: το ίδιο τμήμα της αρχικής (Υπηρεσίες +
// Διαδρομή θεραπείας, δηλαδή κάρτες πάνω σε βασικό και εναλλασσόμενο φόντο)
// τρεις φορές, σε τρία στιλ. Τα στιλ ισχύουν μόνο κάτω από 992px — βλ. το
// μπλοκ [data-palette] στο globals.css. Ο σύνδεσμος «όλη η αρχική» ανοίγει το
// site με το στιλ αυτό (?palette=…, κρατιέται για τη συνεδρία).
export default function PalettePage() {
  return (
    <>
      <section className="bg-[#050810] pt-28 pb-10 lg:pt-36">
        <div className="container">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Δοκιμή για το κινητό
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
            Τρία στιλ, ίδιο περιεχόμενο
          </h1>
          <p className="mt-4 max-w-xl text-white/70 leading-relaxed">
            Δείτε τη σελίδα από το κινητό σας. Παρακάτω το ίδιο τμήμα της
            αρχικής εμφανίζεται τρεις φορές, με διαφορετικό φόντο και κάρτες.
            Πείτε μας ποιο προτιμάτε: Α, Β ή Γ. Σε κάθε στιλ υπάρχει και
            σύνδεσμος για να δείτε ολόκληρη την αρχική έτσι.
          </p>
          <p className="mt-3 text-sm text-white/50">
            Σε υπολογιστή η εμφάνιση δεν αλλάζει — η δοκιμή αφορά μόνο το κινητό.
          </p>
        </div>
      </section>

      {PALETTES.map((p, i) => (
        <div key={p.id} data-palette={p.id}>
          <div className="sticky top-16 z-30 border-y border-white/10 bg-[#050810]/90 backdrop-blur-md">
            <div className="container flex items-center justify-between gap-4 py-3">
              <div className="flex items-baseline gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-soft-foreground">
                  {["Α", "Β", "Γ"][i]}
                </span>
                <span className="font-bold text-white">{p.label}</span>
              </div>
              <Link
                href={`/?palette=${p.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/80 hover:border-primary-soft/60 hover:text-primary-soft transition-colors"
              >
                Όλη η αρχική έτσι
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          <ServicesGrid />
          <HowItWorks />
        </div>
      ))}
    </>
  );
}
