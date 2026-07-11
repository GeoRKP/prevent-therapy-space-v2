"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  CalendarCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

export default function BookingPage() {
  const { t, ready, i18n } = useTranslation(["booking", "services", "common"]);
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    service: null,
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleServiceSelect = (id) => {
    setSelection((p) => ({ ...p, service: id }));
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selection, locale: i18n.language || "el" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStep(4);
    } catch (err) {
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
          {step < 4 && (
            <div className="flex items-center justify-center gap-3 mb-12">
              {[1, 2, 3].map((n) => (
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
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight">
                {ready ? t("booking:steps.service") : ""}
              </h2>
              <p className="text-white/55 mb-8 text-sm">01 / 03</p>

              <div className="grid gap-3">
                {services.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleServiceSelect(s.id)}
                      className="group flex items-center gap-4 p-5 rounded-2xl bg-[#070b14] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary/30 text-left transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white mb-0.5 group-hover:text-primary transition-colors">
                          {ready ? t(`services:items.${s.id}.name`) : ""}
                        </h3>
                        <p className="text-sm text-white/55 line-clamp-1">
                          {ready ? t(`services:items.${s.id}.description`) : ""}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight">
                {ready ? t("booking:steps.datetime") : ""}
              </h2>
              <p className="text-white/55 mb-8 text-sm">02 / 03</p>

              <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-7 space-y-5">
                <FormField
                  label={ready ? t("booking:summary.date") : "Date"}
                  type="date"
                  value={selection.date}
                  onChange={(e) =>
                    setSelection((p) => ({ ...p, date: e.target.value }))
                  }
                />
                <FormField
                  label={ready ? t("booking:summary.time") : "Time"}
                  type="time"
                  value={selection.time}
                  onChange={(e) =>
                    setSelection((p) => ({ ...p, time: e.target.value }))
                  }
                />
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {ready ? t("common:actions.back") : "Back"}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selection.date || !selection.time}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {ready ? t("common:actions.next") : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight">
                {ready ? t("booking:steps.details") : ""}
              </h2>
              <p className="text-white/55 mb-8 text-sm">03 / 03</p>

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
                    onClick={() => setStep(2)}
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

          {step === 4 && (
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
              <p className="text-white/55 mb-8 text-lg">
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
