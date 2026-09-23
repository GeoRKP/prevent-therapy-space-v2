"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MessageCircle, MapPin, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { contactInfo } from "@/data/conditions";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";
import { RevealText } from "@/components/effects/kinetic-text";
import { FormField, FieldError } from "@/components/common/FormField";
import { validateContact, CONTACT_FIELDS } from "@/lib/form-validation";
import { useFormValidation, focusField } from "@/lib/use-form-validation";

export default function ContactPage() {
  const { t, ready, i18n } = useTranslation(["contact", "common"]);
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const values = { ...form, consent };
  const v = useFormValidation(validateContact, values, CONTACT_FIELDS);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstInvalid = v.touchAll();
    if (firstInvalid) {
      focusField(`contact-${firstInvalid}`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale: i18n.language === "en" ? "en" : "el" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "validation" && data.fields) {
          const first = v.fromServer(data.fields);
          if (first) focusField(`contact-${first}`);
          toast.error(t("common:validation.fixFields"));
          return;
        }
        throw new Error("Failed");
      }
      toast.success(t("contact:form.success"));
      setForm({ name: "", email: "", phone: "", message: "" });
      setConsent(false);
      v.reset();
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

      <section className="relative section-pad overflow-hidden bg-[#050810]">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
            {/* Left — info */}
            <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-7 lg:p-10">
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
                  icon={MessageCircle}
                  title={ready ? t("contact:info.viber.title") : ""}
                  value={ready ? t("contact:info.viber.value") : ""}
                  href={contactInfo.viberHref}
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
            <div className="bg-[#070b14] border border-white/[0.06] rounded-3xl p-7 lg:p-10">
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

              {/* noValidate: τα γενικά μηνύματα του browser αντικαθίστανται από τα
                  δικά μας (lib/form-validation.js), που λένε τι ακριβώς λείπει */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <FormField
                  id="contact-name"
                  label={ready ? t("contact:form.name") : ""}
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange("name")}
                  onBlur={() => v.touch("name")}
                  error={v.errors.name}
                  focusBorder="focus:border-primary/50"
                  required
                />
                <FormField
                  id="contact-email"
                  label={ready ? t("contact:form.email") : ""}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={ready ? t("contact:form.emailPlaceholder") : ""}
                  value={form.email}
                  onChange={handleChange("email")}
                  onBlur={() => v.touch("email")}
                  error={v.errors.email}
                  focusBorder="focus:border-primary/50"
                  required
                />
                <FormField
                  id="contact-phone"
                  label={ready ? t("contact:form.phone") : ""}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={ready ? t("contact:form.phonePlaceholder") : ""}
                  value={form.phone}
                  onChange={handleChange("phone")}
                  onBlur={() => v.touch("phone")}
                  error={v.errors.phone}
                  focusBorder="focus:border-primary/50"
                />
                <FormField
                  id="contact-message"
                  label={ready ? t("contact:form.message") : ""}
                  multiline
                  value={form.message}
                  onChange={handleChange("message")}
                  onBlur={() => v.touch("message")}
                  error={v.errors.message}
                  focusBorder="focus:border-primary/50"
                  required
                />
                <div>
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <input
                      id="contact-consent"
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        v.touch("consent");
                      }}
                      aria-invalid={v.errors.consent ? true : undefined}
                      aria-describedby="contact-consent-error"
                      className="mt-0.5 w-4 h-4 accent-[#82d9b9] flex-shrink-0"
                    />
                    <span className="text-xs text-white/55 leading-relaxed">
                      {ready ? t("contact:form.consentPrefix") : ""}{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-soft underline underline-offset-2 hover:text-primary-soft/80"
                      >
                        {ready ? t("contact:form.consentLink") : ""}
                      </a>
                      .
                    </span>
                  </label>
                  <FieldError id="contact-consent-error" error={v.errors.consent} />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 w-full px-7 py-3.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
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
      className="group flex items-center gap-4 p-5 rounded-2xl bg-[#050810] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary/30 transition-all"
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
