"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  CalendarCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";
import { cn } from "@/lib/utils";

// Ώρες πριν τις 14:00 εμφανίζονται ως «Πρωί», οι υπόλοιπες ως «Απόγευμα»
const AFTERNOON_FROM = 14 * 60;

export default function BookingPage() {
  const { t, ready, i18n } = useTranslation(["booking", "common"]);
  const [step, setStep] = useState(1);
  const [availability, setAvailability] = useState(null); // { durationMinutes, days: [...] }
  const [loadError, setLoadError] = useState(false);
  const [selection, setSelection] = useState({
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const locale = i18n.language === "en" ? "en-GB" : "el-GR";

  const loadAvailability = async () => {
    setAvailability(null);
    setLoadError(false);
    try {
      const res = await fetch("/api/booking/availability", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed");
      setAvailability(await res.json());
    } catch {
      setLoadError(true);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const selectedDay = useMemo(
    () => availability?.days.find((d) => d.date === selection.date),
    [availability, selection.date]
  );

  const { morning, afternoon } = useMemo(() => {
    const slots = selectedDay?.slots || [];
    const toMinutes = (s) => {
      const [h, m] = s.split(":").map(Number);
      return h * 60 + m;
    };
    return {
      morning: slots.filter((s) => toMinutes(s) < AFTERNOON_FROM),
      afternoon: slots.filter((s) => toMinutes(s) >= AFTERNOON_FROM),
    };
  }, [selectedDay]);

  const formatDay = (dateStr) => {
    const date = new Date(`${dateStr}T12:00:00`);
    return {
      weekday: date.toLocaleDateString(locale, { weekday: "short" }),
      day: date.toLocaleDateString(locale, { day: "numeric" }),
      month: date.toLocaleDateString(locale, { month: "short" }),
    };
  };

  const formatFullDate = (dateStr) =>
    dateStr
      ? new Date(`${dateStr}T12:00:00`).toLocaleDateString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selection),
      });
      if (res.ok) {
        setStep(3);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data.error === "slot_taken" || data.error === "invalid_slot") {
        toast.error(t("booking:errors.slotTaken"));
        setSelection((p) => ({ ...p, date: "", time: "" }));
        setStep(1);
        loadAvailability();
      } else if (data.error === "validation") {
        toast.error(t("booking:errors.invalid"));
      } else {
        toast.error(t("booking:errors.generic"));
      }
    } catch {
      toast.error(t("booking:errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <HeadManager namespace="booking" pageKey="meta" />

      <PageHero
        label={ready ? "Booking" : ""}
        title={ready ? t("booking:title") : ""}
        subtitle={ready ? t("booking:subtitle") : ""}
        backgroundImage="/images/clinic/beautiful-chropractor-bed-photo.jpg"
      />

      <section className="relative py-20 lg:py-28 overflow-hidden bg-[#050810]">
        <div className="container relative z-10 max-w-3xl">
          {step < 3 && (
            <div className="flex items-center justify-center gap-3 mb-12">
              {[1, 2].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-mono",
                      n <= step ? "text-primary" : "text-white/20"
                    )}
                  >
                    {String(n).padStart(2, "0")}
                  </span>
                  <div
                    className={cn(
                      "h-0.5 rounded-full transition-all",
                      n <= step ? "bg-primary w-12" : "bg-white/10 w-6"
                    )}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-end justify-between gap-4 mb-3">
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {ready ? t("booking:steps.datetime") : ""}
                </h2>
                {availability && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/55 flex-shrink-0 pb-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {ready
                      ? t("booking:duration", {
                          minutes: availability.durationMinutes,
                        })
                      : ""}
                  </span>
                )}
              </div>
              <p className="text-white/55 mb-8 text-sm">01 / 02</p>

              {/* Φόρτωση διαθεσιμότητας */}
              {!availability && !loadError && (
                <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-7">
                  <div className="flex gap-2 mb-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-16 h-20 rounded-2xl bg-white/[0.04] animate-pulse"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-11 rounded-xl bg-white/[0.04] animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              )}

              {loadError && (
                <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-10 text-center">
                  <p className="text-white/55 mb-6 text-sm">
                    {ready ? t("booking:errors.loadFailed") : ""}
                  </p>
                  <button
                    onClick={loadAvailability}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {ready ? t("booking:retry") : "Retry"}
                  </button>
                </div>
              )}

              {availability && availability.days.length === 0 && (
                <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-10 text-center">
                  <p className="text-white/55 text-sm">
                    {ready ? t("booking:noSlotsWindow") : ""}
                  </p>
                </div>
              )}

              {availability && availability.days.length > 0 && (
                <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-7 space-y-7">
                  {/* Επιλογή ημέρας */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/55 mb-3">
                      {ready ? t("booking:selectDay") : ""}
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 [scrollbar-width:thin]">
                      {availability.days.map((d) => {
                        const f = formatDay(d.date);
                        const active = selection.date === d.date;
                        return (
                          <button
                            key={d.date}
                            onClick={() =>
                              setSelection((p) => ({
                                ...p,
                                date: d.date,
                                time: "",
                              }))
                            }
                            className={cn(
                              "flex flex-col items-center justify-center w-16 h-20 rounded-2xl border flex-shrink-0 transition-all",
                              active
                                ? "bg-primary/15 border-primary/50 text-white"
                                : "bg-[#050810] border-white/[0.08] text-white/55 hover:border-white/25 hover:text-white"
                            )}
                          >
                            <span className="text-[10px] uppercase tracking-wider">
                              {f.weekday}
                            </span>
                            <span
                              className={cn(
                                "text-lg font-bold",
                                active ? "text-primary" : "text-white"
                              )}
                            >
                              {f.day}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider">
                              {f.month}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Επιλογή ώρας */}
                  {selectedDay && (
                    <div className="space-y-5">
                      {[
                        { label: t("booking:morning"), slots: morning },
                        { label: t("booking:afternoon"), slots: afternoon },
                      ]
                        .filter((g) => g.slots.length > 0)
                        .map((group) => (
                          <div key={group.label}>
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/55 mb-3">
                              {group.label}
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {group.slots.map((time) => (
                                <button
                                  key={time}
                                  onClick={() =>
                                    setSelection((p) => ({ ...p, time }))
                                  }
                                  className={cn(
                                    "h-11 rounded-xl border text-sm font-semibold font-mono transition-all",
                                    selection.time === time
                                      ? "bg-primary text-white border-primary"
                                      : "bg-[#050810] border-white/[0.08] text-white/70 hover:border-primary/40 hover:text-white"
                                  )}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selection.date || !selection.time}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {ready ? t("common:actions.next") : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight">
                {ready ? t("booking:steps.details") : ""}
              </h2>
              <p className="text-white/55 mb-8 text-sm">02 / 02</p>

              {/* Σύνοψη επιλογής */}
              <div className="flex items-center gap-3 p-4 mb-5 rounded-2xl bg-primary/[0.07] border border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-white">
                  <span className="capitalize">{formatFullDate(selection.date)}</span>
                  <span className="text-white/55"> · </span>
                  <span className="font-mono font-semibold">{selection.time}</span>
                  {availability && (
                    <span className="text-white/55">
                      {" "}
                      ·{" "}
                      {ready
                        ? t("booking:duration", {
                            minutes: availability.durationMinutes,
                          })
                        : ""}
                    </span>
                  )}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-7 space-y-5"
              >
                <FormField
                  label={ready ? t("booking:form.name") : ""}
                  required
                  value={selection.name}
                  onChange={(e) =>
                    setSelection((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <FormField
                  label={ready ? t("booking:form.email") : ""}
                  type="email"
                  required
                  value={selection.email}
                  onChange={(e) =>
                    setSelection((p) => ({ ...p, email: e.target.value }))
                  }
                />
                <FormField
                  label={ready ? t("booking:form.phone") : ""}
                  type="tel"
                  required
                  value={selection.phone}
                  onChange={(e) =>
                    setSelection((p) => ({ ...p, phone: e.target.value }))
                  }
                />
                <FormField
                  label={ready ? t("booking:form.notes") : ""}
                  multiline
                  value={selection.notes}
                  onChange={(e) =>
                    setSelection((p) => ({ ...p, notes: e.target.value }))
                  }
                />
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {ready ? t("common:actions.back") : "Back"}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    {submitting
                      ? ready
                        ? t("common:actions.loading")
                        : "..."
                      : ready
                        ? t("booking:form.submit")
                        : "Submit"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-7 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                {ready ? t("booking:success.title") : ""}
              </h2>
              <p className="text-white/55 mb-2 text-lg">
                <span className="capitalize">{formatFullDate(selection.date)}</span>
                <span> · </span>
                <span className="font-mono font-semibold text-white/80">
                  {selection.time}
                </span>
              </p>
              <p className="text-white/55 mb-8">
                {ready ? t("booking:success.message") : ""}
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                {ready ? t("booking:success.back") : "Home"}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

function FormField({ label, multiline, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/55 mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          {...props}
          className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/[0.08] focus:border-primary/50 focus:bg-[#0a0f1a] outline-none transition-all text-sm text-white placeholder:text-white/30 resize-none"
        />
      ) : (
        <input
          {...props}
          className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/[0.08] focus:border-primary/50 focus:bg-[#0a0f1a] outline-none transition-all text-sm text-white placeholder:text-white/30 [color-scheme:dark]"
        />
      )}
    </div>
  );
}
