"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { conditions } from "@/data/conditions";
import { SectionHeading } from "./SectionHeading";

export function ConditionsSection() {
  const { t, ready } = useTranslation(["home", "common"]);
  if (!ready) return null;

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden bg-surface-1">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[200px] -translate-y-1/2 pointer-events-none" />

      <div className="container relative z-10">
        <SectionHeading
          label={t("home:conditions.label")}
          title={t("home:conditions.title")}
          subtitle={t("home:conditions.subtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {conditions.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="group bg-surface-0 hover:bg-surface-2 border border-white/[0.06] hover:border-primary/30 rounded-2xl p-6 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-mono text-white/20 group-hover:text-primary transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-primary transition-colors">
                {t(`home:conditions.items.${key}.title`)}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {t(`home:conditions.items.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <span>{t("common:actions.bookAppointment")}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
