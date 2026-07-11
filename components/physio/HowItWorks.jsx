"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CalendarCheck, Users, Activity, Award } from "lucide-react";
import { RevealText } from "@/components/effects/kinetic-text";

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
    <section className="relative py-28 lg:py-36 overflow-hidden bg-surface-1">
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <RevealText>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-primary/70" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t("howItWorks.label")}
              </span>
              <div className="w-8 h-px bg-primary/70" />
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white mb-5">
              {t("howItWorks.title")}
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-base lg:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
              {t("howItWorks.subtitle")}
            </p>
          </RevealText>
        </div>

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
                className="group relative bg-surface-0 hover:bg-surface-2 border border-white/[0.06] hover:border-primary/30 rounded-2xl p-7 lg:p-8 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-white/[0.04] group-hover:text-primary/15 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-primary transition-colors">
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
