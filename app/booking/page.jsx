"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import HeadManager from "@/components/common/HeadManager";
import { MotionWrapper } from "@/components/physio/MotionWrapper";
import { services } from "@/data/services";

export default function BookingPage() {
  const { t, i18n } = useTranslation(["booking", "services", "common"]);
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

      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-muted">
        <div className="container max-w-3xl text-center">
          <MotionWrapper>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              {t("booking:title")}
            </h1>
            <p className="text-lg text-on-surface-variant">{t("booking:subtitle")}</p>
          </MotionWrapper>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container max-w-3xl">
          {/* Steps indicator */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-2 mb-10">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-1.5 rounded-full transition-all ${
                    n <= step ? "bg-primary w-12" : "bg-border w-6"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 1: Service */}
          {step === 1 && (
            <MotionWrapper>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t("booking:steps.service")}
              </h2>
              <div className="grid gap-3">
                {services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleServiceSelect(s.id)}
                      className="group flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 text-left transition-all"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">
                          {t(`services:items.${s.id}.name`)}
                        </h3>
                        <p className="text-sm text-on-surface-variant line-clamp-1">
                          {t(`services:items.${s.id}.description`)}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </MotionWrapper>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <MotionWrapper>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t("booking:steps.datetime")}
              </h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <FormInput
                  label={t("booking:summary.date")}
                  type="date"
                  value={selection.date}
                  onChange={(e) => setSelection((p) => ({ ...p, date: e.target.value }))}
                />
                <FormInput
                  label={t("booking:summary.time")}
                  type="time"
                  value={selection.time}
                  onChange={(e) => setSelection((p) => ({ ...p, time: e.target.value }))}
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
                  >
                    {t("common:actions.back")}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selection.date || !selection.time}
                    className="flex-1 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-secondary transition-colors text-sm font-semibold disabled:opacity-50"
                  >
                    {t("common:actions.next")}
                  </button>
                </div>
              </div>
            </MotionWrapper>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <MotionWrapper>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t("booking:steps.details")}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-xl p-6 space-y-4"
              >
                <FormInput
                  label={t("booking:form.name")}
                  required
                  value={selection.name}
                  onChange={(e) => setSelection((p) => ({ ...p, name: e.target.value }))}
                />
                <FormInput
                  label={t("booking:form.email")}
                  type="email"
                  required
                  value={selection.email}
                  onChange={(e) => setSelection((p) => ({ ...p, email: e.target.value }))}
                />
                <FormInput
                  label={t("booking:form.phone")}
                  type="tel"
                  required
                  value={selection.phone}
                  onChange={(e) => setSelection((p) => ({ ...p, phone: e.target.value }))}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("booking:form.notes")}
                  </label>
                  <textarea
                    rows={3}
                    value={selection.notes}
                    onChange={(e) => setSelection((p) => ({ ...p, notes: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
                  >
                    {t("common:actions.back")}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-secondary transition-colors text-sm font-semibold disabled:opacity-50"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    {submitting ? t("common:actions.loading") : t("booking:form.submit")}
                  </button>
                </div>
              </form>
            </MotionWrapper>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <MotionWrapper>
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarCheck className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {t("booking:success.title")}
                </h2>
                <p className="text-on-surface-variant mb-8">
                  {t("booking:success.message")}
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-secondary transition-colors"
                >
                  {t("booking:success.back")}
                </a>
              </div>
            </MotionWrapper>
          )}
        </div>
      </section>
    </>
  );
}

function FormInput({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
      />
    </div>
  );
}
