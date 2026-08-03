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
    <section className="relative py-28 lg:py-36 overflow-hidden bg-[#070b14]">
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
              className="group bg-[#050810] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary-soft/30 rounded-2xl p-6 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary-soft/10 group-hover:bg-primary-soft/15 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-primary-soft" />
                </div>
                <span className="text-xs font-mono text-white/20 group-hover:text-primary-soft transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-primary-soft transition-colors">
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
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold text-sm hover:bg-primary-soft/90 transition-colors"
          >
            <span>{t("common:actions.bookAppointment")}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
