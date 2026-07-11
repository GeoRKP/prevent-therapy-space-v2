"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MotionConfig } from "framer-motion";
import Header1 from "@/components/headers/Header1";
import { PhysioFooter } from "@/components/physio/PhysioFooter";
import { Toaster } from "@/components/ui/sonner";
import LanguageDetector from "@/components/common/LanguageDetector";
import StructuredData from "@/components/common/StructuredData";
import "../lib/i18n";
import "./globals.css";

export default function RootLayout({ children }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html
      lang={mounted ? i18n.language || "el" : "el"}
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/images/logo-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/logo-192.png" />
        <meta name="theme-color" content="#06100c" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen flex flex-col bg-surface-0 text-white antialiased">
        <MotionConfig reducedMotion="user">
          <LanguageDetector />
          <StructuredData />
          <Header1 />
          <main className="flex-1">{children}</main>
          <PhysioFooter />
          <Toaster position="top-center" richColors closeButton />
        </MotionConfig>
      </body>
    </html>
  );
}
