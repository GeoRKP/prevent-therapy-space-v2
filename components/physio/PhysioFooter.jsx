"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MessageCircle, MapPin, ArrowUpRight, Clock } from "lucide-react";
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
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <Image
                src="/images/logo.webp"
                alt={t("footer:brand.logoAlt")}
                width={48}
                height={48}
                className="h-10 w-10"
              />
              <span className="leading-none">
                <span className="block text-[0.9375rem] font-semibold tracking-[0.14em] text-white">
                  PREVENT
                </span>
                <span className="block mt-1 text-[0.6875rem] tracking-[0.06em] text-white/60">
                  Therapy Space
                </span>
              </span>
            </Link>

            <p className="t-small text-white/65 mb-7 max-w-xs">
              {t("footer:brand.description")}
            </p>

            <div className="space-y-2.5">
              <a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center gap-3 text-white/70 hover:text-white t-small transition-colors"
              >
                <div className="w-5 flex justify-center">
                  <Mail className="w-4 h-4 text-primary-soft" />
                </div>
                <span>{contactInfo.email}</span>
              </a>
              <a
                href={`tel:+30${contactInfo.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-3 text-white/70 hover:text-white t-small transition-colors"
              >
                <div className="w-5 flex justify-center">
                  <Phone className="w-4 h-4 text-primary-soft" />
                </div>
                <span>{contactInfo.phone}</span>
              </a>
              <a
                href={contactInfo.viberHref}
                className="group flex items-center gap-3 text-white/70 hover:text-white t-small transition-colors"
              >
                <div className="w-5 flex justify-center">
                  <MessageCircle className="w-4 h-4 text-primary-soft" />
                </div>
                <span>Viber</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-[0.9375rem] font-semibold text-white mb-5">
              {t("footer:navigation.title")}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white/70 hover:text-primary-soft t-small transition-colors"
                  >
                    <span>{t(`common:navigation.${link.key}`)}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[0.9375rem] font-semibold text-white mb-5">
              {t("footer:services.title")}
            </h4>
            <ul className="space-y-2.5">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href="/services"
                    className="text-white/70 hover:text-primary-soft t-small transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[0.9375rem] font-semibold text-white mb-5">
              {t("footer:location.title")}
            </h4>

            <a
              href={t("contact:location.googleMapsUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-white/70 hover:text-white t-small transition-colors mb-6"
            >
              <MapPin className="w-4 h-4 text-primary-soft flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {t("footer:location.address")}
              </span>
            </a>

            <div className="t-small space-y-1.5 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <Clock className="w-4 h-4 text-primary-soft" />
                <span>{t("footer:hours.title")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/65">
                  {t("footer:hours.mondayFriday")}
                </span>
                <span className="text-white tabular-nums">
                  {t("footer:hours.mondayFridayTime")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/65">
                  {t("footer:hours.saturday")}
                </span>
                <span className="text-white tabular-nums">
                  {t("footer:hours.saturdayTime")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/65">
                  {t("footer:hours.sunday")}
                </span>
                <span className="text-white/45">
                  {t("footer:hours.closed")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row justify-between md:items-center gap-3">
          <p className="text-white/50 t-caption">
            {t("footer:copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-5 text-white/50 t-caption">
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
