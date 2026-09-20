"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Medal, ArrowUpRight, HeartHandshake } from "lucide-react";
import { RevealText } from "@/components/effects/kinetic-text";

export function AthletesSection() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  const athletes = t("athletes.items", { returnObjects: true }) || [];

  return (
    <section className="relative section-pad overflow-hidden bg-surface-1">
      <div className="container relative z-10">
        <div className="mb-12">
          <RevealText>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/64">
                {t("athletes.label")}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          </RevealText>

          <div className="grid lg:grid-cols-2 gap-6 items-end">
            <RevealText delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-paper">
                {t("athletes.title")}
              </h2>
            </RevealText>
            <RevealText delay={0.2}>
              <p className="text-base lg:text-lg text-paper/70 leading-relaxed lg:max-w-md lg:ml-auto">
                {t("athletes.subtitle")}
              </p>
            </RevealText>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {athletes.map((athlete, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group flex items-center gap-4 bg-surface hover:bg-surface-2 border border-white/[0.06] hover:border-primary-soft/30 rounded-2xl p-6 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-soft/10 group-hover:bg-primary-soft/15 flex items-center justify-center flex-shrink-0 transition-colors">
                <Medal className="w-6 h-6 text-primary-soft" />
              </div>
              <div>
                <h3 className="text-base font-bold text-paper group-hover:text-primary-soft transition-colors">
                  {athlete.name}
                </h3>
                <p className="text-sm text-paper/70 mt-0.5">{athlete.sport}</p>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: athletes.length * 0.1, duration: 0.5 }}
          >
            <Link
              href="/contact"
              className="group flex items-center gap-4 h-full bg-primary-soft/[0.06] hover:bg-primary-soft/10 border border-primary-soft/20 hover:border-primary-soft/40 rounded-2xl p-6 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-soft/15 flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-6 h-6 text-primary-soft" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-paper">
                  {t("athletes.openTitle")}
                </h3>
                <p className="text-sm text-paper/70 mt-0.5">
                  {t("athletes.openText")}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold uppercase tracking-wider text-primary-soft">
                  {t("athletes.openCta")}
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
