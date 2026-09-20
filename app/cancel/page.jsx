"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  CalendarX,
  CalendarCheck,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
} from "lucide-react";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";

export default function CancelPage() {
  return (
    <Suspense fallback={null}>
      <CancelContent />
    </Suspense>
  );
}

function CancelContent() {
  const { t, ready, i18n } = useTranslation(["booking"]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const sig = searchParams.get("sig") || "";

  // idle -> confirm | invalid | gone | tooLate | error -> (confirm) cancelling -> done
  const [state, setState] = useState("idle");
  const [details, setDetails] = useState(null);

  const locale = i18n.language === "en" ? "en-GB" : "el-GR";

  useEffect(() => {
    if (!id || !sig) {
      setState("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `/api/booking/cancel?id=${encodeURIComponent(id)}&sig=${encodeURIComponent(sig)}`,
          { cache: "no-store" }
        );
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setDetails(data);
          setState("confirm");
        } else if (data.error === "too_late") {
          setState("tooLate");
        } else if (data.error === "gone") {
          setState("gone");
        } else {
          setState("invalid");
        }
      } catch {
        setState("error");
      }
    })();
  }, [id, sig]);

  const handleCancel = async () => {
    setState("cancelling");
    try {
      const res = await fetch("/api/booking/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, sig }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("done");
      } else if (data.error === "too_late") {
        setState("tooLate");
      } else if (data.error === "gone") {
        setState("gone");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const formatFullDate = (dateStr) =>
    dateStr
      ? new Date(`${dateStr}T12:00:00`).toLocaleDateString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      : "";

  return (
    <>
      <HeadManager namespace="booking" pageKey="cancel.meta" />

      <PageHero
        label={ready ? "Booking" : ""}
        title={ready ? t("booking:cancel.title") : ""}
        subtitle=""
        backgroundImage="/images/clinic/beautiful-chropractor-bed-photo.jpg"
      />

      <section className="relative section-pad overflow-hidden bg-[#050810]">
        <div className="container relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-8 lg:p-10 text-center"
          >
            {state === "idle" && (
              <div className="py-8">
                <div className="w-10 h-10 mx-auto rounded-full border-2 border-primary-soft/30 border-t-primary-soft animate-spin" />
              </div>
            )}

            {state === "confirm" && details && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-soft/10 flex items-center justify-center">
                  <CalendarX className="w-8 h-8 text-primary-soft" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {ready ? t("booking:cancel.confirmTitle") : ""}
                </h2>
                <p className="text-white/70 mb-1 text-lg">
                  <span className="capitalize">{formatFullDate(details.date)}</span>
                  <span className="text-white/40"> · </span>
                  <span className="font-mono font-semibold">{details.time}</span>
                </p>
                <p className="text-white/55 text-sm mb-8">
                  {ready ? t("booking:cancel.confirmText") : ""}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
                  >
                    {ready ? t("booking:cancel.keep") : ""}
                  </a>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold text-sm hover:bg-primary-soft/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/60"
                  >
                    <CalendarX className="w-4 h-4" />
                    {ready ? t("booking:cancel.confirmButton") : ""}
                  </button>
                </div>
              </>
            )}

            {state === "cancelling" && (
              <div className="py-8">
                <div className="w-10 h-10 mx-auto rounded-full border-2 border-primary-soft/30 border-t-primary-soft animate-spin" />
              </div>
            )}

            {state === "done" && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-soft/10 border border-primary-soft/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary-soft" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {ready ? t("booking:cancel.doneTitle") : ""}
                </h2>
                <p className="text-white/55 text-sm mb-8">
                  {ready ? t("booking:cancel.doneText") : ""}
                </p>
                <a
                  href="/booking"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold text-sm hover:bg-primary-soft/90 transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  {ready ? t("booking:cancel.rebook") : ""}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </>
            )}

            {state === "tooLate" && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                  <PhoneCall className="w-8 h-8 text-primary-soft" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {ready ? t("booking:cancel.tooLateTitle") : ""}
                </h2>
                <p className="text-white/55 text-sm">
                  {ready ? t("booking:cancel.tooLateText") : ""}
                </p>
              </>
            )}

            {(state === "gone" || state === "invalid" || state === "error") && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                  <CalendarX className="w-8 h-8 text-white/40" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {ready ? t(`booking:cancel.${state}Title`) : ""}
                </h2>
                <p className="text-white/55 text-sm mb-8">
                  {ready ? t(`booking:cancel.${state}Text`) : ""}
                </p>
                <a
                  href="/booking"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
                >
                  {ready ? t("booking:cancel.rebook") : ""}
                </a>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
