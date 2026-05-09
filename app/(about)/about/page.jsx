"use client";

import { useTranslation } from "react-i18next";
import HeadManager from "@/components/common/HeadManager";
import { TeamPreview } from "@/components/physio/TeamPreview";
import { WhyChooseUs } from "@/components/physio/WhyChooseUs";
import { CtaSection } from "@/components/physio/CtaSection";
import { MotionWrapper } from "@/components/physio/MotionWrapper";

export default function AboutPage() {
  const { t } = useTranslation("about");

  return (
    <>
      <HeadManager namespace="about" pageKey="meta" />

      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-muted">
        <div className="container max-w-4xl text-center">
          <MotionWrapper>
            <span className="block text-xs font-bold tracking-[0.2em] uppercase mb-4 text-primary">
              {t("hero.label")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-5">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </MotionWrapper>
        </div>
      </section>

      <section className="py-20 px-4 bg-background">
        <div className="container max-w-3xl">
          <MotionWrapper>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
              {t("mission.title")}
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              {t("mission.text")}
            </p>
          </MotionWrapper>
        </div>
      </section>

      <TeamPreview />
      <WhyChooseUs />
      <CtaSection />
    </>
  );
}
