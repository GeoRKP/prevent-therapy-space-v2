"use client";

// Κοινή σελίδα νομικών κειμένων (/privacy, /terms) — διαβάζει sections από
// το legal namespace των locales.

import { useTranslation } from "react-i18next";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";

export function LegalPage({ docKey }) {
  const { t, ready } = useTranslation("legal");
  if (!ready) return null;

  const sections = t(`${docKey}.sections`, { returnObjects: true }) || [];

  return (
    <>
      <HeadManager namespace="legal" pageKey={`${docKey}.meta`} />

      <PageHero
        label="PREVENT"
        title={t(`${docKey}.title`)}
        subtitle=""
        backgroundImage="/images/clinic/office-photo.jpg"
      />

      <section className="relative py-20 lg:py-28 bg-[#050810]">
        <div className="container relative z-10 max-w-3xl">
          <p className="text-xs text-white/40 mb-10">{t(`${docKey}.updated`)}</p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-bold text-white mb-3 tracking-tight">
                  {section.h}
                </h2>
                <div className="space-y-3">
                  {section.p.map((paragraph, j) => (
                    <p key={j} className="text-sm text-white/60 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
