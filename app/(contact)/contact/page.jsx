"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import HeadManager from "@/components/common/HeadManager";
import { MotionWrapper } from "@/components/physio/MotionWrapper";

export default function ContactPage() {
  const { t, i18n } = useTranslation(["contact", "common"]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale: i18n.language || "el" }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(t("contact:form.success"));
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(t("contact:form.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <HeadManager namespace="contact" pageKey="meta" />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-muted">
        <div className="container max-w-3xl text-center">
          <MotionWrapper>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              {t("contact:title")}
            </h1>
            <p className="text-lg text-on-surface-variant">{t("contact:subtitle")}</p>
          </MotionWrapper>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact info */}
            <MotionWrapper>
              <div className="space-y-6">
                <ContactCard icon={MapPin} title={t("contact:info.address.title")} value={t("contact:info.address.value")} />
                <ContactCard
                  icon={Phone}
                  title={t("contact:info.phone.title")}
                  value={t("contact:info.phone.value")}
                  href={`tel:+30${t("contact:info.phone.value").replace(/\s/g, "")}`}
                />
                <ContactCard
                  icon={Mail}
                  title={t("contact:info.email.title")}
                  value={t("contact:info.email.value")}
                  href={`mailto:${t("contact:info.email.value")}`}
                />
              </div>
            </MotionWrapper>

            {/* Contact form */}
            <MotionWrapper delay={0.1}>
              <form
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl p-8 border border-border/40 editorial-shadow"
              >
                <div className="space-y-4">
                  <FormField
                    label={t("contact:form.name")}
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                  />
                  <FormField
                    label={t("contact:form.email")}
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                  <FormField
                    label={t("contact:form.phone")}
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                  />
                  <FormField
                    label={t("contact:form.message")}
                    multiline
                    value={form.message}
                    onChange={handleChange("message")}
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? t("common:actions.loading") : t("contact:form.send")}
                  </button>
                </div>
              </form>
            </MotionWrapper>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({ icon: Icon, title, value, href }) {
  const Content = (
    <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/30 transition-colors editorial-shadow">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-on-surface-variant">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {Content}
    </a>
  ) : (
    Content
  );
}

function FormField({ label, multiline, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {multiline ? (
        <textarea
          rows={4}
          {...props}
          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm resize-none"
        />
      ) : (
        <input
          {...props}
          className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
        />
      )}
    </div>
  );
}
