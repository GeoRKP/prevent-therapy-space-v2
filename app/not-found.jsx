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
        <span className="text-[28vw] lg:text-[18vw] font-bold text-white/[0.025] leading-none">
          404
        </span>
      </div>

      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/[0.05] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 text-center">
        <RevealText>
          <div className="inline-flex items-center gap-3 mb-7">
            <div className="w-10 h-px bg-primary/70" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Error 404
            </span>
          </div>
        </RevealText>

        <RevealText delay={0.1}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            {ready ? t("title") : "Page not found"}
          </h1>
        </RevealText>

        <RevealText delay={0.2}>
          <p className="text-white/55 mb-10 text-base lg:text-lg max-w-xl mx-auto">
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
      className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#070b14] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary/30 transition-all flex-1"
    >
      <Icon className="w-5 h-5 text-primary" />
      <span className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">
        {label}
      </span>
      <ArrowUpRight className="w-4 h-4 ml-auto text-white/20 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </Link>
  );
}
