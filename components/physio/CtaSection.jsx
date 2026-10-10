"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { contactInfo } from "@/data/conditions";

export function CtaSection() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  const info = [
    { title: t("ctaSection.info.hoursTitle"), value: t("ctaSection.info.hoursValue") },
    { title: t("ctaSection.info.locationTitle"), value: t("ctaSection.info.locationValue") },
    { title: t("ctaSection.info.bookingTitle"), value: t("ctaSection.info.bookingValue") },
  ];

  return (
    <section className="relative section-pad bg-[#050810]">
      <div className="container">
        <div className="rounded-[28px] bg-primary px-8 py-12 sm:px-12 lg:px-16 lg:py-16 max-sm:px-6 max-sm:py-10">
          <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10 items-end">
            <div className="lg:col-span-7">
              <h2 className="t-h2 text-white">{t("ctaSection.title")}</h2>
              <p className="t-lead text-white/80 mt-5 max-w-[32rem]">{t("ctaSection.subtitle")}</p>

              <div className="flex flex-wrap gap-3 mt-9">
                <Link
                  href="/booking"
                  className="group inline-flex items-center justify-center gap-2.5 h-13 px-7 rounded-full bg-white text-primary font-semibold hover:bg-[#fbf8f3] transition-colors max-sm:w-full"
                >
                  {t("ctaSection.button")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={`tel:+30${contactInfo.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2.5 h-13 px-6 max-sm:px-3 max-sm:gap-2 whitespace-nowrap rounded-full border border-white/35 text-white font-medium hover:bg-white/10 transition-colors max-sm:flex-1"
                >
                  <Phone className="w-4 h-4" />
                  {t("ctaSection.callNow")}
                </a>
                <a
                  href={contactInfo.viberHref}
                  className="inline-flex items-center justify-center gap-2.5 h-13 px-6 max-sm:px-3 max-sm:gap-2 whitespace-nowrap rounded-full border border-white/35 text-white font-medium hover:bg-white/10 transition-colors max-sm:flex-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  Viber
                </a>
              </div>
            </div>

            <dl className="lg:col-span-4 lg:col-start-9 border-t border-white/25">
              {info.map((item) => (
                <div key={item.title} className="py-4 border-b border-white/25">
                  <dt className="font-semibold text-white">{item.title}</dt>
                  <dd className="t-small text-white/75 mt-0.5">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
