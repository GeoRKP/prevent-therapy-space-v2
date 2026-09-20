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
    <section className="relative section-pad overflow-hidden bg-canvas-1">
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
              className="group bg-canvas hover:bg-canvas-2 border border-ink/[0.06] hover:border-brand/30 rounded-2xl p-6 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-brand/10 group-hover:bg-brand/15 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <span className="text-xs font-mono text-ink-20 group-hover:text-brand transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-base font-bold text-ink mb-1.5 group-hover:text-brand transition-colors">
                {t(`home:conditions.items.${key}.title`)}
              </h3>
              <p className="text-sm text-ink-50 leading-relaxed">
                {t(`home:conditions.items.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand text-brand-fg font-semibold text-sm hover:bg-brand/90 transition-colors"
          >
            <span>{t("common:actions.bookAppointment")}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
