"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, Phone } from "lucide-react";
import { MotionWrapper } from "./MotionWrapper";

export function CtaSection() {
  const { t } = useTranslation("home");

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container max-w-5xl">
        <MotionWrapper>
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center editorial-shadow-lg">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-primary rounded-full font-semibold text-base hover:bg-white/90 transition-colors shadow-lg shadow-black/10"
              >
                {t("cta.primary")}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+302101234567"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                <Phone className="h-5 w-5" />
                {t("cta.secondary")}
              </a>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
