"use client";

import { useTranslation } from "react-i18next";
import { ArrowUpRight, Stethoscope, Hand, CalendarCheck, Users } from "lucide-react";
import { PALETTES } from "@/components/common/PaletteParam";

// Σελίδα απόφασης για τον πελάτη: ένα μικρό, ίδιο δείγμα της αρχικής (δύο
// κάρτες υπηρεσιών πάνω στο βασικό φόντο + δύο βήματα πάνω στο εναλλασσόμενο)
// τρεις φορές στη σειρά, με διαφορετικό στιλ χρωμάτων, ώστε να συγκρίνονται
// χωρίς πολύ σκρολ. Οι κλάσεις είναι ίδιες με τις πραγματικές ενότητες
// (ServicesGrid, HowItWorks). Τα στιλ ισχύουν μόνο κάτω από 992px — βλ. το
// μπλοκ [data-palette] στο globals.css. Ο σύνδεσμος «όλη η αρχική» ανοίγει
// το site με το στιλ αυτό (?palette=…, κρατιέται για τη συνεδρία).
const serviceIcons = [Stethoscope, Hand];
const stepIcons = [CalendarCheck, Users];

export default function PalettePage() {
  const { t, ready } = useTranslation(["services", "home"]);
  if (!ready) return null;

  const services = (t("services:services", { returnObjects: true }) || []).slice(0, 2);

  return (
    <>
      <section className="bg-[#050810] pt-28 pb-8 lg:pt-36">
        <div className="container">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Δοκιμή για το κινητό
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
            Τρία στιλ, ίδιο δείγμα
          </h1>
          <p className="mt-4 max-w-xl text-white/70 leading-relaxed">
            Δείτε τη σελίδα από το κινητό σας. Το ίδιο κομμάτι της αρχικής
            εμφανίζεται τρεις φορές στη σειρά, με διαφορετικό φόντο και κάρτες.
            Πείτε μας ποιο προτιμάτε: Α, Β ή Γ. Το κουμπί δίπλα στο γράμμα
            ανοίγει ολόκληρη την αρχική με το στιλ αυτό.
          </p>
          <p className="mt-3 text-sm text-white/50">
            Σε υπολογιστή η εμφάνιση δεν αλλάζει — η δοκιμή αφορά μόνο το κινητό.
          </p>
        </div>
      </section>

      {PALETTES.map((p, i) => (
        <div key={p.id} data-palette={p.id}>
          {/* Βασικό φόντο + κάρτες, όπως στις Υπηρεσίες */}
          <section className="bg-[#050810] border-t border-white/10 py-8">
            <div className="container">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-base font-bold text-primary-soft-foreground">
                    {["Α", "Β", "Γ"][i]}
                  </span>
                  <span className="text-lg font-bold text-white">{p.label}</span>
                </div>
                <a
                  href={`/?palette=${p.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/80 hover:border-primary-soft/60 hover:text-primary-soft transition-colors"
                >
                  Όλη η αρχική έτσι
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mb-4 inline-flex items-center gap-3">
                <div className="w-8 h-px bg-primary-soft/70" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  {t("services:servicesBadge")}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {services.map((service, k) => {
                  const Icon = serviceIcons[k] || Stethoscope;
                  return (
                    <div
                      key={k}
                      className="group relative h-full bg-[#070b14] border border-white/[0.06] rounded-2xl p-7 lg:p-8 max-lg:bg-[#0f1622] max-lg:border-white/10 max-lg:p-6"
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div className="w-12 h-12 rounded-xl bg-primary-soft/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-soft" />
                        </div>
                        <span className="text-3xl font-bold text-white/[0.04]">
                          {String(k + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-lg lg:text-xl font-bold text-white mb-2.5">
                        {service.title}
                      </h3>
                      <p className="text-white/55 leading-relaxed text-sm">
                        {service.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Εναλλασσόμενο φόντο + κάρτες βημάτων, όπως στη Διαδρομή Θεραπείας */}
          <section className="bg-[#070b14] max-lg:bg-[#0a1019] py-8">
            <div className="container">
              <div className="mb-4 inline-flex items-center gap-3">
                <div className="w-8 h-px bg-primary-soft/70" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  {t("home:howItWorks.label")}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {["step1", "step2"].map((key, k) => {
                  const Icon = stepIcons[k];
                  return (
                    <div
                      key={key}
                      className="group relative bg-[#050810] border border-white/[0.06] rounded-2xl p-7 lg:p-8 max-lg:flex max-lg:items-start max-lg:gap-4 max-lg:p-5"
                    >
                      <div className="flex items-start justify-between mb-6 max-lg:mb-0 max-lg:shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-primary-soft/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-soft" />
                        </div>
                      </div>
                      <div className="max-lg:min-w-0">
                        <h3 className="text-lg font-bold text-white mb-2.5 max-lg:mb-1.5">
                          {t(`home:howItWorks.${key}Title`)}
                        </h3>
                        <p className="text-sm text-white/55 leading-relaxed">
                          {t(`home:howItWorks.${key}Desc`)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ))}

      <section className="bg-[#050810] border-t border-white/10 py-10">
        <div className="container">
          <p className="text-white/70 leading-relaxed max-w-xl">
            Ποιο σας φαίνεται πιο ξεκούραστο και πιο «σωστό»; Πείτε μας Α, Β ή Γ.
          </p>
        </div>
      </section>
    </>
  );
}
