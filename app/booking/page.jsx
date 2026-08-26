"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  CalendarCheck,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";
import { cn } from "@/lib/utils";

// Ώρες πριν τις 14:00 εμφανίζονται ως «Πρωί», οι υπόλοιπες ως «Απόγευμα»
const AFTERNOON_FROM = 14 * 60;

const pad2 = (n) => String(n).padStart(2, "0");
const toMinutes = (s) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

export default function BookingPage() {
  const { t, ready, i18n } = useTranslation(["booking", "common"]);
  const [step, setStep] = useState(1);
  const [availability, setAvailability] = useState(null); // { durationMinutes, days: [...] }
  const [loadError, setLoadError] = useState(false);
  const [monthIdx, setMonthIdx] = useState(0);
  const [selection, setSelection] = useState({
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);

  const locale = i18n.language === "en" ? "en-GB" : "el-GR";

  const loadAvailability = async () => {
    setAvailability(null);
    setLoadError(false);
    setMonthIdx(0);
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

  // date -> slots της ημέρας, για γρήγορο lookup από το ημερολόγιο
  const slotsByDate = useMemo(() => {
    const map = new Map();
    for (const d of availability?.days || []) map.set(d.date, d.slots);
    return map;
  }, [availability]);

  // Οι μήνες που καλύπτει το παράθυρο κρατήσεων (από την πρώτη ως την τελευταία διαθέσιμη μέρα)
  const months = useMemo(() => {
    const days = availability?.days;
    if (!days?.length) return [];
    let [y, m] = days[0].date.split("-").map(Number);
    const [ly, lm] = days[days.length - 1].date.split("-").map(Number);
    const list = [];
    while (y < ly || (y === ly && m <= lm)) {
      list.push({ year: y, month: m });
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
    return list;
  }, [availability]);

  const selectedDay = useMemo(
    () => availability?.days.find((d) => d.date === selection.date),
    [availability, selection.date]
  );

  const { morning, afternoon } = useMemo(() => {
    const slots = selectedDay?.slots || [];
    return {
      morning: slots.filter((s) => toMinutes(s) < AFTERNOON_FROM),
      afternoon: slots.filter((s) => toMinutes(s) >= AFTERNOON_FROM),
    };
  }, [selectedDay]);

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
        body: JSON.stringify({
          ...selection,
          consent,
          locale: i18n.language === "en" ? "en" : "el",
        }),
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
        <div className="container relative z-10 max-w-4xl">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-end justify-between gap-4 mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {ready ? t("booking:steps.datetime") : ""}
                </h2>
                {availability && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/55 flex-shrink-0 pb-1">
                    <Clock className="w-3.5 h-3.5 text-primary-soft" />
                    {ready
                      ? t("booking:duration", {
                          minutes: availability.durationMinutes,
                        })
                      : ""}
                  </span>
                )}
              </div>

              {/* Φόρτωση διαθεσιμότητας */}
              {!availability && !loadError && (
                <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl overflow-hidden grid md:grid-cols-2">
                  <div className="p-6 lg:p-7 space-y-4">
                    <div className="h-6 w-40 rounded-lg bg-white/[0.04] animate-pulse" />
                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl bg-white/[0.04] animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:block p-6 lg:p-7 border-l border-white/[0.06]">
                    <div className="h-6 w-48 rounded-lg bg-white/[0.04] animate-pulse mb-5" />
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-11 rounded-xl bg-white/[0.04] animate-pulse"
                        />
                      ))}
                    </div>
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
                <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl overflow-hidden">
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
                    <CalendarPane
                      months={months}
                      monthIdx={monthIdx}
                      setMonthIdx={setMonthIdx}
                      slotsByDate={slotsByDate}
                      locale={locale}
                      ready={ready}
                      t={t}
                      selectedDate={selection.date}
                      onSelect={(date) =>
                        setSelection((p) => ({ ...p, date, time: "" }))
                      }
                    />

                    {/* Ώρες επιλεγμένης ημέρας */}
                    <div className="p-6 lg:p-7 flex flex-col min-h-[280px]">
                      <AnimatePresence mode="wait">
                        {selectedDay ? (
                          <motion.div
                            key={selection.date}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-5"
                          >
                            <p className="text-sm font-semibold text-white capitalize">
                              {formatFullDate(selection.date)}
                            </p>
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
                                  <div className="grid grid-cols-3 gap-2">
                                    {group.slots.map((time) => (
                                      <button
                                        key={time}
                                        onClick={() =>
                                          setSelection((p) => ({ ...p, time }))
                                        }
                                        className={cn(
                                          "h-11 rounded-xl border text-sm font-semibold font-mono transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/60",
                                          selection.time === time
                                            ? "bg-primary-soft text-primary-soft-foreground border-primary-soft"
                                            : "bg-[#050810] border-white/[0.08] text-white/70 hover:border-primary-soft/40 hover:text-white"
                                        )}
                                      >
                                        {time}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-primary-soft/10 flex items-center justify-center">
                              <CalendarDays className="w-6 h-6 text-primary-soft" />
                            </div>
                            <p className="text-sm text-white/55 max-w-[220px]">
                              {ready ? t("booking:pickDayHint") : ""}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="p-5 border-t border-white/[0.06]">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selection.date || !selection.time}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold text-sm hover:bg-primary-soft/90 transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/60"
                    >
                      {ready ? t("common:actions.next") : "Next"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 tracking-tight">
                {ready ? t("booking:steps.details") : ""}
              </h2>

              {/* Σύνοψη επιλογής */}
              <div className="flex items-center gap-3 p-4 mb-5 rounded-2xl bg-primary-soft/[0.07] border border-primary-soft/20">
                <div className="w-10 h-10 rounded-xl bg-primary-soft/15 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-5 h-5 text-primary-soft" />
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
                <label className="flex items-start gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#82d9b9] flex-shrink-0"
                  />
                  <span className="text-xs text-white/55 leading-relaxed">
                    {ready ? t("booking:form.consentPrefix") : ""}{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-soft underline underline-offset-2 hover:text-primary-soft/80"
                    >
                      {ready ? t("booking:form.consentLink") : ""}
                    </a>
                    .
                  </span>
                </label>

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
                    disabled={submitting || !consent}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold text-sm hover:bg-primary-soft/90 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/60"
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
              <div className="w-20 h-20 mx-auto mb-7 rounded-2xl bg-primary-soft/10 border border-primary-soft/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary-soft" />
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
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold text-sm hover:bg-primary-soft/90 transition-colors"
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

/**
 * Μηνιαίο ημερολόγιο (Δευτέρα πρώτη). Διαθέσιμες ημέρες: λευκές, με 1–3 mint
 * τελείες ανάλογα με το πλήθος ελεύθερων ωρών. Ανενεργές: αχνές.
 */
function CalendarPane({
  months,
  monthIdx,
  setMonthIdx,
  slotsByDate,
  locale,
  ready,
  t,
  selectedDate,
  onSelect,
}) {
  const current = months[Math.min(monthIdx, months.length - 1)];

  // Ετικέτες ημερών εβδομάδας, Δευτέρα πρώτη (η 1/1/2024 ήταν Δευτέρα)
  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        new Date(Date.UTC(2024, 0, 1 + i)).toLocaleDateString(locale, {
          weekday: "short",
          timeZone: "UTC",
        })
      ),
    [locale]
  );

  const monthLabel = new Date(current.year, current.month - 1, 1).toLocaleDateString(
    locale,
    { month: "long", year: "numeric" }
  );

  const daysInMonth = new Date(current.year, current.month, 0).getDate();
  const leadingBlanks = (new Date(current.year, current.month - 1, 1).getDay() + 6) % 7;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

  return (
    <div className="p-6 lg:p-7">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-white capitalize">{monthLabel}</p>
        <div className="flex gap-1.5">
          <button
            onClick={() => setMonthIdx(monthIdx - 1)}
            disabled={monthIdx === 0}
            aria-label={ready ? t("booking:prevMonth") : "Previous month"}
            className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/55 hover:text-white hover:border-white/25 transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/60"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMonthIdx(monthIdx + 1)}
            disabled={monthIdx >= months.length - 1}
            aria-label={ready ? t("booking:nextMonth") : "Next month"}
            className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/55 hover:text-white hover:border-white/25 transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/60"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {weekDays.map((d) => (
          <span
            key={d}
            className="text-center text-[10px] font-semibold uppercase tracking-wider text-white/40 py-1"
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${current.year}-${pad2(current.month)}-${pad2(day)}`;
          const slots = slotsByDate.get(dateStr);
          const isToday = dateStr === todayStr;

          if (!slots) {
            return (
              <span
                key={dateStr}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-xl text-sm text-white/20",
                  isToday && "ring-1 ring-inset ring-white/15"
                )}
              >
                {day}
              </span>
            );
          }

          const active = selectedDate === dateStr;
          const dots = slots.length >= 10 ? 3 : slots.length >= 5 ? 2 : 1;

          return (
            <button
              key={dateStr}
              onClick={() => onSelect(dateStr)}
              aria-label={
                ready
                  ? `${new Date(`${dateStr}T12:00:00`).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })} — ${t("booking:slotsCount", { count: slots.length })}`
                  : dateStr
              }
              aria-pressed={active}
              className={cn(
                "aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft/60",
                active
                  ? "bg-primary-soft text-primary-soft-foreground border-primary-soft"
                  : "bg-[#050810] border-white/[0.08] text-white hover:border-primary-soft/40",
                isToday && !active && "ring-1 ring-inset ring-white/20"
              )}
            >
              {day}
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: dots }).map((_, j) => (
                  <span
                    key={j}
                    className={cn(
                      "w-1 h-1 rounded-full",
                      active ? "bg-primary-soft-foreground/70" : "bg-primary-soft/80"
                    )}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
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
          className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/[0.08] focus:border-primary-soft/50 focus:bg-[#0a0f1a] outline-none transition-all text-sm text-white placeholder:text-white/30 resize-none"
        />
      ) : (
        <input
          {...props}
          className="w-full px-4 py-3 rounded-xl bg-[#050810] border border-white/[0.08] focus:border-primary-soft/50 focus:bg-[#0a0f1a] outline-none transition-all text-sm text-white placeholder:text-white/30 [color-scheme:dark]"
        />
      )}
    </div>
  );
}
