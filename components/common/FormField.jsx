"use client";

import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

// Πεδίο φόρμας με label, και μήνυμα λάθους από τους κοινούς κανόνες
// (common:validation.*). Χωρίς λάθος η εμφάνιση είναι ίδια με πριν· με λάθος
// το περίγραμμα γίνεται κοραλλί και το μήνυμα εμφανίζεται από κάτω, συνδεδεμένο
// με aria-describedby ώστε να το διαβάζουν και οι αναγνώστες οθόνης.
export const ERROR_TEXT = "text-[#f5a39a]";

export function FieldError({ id, error }) {
  const { t } = useTranslation("common");
  return (
    <div id={id} aria-live="polite">
      {error && (
        <p className={`mt-2 flex items-start gap-1.5 text-[13px] leading-snug ${ERROR_TEXT}`}>
          <AlertCircle className="w-3.5 h-3.5 mt-[0.15rem] flex-shrink-0" aria-hidden="true" />
          <span>{t(`common:validation.${error.code}`, error.params || {})}</span>
        </p>
      )}
    </div>
  );
}

export function FormField({
  id,
  label,
  error,
  multiline,
  rows = 4,
  focusBorder = "focus:border-primary-soft/50",
  ...props
}) {
  const errorId = `${id}-error`;
  const border = error
    ? "border-[#f5a39a]/70 focus:border-[#f5a39a]"
    : `border-white/[0.08] ${focusBorder}`;
  const base = `w-full px-4 py-3 rounded-xl bg-[#050810] border ${border} focus:bg-[#0a0f1a] outline-none transition-all text-sm text-white placeholder:text-white/30`;
  const a11y = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": errorId,
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-white/55 mb-2"
      >
        {label}
      </label>
      {multiline ? (
        <textarea rows={rows} {...props} {...a11y} className={`${base} resize-none`} />
      ) : (
        <input {...props} {...a11y} className={`${base} [color-scheme:dark]`} />
      )}
      <FieldError id={errorId} error={error} />
    </div>
  );
}
