"use client";

import { useTranslation } from "react-i18next";
import HeadManager from "@/components/common/HeadManager";
import { ServicesGrid } from "@/components/physio/ServicesGrid";
import { CtaSection } from "@/components/physio/CtaSection";
import { ConditionsSection } from "@/components/physio/ConditionsSection";
import { MotionWrapper } from "@/components/physio/MotionWrapper";

export default function ServicesPage() {
  const { t } = useTranslation("services");

  return (
    <>
      <HeadManager namespace="services" pageKey="meta" />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-muted">
        <div className="container max-w-3xl text-center">
          <MotionWrapper>
            <span className="block text-xs font-bold tracking-[0.2em] uppercase mb-4 text-primary">
              {t("hero.label")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-on-surface-variant">{t("hero.subtitle")}</p>
          </MotionWrapper>
        </div>
      </section>

      <ServicesGrid />
      <ConditionsSection />
      <CtaSection />
    </>
  );
}
