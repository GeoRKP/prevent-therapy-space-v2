"use client";

import { useTranslation } from "react-i18next";
import { SectionHeading } from "./SectionHeading";
import { MotionWrapper } from "./MotionWrapper";

const steps = ["step1", "step2", "step3", "step4"];

export function HowItWorks() {
  const { t } = useTranslation("home");

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container">
        <SectionHeading
          label={t("howItWorks.label")}
          title={t("howItWorks.title")}
          subtitle={t("howItWorks.subtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <MotionWrapper key={step} delay={i * 0.1}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
                  {t(`howItWorks.${step}Title`)}
                </h3>
                <p className="text-sm text-on-surface-variant max-w-[260px] mx-auto leading-relaxed">
                  {t(`howItWorks.${step}Desc`)}
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
