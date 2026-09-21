"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CalendarCheck, Users, Activity, Award } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const steps = [
  { key: "step1", icon: CalendarCheck },
  { key: "step2", icon: Users },
  { key: "step3", icon: Activity },
  { key: "step4", icon: Award },
];

export function HowItWorks() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  return (
    <section className="relative section-pad overflow-hidden bg-[#070b14]">
      <div className="container relative z-10">
        <SectionHeading
          label={t("howItWorks.label")}
          title={t("howItWorks.title")}
          subtitle={t("howItWorks.subtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative bg-[#050810] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary-soft/30 rounded-2xl p-7 lg:p-8 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft/10 group-hover:bg-primary-soft/15 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-primary-soft" />
                  </div>
                  <span className="text-3xl font-bold text-white/[0.04] group-hover:text-primary-soft/15 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-primary-soft transition-colors">
                  {t(`howItWorks.${step.key}Title`)}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {t(`howItWorks.${step.key}Desc`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
