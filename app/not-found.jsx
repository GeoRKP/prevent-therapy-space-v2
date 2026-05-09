"use client";

import Link from "next/link";
import { Home, Stethoscope, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function NotFound() {
  const { t } = useTranslation("notfound");

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-2xl"
      >
        <h1 className="text-[8rem] md:text-[12rem] font-black text-primary/10 leading-none select-none">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
          {t("title")}
        </h2>
        <p className="text-on-surface-variant mb-8 text-lg">{t("description")}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <NotFoundLink href="/" icon={Home} label={t("goHome")} />
          <NotFoundLink href="/services" icon={Stethoscope} label={t("services")} />
          <NotFoundLink href="/contact" icon={Mail} label={t("contact")} />
        </div>
      </motion.div>
    </section>
  );
}

function NotFoundLink({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-medium text-foreground">{label}</span>
    </Link>
  );
}
