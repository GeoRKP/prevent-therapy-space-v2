"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, ArrowUpRight, Clock } from "lucide-react";
import { contactInfo } from "@/data/conditions";

export function PhysioFooter() {
  const { t, ready } = useTranslation(["footer", "common", "contact"]);
  if (!ready) return null;

  const navLinks = [
    { href: "/", key: "home" },
    { href: "/services", key: "services" },
    { href: "/about", key: "about" },
    { href: "/faq", key: "faq" },
    { href: "/contact", key: "contact" },
    { href: "/booking", key: "booking" },
  ];

  const services = t("footer:services.items", { returnObjects: true }) || [];

  return (
    <footer className="relative bg-[#040609] text-white overflow-hidden border-t border-white/[0.06]">
      <div className="relative z-10 container">
        <div className="py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <Image
                src="/images/logo.webp"
                alt={t("footer:brand.logoAlt")}
                width={48}
                height={48}
                className="h-10 w-10"
              />
              <span className="text-base font-bold tracking-wider text-white">
                PREVENT
              </span>
            </Link>

            <p className="text-white/55 text-sm leading-relaxed mb-7 max-w-xs">
              {t("footer:brand.description")}
            </p>

            <div className="space-y-2.5">
              <a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center gap-3 text-white/55 hover:text-white text-sm transition-colors"
              >
                <div className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>{contactInfo.email}</span>
              </a>
              <a
                href={`tel:+30${contactInfo.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-3 text-white/55 hover:text-white text-sm transition-colors"
              >
                <div className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>{contactInfo.phone}</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55 mb-6">
              {t("footer:navigation.title")}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white/60 hover:text-primary text-sm transition-colors"
                  >
                    <span>{t(`common:navigation.${link.key}`)}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55 mb-6">
              {t("footer:services.title")}
            </h4>
            <ul className="space-y-2.5">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href="/services"
                    className="text-white/60 hover:text-primary text-sm transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55 mb-6">
              {t("footer:location.title")}
            </h4>

            <a
              href={t("contact:location.googleMapsUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-white/55 hover:text-white text-sm transition-colors mb-6"
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {t("footer:location.address")}
              </span>
            </a>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm space-y-2">
              <div className="flex items-center gap-2 text-white/85 font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs uppercase tracking-wider font-semibold">
                  {t("footer:hours.title")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/55">
                  {t("footer:hours.mondayFriday")}
                </span>
                <span className="text-white/85 font-medium">
                  {t("footer:hours.mondayFridayTime")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/55">
                  {t("footer:hours.saturday")}
                </span>
                <span className="text-white/85 font-medium">
                  {t("footer:hours.saturdayTime")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/55">
                  {t("footer:hours.sunday")}
                </span>
                <span className="text-white/30">
                  {t("footer:hours.closed")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/35 text-xs">
            {t("footer:copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-5 text-white/35 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t("footer:legal.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t("footer:legal.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
