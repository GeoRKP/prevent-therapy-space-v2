"use client";

// Το client «κέλυφος» της εφαρμογής: i18n, motion config, header/footer, toasts.
// Ζει ξεχωριστά από το app/layout.jsx ώστε το root layout να μείνει server
// component και να μπορεί να εξάγει metadata (title/description/OG) για SEO.
import "@/lib/i18n";
import { MotionConfig } from "framer-motion";
import Header1 from "@/components/headers/Header1";
import { PhysioFooter } from "@/components/physio/PhysioFooter";
import { Toaster } from "@/components/ui/sonner";
import LanguageDetector from "@/components/common/LanguageDetector";
import StructuredData from "@/components/common/StructuredData";

export default function AppShell({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageDetector />
      <StructuredData />
      <Header1 />
      <main className="flex-1">{children}</main>
      <PhysioFooter />
      <Toaster position="top-center" richColors closeButton />
    </MotionConfig>
  );
}
