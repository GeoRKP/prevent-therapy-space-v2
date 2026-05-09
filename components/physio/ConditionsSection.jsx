"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { conditions } from "@/data/conditions";
import { SectionHeading } from "./SectionHeading";
import { MotionWrapper } from "./MotionWrapper";

export function ConditionsSection() {
  const { t } = useTranslation(["home", "common"]);

  return (
    <section className="relative overflow-hidden py-20 px-4 bg-primary">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container">
        <SectionHeading
          label={t("home:conditions.label")}
          title={t("home:conditions.title")}
          subtitle={t("home:conditions.subtitle")}
          light
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {conditions.map(({ key, icon: Icon }, i) => (
            <MotionWrapper key={key} delay={0.05 + i * 0.04}>
              <div className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 transition-all duration-300 hover:scale-[1.03] hover:bg-white/15">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                  {t(`home:conditions.items.${key}.title`)}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {t(`home:conditions.items.${key}.desc`)}
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            {t("common:actions.bookAppointment")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
