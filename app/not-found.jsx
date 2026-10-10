"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Stethoscope, Mail, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RevealText } from "@/components/effects/kinetic-text";

export default function NotFound() {
  const { t, ready } = useTranslation("notfound");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050810] py-32">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-display text-[28vw] lg:text-[18vw] text-white/[0.035] leading-none">
          404
        </span>
      </div>


      <div className="container relative z-10 text-center">
        <RevealText delay={0.1}>
          <h1 className="t-h1 text-white mb-4">
            {ready ? t("title") : "Page not found"}
          </h1>
        </RevealText>

        <RevealText delay={0.2}>
          <p className="t-lead text-white/70 mb-10 max-w-xl mx-auto">
            {ready ? t("description") : ""}
          </p>
        </RevealText>

        <RevealText delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
            <NotFoundLink
              href="/"
              icon={Home}
              label={ready ? t("goHome") : "Home"}
            />
            <NotFoundLink
              href="/services"
              icon={Stethoscope}
              label={ready ? t("services") : "Services"}
            />
            <NotFoundLink
              href="/contact"
              icon={Mail}
              label={ready ? t("contact") : "Contact"}
            />
          </div>
        </RevealText>
      </div>
    </section>
  );
}

function NotFoundLink({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#0a0f1a] border border-white/10 hover:border-primary-soft/40 transition-all flex-1"
    >
      <Icon className="w-5 h-5 text-primary-soft" />
      <span className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">
        {label}
      </span>
      <ArrowUpRight className="w-4 h-4 ml-auto text-white/20 group-hover:text-primary-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </Link>
  );
}
