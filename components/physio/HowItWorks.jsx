"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionHeading } from "./SectionHeading";

const STEPS = ["step1", "step2", "step3", "step4"];
const EASE = [0.22, 1, 0.36, 1];

// «Ο δρόμος προς την αποκατάσταση»: τα τέσσερα βήματα πάνω σε μία γραμμή που
// σχεδιάζεται μία φορά όταν η ενότητα έρθει στην οθόνη. Η σειρά φαίνεται από
// τη γραμμή — χωρίς αρίθμηση. Οριζόντια στο desktop, κάθετη στο κινητό.
export function HowItWorks() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  return (
    <section className="relative section-pad bg-[#070b14] m-section-alt">
      <div className="container">
        <SectionHeading title={t("howItWorks.title")} subtitle={t("howItWorks.subtitle")} />

        <div className="relative">
          {/* Η γραμμή — desktop (οριζόντια) */}
          <motion.div
            aria-hidden="true"
            className="max-lg:hidden absolute left-0 right-0 top-[7px] h-px origin-left bg-gradient-to-r from-primary-soft/80 via-primary-soft/45 to-primary-soft/10"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-120px 0px" }}
            transition={{ duration: 1.6, ease: EASE }}
          />
          {/* Η γραμμή — κινητό (κάθετη) */}
          <motion.div
            aria-hidden="true"
            className="lg:hidden absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-primary-soft/80 via-primary-soft/45 to-primary-soft/10"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px 0px" }}
            transition={{ duration: 1.4, ease: EASE }}
          />

          <ol className="relative grid lg:grid-cols-4 gap-x-10 gap-y-10">
            {STEPS.map((key, i) => {
              const last = i === STEPS.length - 1;
              return (
                <li key={key} className="relative max-lg:pl-10">
                  <motion.span
                    aria-hidden="true"
                    className={
                      "absolute left-0 top-0 block w-[15px] h-[15px] rounded-full " +
                      (last
                        ? "bg-primary-soft shadow-[0_0_0_6px_rgba(141,213,182,0.14)]"
                        : "bg-[#070b14] border border-primary-soft")
                    }
                    initial={{ scale: 0.4, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-120px 0px" }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.32, ease: EASE }}
                  />
                  <h3 className="t-h3 text-white lg:mt-10 max-lg:-mt-1.5">
                    {t(`howItWorks.${key}Title`)}
                  </h3>
                  <p className="t-small text-white/65 mt-3 max-w-[30ch] max-lg:max-w-none max-lg:mt-2">
                    {t(`howItWorks.${key}Desc`)}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
