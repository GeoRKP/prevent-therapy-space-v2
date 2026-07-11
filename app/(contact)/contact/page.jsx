"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";
import { RevealText } from "@/components/effects/kinetic-text";

export default function ContactPage() {
  const { t, ready, i18n } = useTranslation(["contact", "common"]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

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

  const handleChange = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <HeadManager namespace="contact" pageKey="meta" />

      <PageHero
        label={ready ? "Επικοινωνία" : ""}
        title={ready ? t("contact:title") : ""}
        subtitle={ready ? t("contact:subtitle") : ""}
        backgroundImage="/images/clinic/office-photo.jpg"
      />

      <section className="relative py-24 lg:py-32 overflow-hidden bg-surface-0">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
            {/* Left — info */}
            <div className="bg-surface-1 border border-white/[0.06] rounded-3xl p-7 lg:p-10">
              <RevealText>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-px bg-primary/70" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Info
                  </span>
                </div>
              </RevealText>

              <RevealText delay={0.1}>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-7 tracking-tight">
                  Επικοινωνήστε μαζί μας
                </h3>
              </RevealText>

              <div className="space-y-3">
                <ContactCard
                  icon={MapPin}
                  title={ready ? t("contact:info.address.title") : ""}
                  value={ready ? t("contact:info.address.value") : ""}
                />
                <ContactCard
                  icon={Phone}
                  title={ready ? t("contact:info.phone.title") : ""}
                  value={ready ? t("contact:info.phone.value") : ""}
                  href={`tel:+30${(ready ? t("contact:info.phone.value") : "").replace(/\s/g, "")}`}
                />
                <ContactCard
                  icon={Mail}
                  title={ready ? t("contact:info.email.title") : ""}
                  value={ready ? t("contact:info.email.value") : ""}
                  href={`mailto:${ready ? t("contact:info.email.value") : ""}`}
                />
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-surface-1 border border-white/[0.06] rounded-3xl p-7 lg:p-10">
              <RevealText>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-px bg-primary/70" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Form
                  </span>
                </div>
              </RevealText>

              <RevealText delay={0.1}>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-7 tracking-tight">
                  Στείλτε μήνυμα
                </h3>
              </RevealText>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label={ready ? t("contact:form.name") : ""}
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
                <FormField
                  label={ready ? t("contact:form.email") : ""}
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
                <FormField
                  label={ready ? t("contact:form.phone") : ""}
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                />
                <FormField
                  label={ready ? t("contact:form.message") : ""}
                  multiline
                  value={form.message}
                  onChange={handleChange("message")}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 w-full px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting
                    ? ready
                      ? t("common:actions.loading")
                      : "..."
                    : ready
                      ? t("contact:form.send")
                      : "Send"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({ icon: Icon, title, value, href }) {
  const Content = (
    <motion.div
      whileHover={{ x: 3 }}
      className="group flex items-center gap-4 p-5 rounded-2xl bg-surface-0 hover:bg-surface-2 border border-white/[0.06] hover:border-primary/30 transition-all"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-white/55 mb-0.5">
          {title}
        </h4>
        <p className="text-white font-medium group-hover:text-primary transition-colors">
          {value}
        </p>
      </div>
    </motion.div>
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
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/55 mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={4}
          {...props}
          className="w-full px-4 py-3 rounded-xl bg-surface-0 border border-white/[0.08] focus:border-primary/50 focus:bg-surface-2 outline-none transition-all text-sm text-white placeholder:text-white/30 resize-none"
        />
      ) : (
        <input
          {...props}
          className="w-full px-4 py-3 rounded-xl bg-surface-0 border border-white/[0.08] focus:border-primary/50 focus:bg-surface-2 outline-none transition-all text-sm text-white placeholder:text-white/30 [color-scheme:dark]"
        />
      )}
    </div>
  );
}
