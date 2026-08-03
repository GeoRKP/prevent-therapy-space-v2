"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, MessageCircle, ArrowRight, Clock, MapPin, CalendarCheck } from "lucide-react";
import { contactInfo } from "@/data/conditions";
import { RevealText } from "@/components/effects/kinetic-text";

export function CtaSection() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[#050810]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-10 lg:p-16 max-w-6xl mx-auto"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.06] rounded-full blur-[150px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/[0.04] rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <RevealText>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-px bg-white/40" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    {t("ctaSection.getStarted")}
                  </span>
                </div>
              </RevealText>

              <RevealText delay={0.1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white mb-5">
                  {t("ctaSection.title")}
                </h2>
              </RevealText>

              <RevealText delay={0.2}>
                <p className="text-base lg:text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
                  {t("ctaSection.subtitle")}
                </p>
              </RevealText>

              <RevealText delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/booking"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/95 transition-colors"
                  >
                    {t("ctaSection.button")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={`tel:+30${contactInfo.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t("ctaSection.callNow")}</span>
                  </a>

                  <a
                    href={contactInfo.viberHref}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t("ctaSection.viber")}</span>
                  </a>
                </div>
              </RevealText>
            </div>

            <div className="lg:col-span-5">
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: Clock,
                    title: t("ctaSection.info.hoursTitle"),
                    value: t("ctaSection.info.hoursValue"),
                  },
                  {
                    icon: MapPin,
                    title: t("ctaSection.info.locationTitle"),
                    value: t("ctaSection.info.locationValue"),
                  },
                  {
                    icon: CalendarCheck,
                    title: t("ctaSection.info.bookingTitle"),
                    value: t("ctaSection.info.bookingValue"),
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">
                        {item.title}
                      </span>
                      <span className="block text-xs text-white/70 mt-0.5">
                        {item.value}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
