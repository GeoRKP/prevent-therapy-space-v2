"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

export function Hero() {
  const { t } = useTranslation("home");

  const badges = [
    t("hero.badgeLicensed"),
    t("hero.badgeExperience"),
    t("hero.badgePatients"),
  ];

  return (
    <section className="relative overflow-hidden bg-background pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {t("hero.label")}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-4">
              {t("hero.title")}
            </h1>

            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-8 max-w-lg">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/booking"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-base hover:bg-secondary transition-colors"
              >
                {t("hero.ctaPrimary")}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-border text-foreground rounded-full font-semibold text-base hover:bg-muted transition-colors"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-2 text-on-surface-variant text-sm"
                >
                  <CheckCircle className="h-4 w-4 text-primary" />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl bg-primary/5 hidden lg:block" />
            <div className="relative w-full max-w-md lg:max-w-none aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-3xl editorial-shadow">
              <Image
                src="/images/team/konstantinos-patsakis-posing-photo.jpg"
                alt="PREVENT Therapy Space"
                fill
                priority
                quality={85}
                sizes="(max-width: 1024px) 448px, 576px"
                className="object-cover object-top"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
