"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { contactInfo } from "@/data/conditions";

export function PhysioFooter() {
  const { t, i18n } = useTranslation(["footer", "common", "contact"]);
  const lang = i18n.language === "en" ? "en" : "el";

  const navLinks = [
    { href: "/", label: t("common:navigation.home") },
    { href: "/services", label: t("common:navigation.services") },
    { href: "/about", label: t("common:navigation.about") },
    { href: "/faq", label: t("common:navigation.faq") },
    { href: "/contact", label: t("common:navigation.contact") },
    { href: "/booking", label: t("common:navigation.booking") },
  ];

  const services = t("footer:services.items", { returnObjects: true }) || [];

  return (
    <footer className="bg-card text-card-foreground border-t border-border/40">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <Image
                src="/images/logo.webp"
                alt={t("footer:brand.logoAlt")}
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <span className="text-lg font-bold tracking-wider text-primary">
                PREVENT
              </span>
            </Link>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6 max-w-xs">
              {t("footer:brand.description")}
            </p>

            <div className="space-y-3">
              <a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>{contactInfo.email}</span>
              </a>
              <a
                href={`tel:+30${contactInfo.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span>{contactInfo.phone}</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="section-label text-on-surface-variant mb-6">
              {t("footer:navigation.title")}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="section-label text-on-surface-variant mb-6">
              {t("footer:services.title")}
            </h4>
            <ul className="space-y-3">
              {services.map((service, i) => (
                <li key={i}>
                  <Link
                    href="/services"
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Hours */}
          <div>
            <h4 className="section-label text-on-surface-variant mb-6">
              {t("footer:location.title")}
            </h4>
            <a
              href={t("contact:location.googleMapsUrl")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
            >
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {t("footer:location.address")}
              </span>
            </a>

            <div className="rounded-xl bg-muted/50 p-4 text-sm space-y-2">
              <div className="flex items-center gap-2 text-foreground font-medium mb-2">
                <Clock className="h-4 w-4 text-primary" />
                {t("footer:hours.title")}
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">
                  {t("footer:hours.mondayFriday")}
                </span>
                <span className="text-foreground font-medium">
                  {t("footer:hours.mondayFridayTime")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">
                  {t("footer:hours.saturday")}
                </span>
                <span className="text-foreground font-medium">
                  {t("footer:hours.saturdayTime")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">
                  {t("footer:hours.sunday")}
                </span>
                <span className="text-on-surface-variant">
                  {t("footer:hours.closed")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-on-surface-variant">
            {t("footer:copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              {t("footer:legal.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              {t("footer:legal.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
