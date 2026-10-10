"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { googleReviews } from "@/data/reviews";
import { contactInfo } from "@/data/conditions";

const EASE = [0.22, 1, 0.36, 1];

// Desktop: η φωτογραφία πιάνει όλο το δεξί μισό του hero, από άκρη σε άκρη,
// καθαρή (χωρίς blur/σκίαση) — τα πραγματικά πρόσωπα είναι το πιο δυνατό υλικό.
// Κινητό: καθαρή κάρτα 4:3 πάνω από τον τίτλο (εγκεκριμένο από τον πελάτη).
const SLIDES = [
  {
    image: "/images/team/konstantinos-patsakis-posing-photo.jpg",
    position: "center 20%",
    mobilePosition: "center 18%",
  },
  {
    image: "/images/treatments/physio-19-side-lying-shoulder.jpg",
    position: "center 35%",
    mobilePosition: "center 35%",
  },
  {
    image: "/images/treatments/physio-10-leg-raise-ankle.jpg",
    position: "center 30%",
    mobilePosition: "center 40%",
  },
];

export function Hero() {
  const { t, ready, i18n } = useTranslation(["home", "common"]);
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % SLIDES.length), 7000);
    return () => clearInterval(id);
  }, [autoPlay]);

  const goTo = useCallback((i) => {
    setCurrent(i);
    setAutoPlay(false);
  }, []);

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo((current + (diff > 0 ? 1 : SLIDES.length - 1)) % SLIDES.length);
    }
    setTouchStart(null);
  };

  if (!ready) {
    return <section className="min-h-[92svh] bg-[#050810]" aria-hidden="true" />;
  }

  const lang = i18n.language === "en" ? "en" : "el";
  const rating =
    lang === "el" ? googleReviews.ratingValue.replace(".", ",") : googleReviews.ratingValue;
  const slide = {
    ...SLIDES[current],
    title: t(`home:hero.slides.${current}.title`),
    highlight: t(`home:hero.slides.${current}.highlight`, { defaultValue: "" }),
    subtitle: t(`home:hero.slides.${current}.subtitle`),
  };
  const headline = [slide.title, slide.highlight].filter(Boolean).join(" ");

  const indicators = (
    <div className="flex items-center gap-4">
      {SLIDES.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => goTo(i)}
          aria-label={`${t("home:hero.slideLabel")} ${i + 1} / ${SLIDES.length}`}
          aria-current={i === current}
          className="group flex items-center gap-2.5 py-2"
        >
          <span
            className={cn(
              "t-caption tabular-nums transition-colors",
              i === current ? "text-white" : "text-white/45 group-hover:text-white/75"
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="relative h-px w-10 overflow-hidden bg-white/25">
            {i === current && (
              <motion.span
                key={`${current}-${autoPlay}`}
                className="absolute inset-y-0 left-0 bg-primary-soft"
                initial={{ width: autoPlay ? "0%" : "100%" }}
                animate={{ width: "100%" }}
                transition={{ duration: autoPlay ? 7 : 0, ease: "linear" }}
              />
            )}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <section
      className="relative bg-[#050810] overflow-hidden"
      onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      {/* Desktop: φωτογραφία στο δεξί μισό, από το πάνω μέχρι το κάτω άκρο
          (992–1279px: ξεκινά κάτω από το header, όπου το μενού δεν χωράει δίπλα της) */}
      <div className="absolute bottom-0 right-0 top-20 xl:top-0 w-[42%] max-lg:hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <Image
              src={slide.image}
              alt={headline}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: slide.position }}
              sizes="42vw"
              quality={85}
            />
          </motion.div>
        </AnimatePresence>
        {/* Μόνο για να διαβάζονται το header (πάνω) και οι δείκτες (κάτω) */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
          {indicators}
        </div>
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-12 lg:min-h-[max(640px,100svh)] lg:items-center pt-24 pb-12 lg:pt-32 lg:pb-24">
          <motion.div
            className="lg:col-span-6 lg:pr-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
          >
            {/* Κινητό: καθαρή κάρτα 4:3 πάνω από τον τίτλο */}
            <div className="lg:hidden relative aspect-[4/3] mb-8 rounded-[20px] overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.div
                  key={current}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <Image
                    src={slide.image}
                    alt={headline}
                    fill
                    priority
                    className="object-cover"
                    style={{ objectPosition: slide.mobilePosition }}
                    sizes="100vw"
                    quality={85}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <h1 className="t-display text-white max-w-[16ch]">{headline}</h1>
                <p className="t-lead text-white/72 max-w-[34rem] mt-6">{slide.subtitle}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-3 mt-10 max-lg:mt-8">
              <Link
                href="/booking"
                className="group inline-flex items-center gap-2.5 h-13 px-7 rounded-full bg-primary-soft text-primary-soft-foreground font-semibold hover:bg-[#a3dec4] transition-colors"
              >
                {t("home:hero.ctaPrimary")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:+30${contactInfo.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 h-13 px-6 rounded-full border border-white/20 text-white font-medium hover:border-white/45 transition-colors"
              >
                <Phone className="w-4 h-4 text-primary-soft" />
                {contactInfo.phone}
              </a>
            </div>

            {/* Στοιχεία εμπιστοσύνης — πραγματικά δεδομένα, όχι διακοσμητικά badges */}
            <dl
              className="mt-14 max-lg:mt-10 pt-6 border-t border-white/12 grid grid-cols-3 gap-6 max-sm:gap-4 max-sm:text-[0.9375rem] max-w-[34rem]"
            >
              <div>
                <dt className="sr-only">Google</dt>
                <dd>
                  <a
                    href={googleReviews.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <span className="flex items-center gap-1.5 text-white">
                      <Star className="w-4 h-4 fill-primary-soft text-primary-soft" aria-hidden="true" />
                      <span className="font-semibold tabular-nums">{rating}</span>
                    </span>
                    <span className="t-small text-white/60 group-hover:text-white/85 transition-colors">
                      {googleReviews.reviewCount} {t("home:hero.reviews")}
                    </span>
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t("common:navigation.contact")}</dt>
                <dd>
                  <span className="block text-white font-semibold">
                    {lang === "el" ? "Πατήσια" : "Patisia"}
                  </span>
                  <span className="t-small text-white/60">
                    {contactInfo.address[lang].split(",")[0]}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">PREVENT</dt>
                <dd>
                  <span className="block text-white font-semibold">{t("home:hero.since")}</span>
                  <span className="t-small text-white/60">
                    {t("home:aboutSection.experience.value")}{" "}
                    {t("home:aboutSection.experience.label").toLocaleLowerCase(lang)}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="lg:hidden mt-10 flex justify-start">{indicators}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
