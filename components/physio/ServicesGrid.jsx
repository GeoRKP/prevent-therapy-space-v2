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
import { SectionHeading } from "./SectionHeading";

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
      <div className="container relative z-10">
        <SectionHeading
          label={t("services:servicesBadge")}
          title={t("services:title")}
          subtitle={t("services:subtitle")}
        />

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
                <div className="group relative h-full bg-[#070b14] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary-soft/30 rounded-2xl p-7 lg:p-8 transition-all duration-500">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary-soft/10 group-hover:bg-primary-soft/15 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-primary-soft" />
                    </div>
                    <span className="text-3xl font-bold text-white/[0.04] group-hover:text-primary-soft/15 transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2.5 group-hover:text-primary-soft transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/55 mb-5 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  {service.features && (
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-white/55 group-hover:text-white/65 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary-soft/80 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
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
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold text-sm hover:bg-primary-soft/90 transition-colors"
          >
            <span>{t("contact:requestQuote")}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
