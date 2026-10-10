"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MessageCircle, MapPin, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { contactInfo } from "@/data/conditions";
import HeadManager from "@/components/common/HeadManager";
import { PageHero } from "@/components/physio/PageHero";
import { FormField, FieldError } from "@/components/common/FormField";
import { validateContact, CONTACT_FIELDS } from "@/lib/form-validation";
import { useFormValidation, focusField } from "@/lib/use-form-validation";

export default function ContactPage() {
  const { t, ready, i18n } = useTranslation(["contact", "common", "footer"]);
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
        title={ready ? t("contact:title") : ""}
        subtitle={ready ? t("contact:subtitle") : ""}
        backgroundImage="/images/clinic/office-photo.jpg"
      />

      <section className="relative section-pad pt-0 lg:pt-0 bg-[#050810]">
        <div className="container grid lg:grid-cols-12 gap-x-12 gap-y-12 items-start">
          {/* Αριστερά — στοιχεία */}
          <div className="lg:col-span-5">
            <h2 className="t-h3 text-white mb-6">{ready ? t("contact:infoTitle") : ""}</h2>
            <dl className="border-t border-white/12">
              <ContactRow
                icon={MapPin}
                title={ready ? t("contact:info.address.title") : ""}
                value={ready ? t("contact:info.address.value") : ""}
                href={ready ? t("contact:location.googleMapsUrl") : undefined}
                external
              />
              <ContactRow
                icon={Phone}
                title={ready ? t("contact:info.phone.title") : ""}
                value={ready ? t("contact:info.phone.value") : ""}
                href={`tel:+30${contactInfo.phone.replace(/\s/g, "")}`}
              />
              <ContactRow
                icon={MessageCircle}
                title={ready ? t("contact:info.viber.title") : ""}
                value={ready ? t("contact:info.viber.value") : ""}
                href={contactInfo.viberHref}
              />
              <ContactRow
                icon={Mail}
                title={ready ? t("contact:info.email.title") : ""}
                value={contactInfo.email}
                href={`mailto:${contactInfo.email}`}
              />
              <div className="grid grid-cols-[1.25rem_1fr] gap-x-4 py-5 border-b border-white/12">
                <Clock className="w-5 h-5 mt-0.5 text-primary-soft" aria-hidden="true" />
                <div>
                  <dt className="t-small text-white/55">{ready ? t("footer:hours.title") : ""}</dt>
                  <dd className="mt-1 t-small text-white space-y-1">
                    <span className="flex justify-between gap-6 max-w-xs">
                      <span className="text-white/75">{ready ? t("footer:hours.mondayFriday") : ""}</span>
                      <span className="tabular-nums">{ready ? t("footer:hours.mondayFridayTime") : ""}</span>
                    </span>
                    <span className="flex justify-between gap-6 max-w-xs">
                      <span className="text-white/75">{ready ? t("footer:hours.saturday") : ""}</span>
                      <span className="tabular-nums">{ready ? t("footer:hours.saturdayTime") : ""}</span>
                    </span>
                    <span className="flex justify-between gap-6 max-w-xs">
                      <span className="text-white/75">{ready ? t("footer:hours.sunday") : ""}</span>
                      <span className="text-white/50">{ready ? t("footer:hours.closed") : ""}</span>
                    </span>
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Δεξιά — φόρμα */}
          <div className="lg:col-span-7 rounded-[20px] bg-[#0a0f1a] p-7 sm:p-10 max-sm:-mx-1">
            <h2 className="t-h3 text-white mb-7">{ready ? t("contact:formTitle") : ""}</h2>
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
                  focusBorder="focus:border-primary-soft/60"
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
                  focusBorder="focus:border-primary-soft/60"
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
                  focusBorder="focus:border-primary-soft/60"
                />
                <FormField
                  id="contact-message"
                  label={ready ? t("contact:form.message") : ""}
                  multiline
                  value={form.message}
                  onChange={handleChange("message")}
                  onBlur={() => v.touch("message")}
                  error={v.errors.message}
                  focusBorder="focus:border-primary-soft/60"
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
                    <span className="t-small text-white/65">
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
                  className="inline-flex items-center justify-center gap-2 w-full h-13 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold hover:bg-[#a3dec4] transition-colors disabled:opacity-50"
                >
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
      </section>
    </>
  );
}

function ContactRow({ icon: Icon, title, value, href, external }) {
  const body = (
    <>
      <Icon className="w-5 h-5 mt-0.5 text-primary-soft" aria-hidden="true" />
      <div>
        <dt className="t-small text-white/55">{title}</dt>
        <dd className="mt-0.5 text-white group-hover:text-primary-soft transition-colors">{value}</dd>
      </div>
    </>
  );
  const cls = "group grid grid-cols-[1.25rem_1fr] gap-x-4 py-5 border-b border-white/12";
  return href ? (
    <a
      href={href}
      className={cls}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}
