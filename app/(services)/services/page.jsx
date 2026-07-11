"use client";

import { useTranslation } from "react-i18next";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";
import { ServicesGrid } from "@/components/physio/ServicesGrid";
import { ConditionsSection } from "@/components/physio/ConditionsSection";
import { CtaSection } from "@/components/physio/CtaSection";

export default function ServicesPage() {
  const { t, ready } = useTranslation("services");

  return (
    <>
      <HeadManager namespace="services" pageKey="meta" />

      <PageHero
        label={ready ? t("hero.label") : "Services"}
        title={ready ? t("hero.title") : ""}
        subtitle={ready ? t("hero.subtitle") : ""}
        backgroundImage="/images/clinic/inner-space-and-equipment.jpg"
      />

      <ServicesGrid />
      <ConditionsSection />
      <CtaSection />
    </>
  );
}
