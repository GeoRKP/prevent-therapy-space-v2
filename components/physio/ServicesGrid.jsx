"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Stethoscope,
  Hand,
  Dumbbell,
  BrainCircuit,
  ShieldCheck,
  ScanLine,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { RevealText } from "@/components/effects/kinetic-text";

const iconMap = {
  "uil-wrench": Stethoscope,
  "uil-constructor": Hand,
  "uil-bolt": Dumbbell,
  "scan": BrainCircuit,
  "uil-shield-check": ShieldCheck,
  "uil-box": ScanLine,
};

export function ServicesGrid() {
  const { t, ready } = useTranslation(["services", "contact"]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!ready) return null;

  const services = t("services:services", { returnObjects: true }) || [];

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden bg-[#050810]">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[200px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-[150px] translate-y-1/2 pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <RevealText>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-primary/70" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t("services:servicesBadge")}
              </span>
              <div className="w-8 h-px bg-primary/70" />
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white mb-5">
              {t("services:title")}
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-base lg:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
              {t("services:subtitle")}
            </p>
          </RevealText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Stethoscope;
            const isLarge = index === 0 || index === 3;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                className={isLarge ? "lg:col-span-2" : ""}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="group relative h-full bg-[#070b14] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary/30 rounded-2xl p-7 lg:p-8 transition-all duration-500">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-3xl font-bold text-white/[0.04] group-hover:text-primary/15 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2.5 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/55 mb-5 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  {service.features && (
                    <ul className="space-y-2 mb-5">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-white/55 group-hover:text-white/65 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary/80 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-4 border-t border-white/[0.06]">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/55 hover:text-primary transition-colors"
                    >
                      <span>{t("contact:learnMore")}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-14"
        >
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <span>{t("contact:requestQuote")}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
