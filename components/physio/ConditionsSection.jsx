"use client";

import { useTranslation } from "react-i18next";
import { conditions } from "@/data/conditions";
import { SectionHeading } from "./SectionHeading";

export function ConditionsSection() {
  const { t, ready } = useTranslation(["home", "common"]);
  if (!ready) return null;

  return (
    <section className="relative section-pad bg-[#070b14] m-section-alt">
      <div className="container">
        <SectionHeading
          title={t("home:conditions.title")}
          subtitle={t("home:conditions.subtitle")}
        />

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 max-sm:gap-y-0">
          {conditions.map(({ key }, i) => (
            <li key={key} className="pt-5 border-t border-white/12 max-sm:pb-6">
              <span className="t-caption tabular-nums text-primary-soft/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-h4 text-white mt-3">
                {t(`home:conditions.items.${key}.title`)}
              </h3>
              <p className="t-small text-white/65 mt-2">
                {t(`home:conditions.items.${key}.desc`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
