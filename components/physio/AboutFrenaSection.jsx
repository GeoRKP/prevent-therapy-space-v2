"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Star, ArrowUpRight } from "lucide-react";
import { RevealText } from "@/components/effects/kinetic-text";
import { reviews, googleReviews } from "@/data/reviews";

export function AboutFrenaSection() {
  const { t, ready, i18n } = useTranslation("home");
  if (!ready) return null;

  const lang = i18n.language === "en" ? "en" : "el";
  const rating =
    lang === "el"
      ? googleReviews.ratingValue.replace(".", ",")
      : googleReviews.ratingValue;
  const points = t("aboutSection.points", { returnObjects: true }) || [];

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden bg-[#050810]">
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[200px] translate-y-1/2 pointer-events-none" />

      <div className="container relative z-10">
        <div className="mb-16 lg:mb-20">
          <RevealText>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t("aboutSection.badge")}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          </RevealText>

          <div className="grid lg:grid-cols-2 gap-10 items-end">
            <RevealText delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                <span className="text-white">{t("aboutSection.title")}</span>
                <br />
                <span className="text-primary">
                  {t("aboutSection.subtitle")}
                </span>
              </h2>
            </RevealText>

            <RevealText delay={0.2}>
              <p className="text-base lg:text-lg text-white/55 leading-relaxed lg:max-w-md">
                {t("aboutSection.description")}
              </p>
            </RevealText>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-5 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/treatments/physio-18-side-lying-shoulder.jpg"
                  alt="Συνεδρία φυσικοθεραπείας στο PREVENT Therapy Space"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 25%" }}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-[#050810]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <span className="text-3xl font-bold text-primary">
                    {t("aboutSection.experience.value")}
                  </span>
                  <span className="block text-sm text-white/65 mt-1">
                    {t("aboutSection.experience.label")}
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06]"
              >
                <Image
                  src="/images/clinic/beautiful-chropractor-bed-photo.jpg"
                  alt="Treatment room"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-[#050810]/30" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06]"
              >
                <Image
                  src="/images/clinic/inner-space-and-equipment.jpg"
                  alt="Equipment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-[#050810]/30" />
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-6 space-y-4">
            {points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="group relative bg-[#070b14] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary/30 rounded-2xl p-6 lg:p-8 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {point.title}
                      </h4>
                      <p className="text-white/55 leading-relaxed text-sm">
                        {point.text}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 lg:mt-28"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-primary/70" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Google
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {t("aboutSection.reviews.title")}
              </h3>
            </div>

            <a
              href={googleReviews.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-5 py-3 rounded-full border border-white/10 bg-white/[0.02] hover:border-primary/40 transition-colors"
            >
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </span>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                <span className="font-bold text-white">{rating}</span> ·{" "}
                {googleReviews.reviewCount} {t("aboutSection.reviews.googleLabel")}
              </span>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {reviews.slice(0, 3).map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col bg-[#070b14] hover:bg-[#0a0f1a] border border-white/[0.06] hover:border-primary/30 rounded-2xl p-6 lg:p-7 transition-all"
              >
                <div
                  className="flex items-center gap-0.5 mb-4"
                  aria-label={`${review.rating} / 5`}
                >
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm text-white/65 leading-relaxed mb-5">
                  “{review.quote[lang]}”
                </blockquote>
                <figcaption className="pt-4 border-t border-white/[0.06]">
                  <span className="block text-sm font-bold text-white">
                    {review.name}
                  </span>
                  <span className="block text-xs text-white/40 mt-0.5">
                    {t("aboutSection.reviews.reviewSource")}
                  </span>
                </figcaption>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
