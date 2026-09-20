"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, ArrowUpRight, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";

export default function Header1() {
  const { t, ready } = useTranslation(["header", "common"]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", key: "home" },
    { href: "/services", key: "services" },
    { href: "/about", key: "about" },
    { href: "/faq", key: "faq" },
    { href: "/contact", key: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[999] transition-all duration-500",
          isScrolled ? "h-16" : "h-20"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500",
            isScrolled
              ? "bg-canvas/95 backdrop-blur-xl border-b border-ink/[0.06]"
              : "bg-gradient-to-b from-canvas/85 to-transparent"
          )}
        />

        <div className="container relative h-full">
          <nav className="flex items-center justify-between h-full">
            <Link href="/" className="relative z-[1002] flex items-center gap-3">
              <Image
                src="/images/logo.webp"
                alt={ready ? t("header:logo.alt") : "PREVENT Therapy Space"}
                width={48}
                height={48}
                className="h-10 w-10"
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                      isActive
                        ? "text-brand bg-brand/10"
                        : "text-ink-70 hover:text-ink hover:bg-ink/[0.04]"
                    )}
                  >
                    {ready ? t(`common:navigation.${link.key}`) : link.key}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3">
                <a
                  href="tel:+306972952263"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-ink-70 hover:text-ink hover:bg-ink/[0.04] transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand" />
                  <span className="hidden xl:inline">
                    {ready ? t("header:contact.phone") : "697 295 2263"}
                  </span>
                </a>
                <a
                  href="viber://chat?number=%2B306972952263"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-ink-70 hover:text-ink hover:bg-ink/[0.04] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-brand" />
                  <span className="hidden xl:inline">Viber</span>
                </a>
                <ThemeToggle />
                <LanguageSwitcher />
                <Link
                  href="/booking"
                  className="ml-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-brand text-brand-fg hover:bg-brand/90 transition-colors"
                >
                  {ready ? t("common:navigation.booking") : "Book"}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ThemeToggle className="lg:hidden relative z-[1002]" />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative z-[1002] w-10 h-10 flex items-center justify-center text-ink-80"
                aria-label={
                  isMobileMenuOpen
                    ? t("header:aria.closeMenu")
                    : t("header:aria.openMenu")
                }
              >
                <div className="relative w-5 h-3.5 flex flex-col justify-between">
                  <motion.span
                    className="w-full h-0.5 bg-ink origin-left rounded-full"
                    animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                  />
                  <motion.span
                    className="w-full h-0.5 bg-ink rounded-full"
                    animate={{
                      opacity: isMobileMenuOpen ? 0 : 1,
                      scaleX: isMobileMenuOpen ? 0 : 1,
                    }}
                  />
                  <motion.span
                    className="w-full h-0.5 bg-ink origin-left rounded-full"
                    animate={{
                      rotate: isMobileMenuOpen ? -45 : 0,
                      y: isMobileMenuOpen ? -2 : 0,
                    }}
                  />
                </div>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1001] bg-canvas"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-5 z-[1002] w-12 h-12 flex items-center justify-center text-ink-80 hover:text-brand transition-colors bg-ink/5 hover:bg-ink/10 rounded-full"
              aria-label={t("header:aria.closeMenu")}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="container relative z-10 h-full flex flex-col pt-24 pb-8 overflow-y-auto">
              <nav className="flex-1">
                <div className="space-y-2">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + index * 0.04, duration: 0.4 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "group flex items-center justify-between py-4 px-5 rounded-2xl transition-colors",
                            isActive
                              ? "bg-brand/10 text-brand"
                              : "text-ink-85 hover:bg-ink/[0.04]"
                          )}
                        >
                          <span className="text-xl font-semibold tracking-tight">
                            {t(`common:navigation.${link.key}`)}
                          </span>
                          <ArrowUpRight
                            className={cn(
                              "w-5 h-5 transition-all",
                              isActive
                                ? "text-brand"
                                : "text-ink-30 group-hover:text-ink-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            )}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="pt-8 border-t border-ink/10 space-y-3"
              >
                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold bg-brand text-brand-fg hover:bg-brand/90 transition-colors"
                >
                  {t("common:navigation.booking")}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <div className="flex gap-3">
                  <a
                    href="tel:+306972952263"
                    className="flex items-center justify-center gap-3 flex-1 py-3.5 rounded-full text-ink-70 border border-ink/10 hover:border-primary/30 hover:text-ink transition-colors"
                  >
                    <Phone className="w-4 h-4 text-brand" />
                    <span className="text-sm font-medium">
                      {t("header:contact.phone")}
                    </span>
                  </a>
                  <a
                    href="viber://chat?number=%2B306972952263"
                    className="flex items-center justify-center gap-3 flex-1 py-3.5 rounded-full text-ink-70 border border-ink/10 hover:border-primary/30 hover:text-ink transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-brand" />
                    <span className="text-sm font-medium">Viber</span>
                  </a>
                </div>
                <div className="flex justify-center pt-2">
                  <LanguageSwitcher />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
