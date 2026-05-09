"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "./SectionHeading";
import { MotionWrapper } from "./MotionWrapper";

const features = [
  { key: "feature1", image: "/images/team/konstantinos-patsakis-chiropractor.jpg" },
  { key: "feature2", image: "/images/team/tsitouridis-office.jpg" },
  { key: "feature3", image: "/images/team/konstantinos-patsakis-on-his-office-photo.jpg" },
];

export function WhyChooseUs() {
  const { t } = useTranslation("home");

  return (
    <section className="py-20 px-4 bg-muted">
      <div className="container">
        <SectionHeading
          label={t("whyChooseUs.label")}
          title={t("whyChooseUs.title")}
          subtitle={t("whyChooseUs.subtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <MotionWrapper key={feature.key} delay={i * 0.12}>
              <div className="group bg-card rounded-2xl overflow-hidden border border-border/40 hover:-translate-y-1 transition-all duration-300 editorial-shadow hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={t(`whyChooseUs.${feature.key}Title`)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={75}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-lg font-bold text-foreground mb-3 tracking-tight">
                    {t(`whyChooseUs.${feature.key}Title`)}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {t(`whyChooseUs.${feature.key}Desc`)}
                  </p>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
