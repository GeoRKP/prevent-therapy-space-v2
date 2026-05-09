"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { SectionHeading } from "./SectionHeading";
import { MotionWrapper } from "./MotionWrapper";

export function ServicesGrid() {
  const { t } = useTranslation(["home", "services", "common"]);

  return (
    <section className="py-20 px-4 bg-muted">
      <div className="container">
        <SectionHeading
          label={t("home:services.label")}
          title={t("home:services.title")}
          subtitle={t("home:services.subtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <MotionWrapper key={service.id} delay={i * 0.08}>
                <Link href="/services" className="block h-full group">
                  <div className="h-full bg-card rounded-2xl p-7 border border-border/40 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 editorial-shadow hover:shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 tracking-tight">
                      {t(`services:items.${service.id}.name`)}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-5 leading-relaxed">
                      {t(`services:items.${service.id}.description`)}
                    </p>
                    <span className="text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t("common:actions.viewDetails")}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
