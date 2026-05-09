"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
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
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "h-16 bg-background/80 backdrop-blur-2xl border-b border-border/40 shadow-sm"
            : "h-20 bg-background/40 backdrop-blur-md border-b border-transparent"
        )}
      >
        <div className="container h-full">
          <nav className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.webp"
                alt={ready ? t("header:logo.alt") : "PREVENT Therapy Space"}
                width={48}
                height={48}
                className="h-12 w-12"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-on-surface-variant hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {ready ? t(`common:navigation.${link.key}`) : link.key}
                  </Link>
                );
              })}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>
              <Link
                href="/booking"
                className="hidden md:inline-flex items-center px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-secondary transition-colors"
              >
                {ready ? t("common:navigation.booking") : "Book"}
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
                aria-label={ready ? t("header:aria.openMenu") : "Open menu"}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 right-0 w-full max-w-[340px] bg-background flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                <Image
                  src="/images/logo.webp"
                  alt="PREVENT"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-muted text-on-surface-variant hover:bg-muted/70 transition-colors"
                  aria-label={t("header:aria.closeMenu")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 px-4 overflow-y-auto">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center py-3.5 px-4 rounded-xl text-base font-medium transition-all",
                          isActive
                            ? "bg-primary/5 text-primary"
                            : "text-on-surface-variant hover:bg-muted"
                        )}
                      >
                        {t(`common:navigation.${link.key}`)}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="px-4 pb-6 pt-4 space-y-3 border-t border-border/40">
                <Link
                  href="/booking"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm"
                >
                  {t("common:navigation.booking")}
                </Link>
                <div className="flex justify-center pt-1">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
