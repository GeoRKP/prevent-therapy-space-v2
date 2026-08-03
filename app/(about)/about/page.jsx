"use client";

import { useTranslation } from "react-i18next";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";
import { TeamPreview } from "@/components/physio/TeamPreview";
import { WhyChooseUs } from "@/components/physio/WhyChooseUs";
import { AboutFrenaSection } from "@/components/physio/AboutFrenaSection";
import { PartnersSection } from "@/components/physio/PartnersSection";
import { CtaSection } from "@/components/physio/CtaSection";

export default function AboutPage() {
  const { t, ready } = useTranslation("about");

  return (
    <>
      <HeadManager namespace="about" pageKey="meta" />

      <PageHero
        label={ready ? t("hero.label") : "About"}
        title={ready ? t("hero.title") : ""}
        subtitle={ready ? t("hero.subtitle") : ""}
        backgroundImage="/images/clinic/beautifull-inner-photo-of-clinic.jpg"
      />

      <AboutFrenaSection />
      <TeamPreview />
      <PartnersSection />
      <WhyChooseUs />
      <CtaSection />
    </>
  );
}
