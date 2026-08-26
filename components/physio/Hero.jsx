"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { DiagonalLines } from "@/components/effects/geometric-patterns";
import { RevealText, MarqueeText } from "@/components/effects/kinetic-text";

export function Hero() {
  const { t, ready } = useTranslation(["home", "common"]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);

  // Portrait φωτογραφίες σε κάρτα 2:3 — το position κρατά τα πρόσωπα στο κάδρο
  // όταν το aspect της φωτογραφίας (0.56) είναι στενότερο από την κάρτα (0.667).
  const heroSlides = [
    {
      image: "/images/team/konstantinos-patsakis-posing-photo.jpg",
      position: "center",
      title: t("home:hero.slides.0.title"),
      highlight: t("home:hero.slides.0.highlight"),
      subtitle: t("home:hero.slides.0.subtitle"),
      link: "/booking",
    },
    {
      image: "/images/treatments/physio-19-side-lying-shoulder.jpg",
      position: "center 30%",
      title: t("home:hero.slides.1.title"),
      highlight: t("home:hero.slides.1.highlight"),
      subtitle: t("home:hero.slides.1.subtitle"),
      link: "/services",
    },
    {
      image: "/images/treatments/physio-10-leg-raise-ankle.jpg",
      position: "center 25%",
      title: t("home:hero.slides.2.title"),
      highlight: t("home:hero.slides.2.highlight"),
      subtitle: t("home:hero.slides.2.subtitle"),
      link: "/services",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  }, []);

  const nextSlide = () => goToSlide((currentSlide + 1) % heroSlides.length);
  const prevSlide = () =>
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? nextSlide : prevSlide)();
    setTouchStart(null);
  };

  if (!ready) {
    return (
      <section className="relative min-h-[92svh] bg-[#050810] flex items-center">
        <div className="container">
          <div className="max-w-4xl">
            <div className="w-32 h-6 bg-white/5 rounded mb-8" />
            <div className="space-y-4 mb-8">
              <div className="w-full h-16 bg-white/5 rounded" />
              <div className="w-3/4 h-16 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[92svh] bg-[#050810] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient background — έντονα blurred εκδοχή της φωτογραφίας του slide,
          δίνει ατμόσφαιρα χωρίς να φαίνεται κομμένη ή θολή η ίδια η φωτογραφία */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <Image
            src={heroSlides[currentSlide].image}
            alt=""
            fill
            priority
            className="object-cover scale-110 blur-2xl opacity-35"
            sizes="100vw"
            quality={40}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-[#050810]/70 to-[#050810]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/40" />

      <DiagonalLines className="opacity-[0.012]" spacing={100} />

      <div className="container relative z-20 min-h-[92svh] flex items-center pt-24 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RevealText delay={0.1}>
                  <div className="inline-flex items-center gap-3 mb-7">
                    <div className="w-10 h-px bg-primary-soft" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                      {t("home:hero.label")}
                    </span>
                  </div>
                </RevealText>

                <div className="mb-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1] tracking-tight">
                    <RevealText delay={0.2}>
                      <span className="block text-white">
                        {heroSlides[currentSlide].title}
                      </span>
                    </RevealText>
                    <RevealText delay={0.3}>
                      <span className="block mt-2">
                        <span className="relative inline-block text-primary-soft">
                          {heroSlides[currentSlide].highlight}
                        </span>
                      </span>
                    </RevealText>
                  </h1>
                </div>

                <RevealText delay={0.4}>
                  <p className="text-lg lg:text-xl text-white/60 max-w-xl mb-10 leading-relaxed font-light">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                </RevealText>

                <RevealText delay={0.5}>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={heroSlides[currentSlide].link}
                      className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary-soft text-primary-soft-foreground font-semibold text-sm rounded-full hover:bg-primary-soft/90 transition-all hover:gap-3"
                    >
                      {t("home:hero.ctaPrimary")}
                      <ArrowRight className="w-4 h-4 transition-transform" />
                    </Link>

                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-2.5 px-7 py-3.5 border border-white/20 text-white/90 font-semibold text-sm rounded-full hover:border-primary-soft/60 hover:text-primary-soft hover:bg-white/[0.02] transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      {t("common:actions.contactUs")}
                    </Link>
                  </div>
                </RevealText>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5">
            <div className="relative w-full max-w-sm mx-auto lg:max-w-[360px] xl:max-w-[400px] lg:ml-auto lg:mr-0">
              {/* Διακοσμητικές γωνίες */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-primary-soft/30 rounded-tl-3xl" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-primary-soft/30 rounded-br-3xl" />

              {/* Κάρτα: 3:2 στο κινητό (χαμηλή, δεν μακραίνει τη σελίδα),
                  2:3 σε desktop — ίδιο aspect με τις portrait φωτογραφίες */}
              <div className="relative aspect-[3/2] lg:aspect-[2/3]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    className="absolute inset-0 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/40"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={heroSlides[currentSlide].image}
                      alt={heroSlides[currentSlide].title}
                      fill
                      priority
                      className="object-cover"
                      style={{ objectPosition: heroSlides[currentSlide].position }}
                      sizes="(min-width: 1280px) 400px, (min-width: 1024px) 360px, 100vw"
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/35 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress indicators — μόνο desktop· στο κινητό υπάρχουν ήδη στη μπάρα κάτω */}
              <div className="mt-7 hidden lg:flex items-center justify-end gap-5">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "group flex items-center gap-3 transition-all duration-300",
                      index === currentSlide
                        ? "opacity-100"
                        : "opacity-40 hover:opacity-70"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-mono transition-colors",
                        index === currentSlide ? "text-primary-soft" : "text-white/50"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="relative w-12 h-0.5 bg-white/15 overflow-hidden rounded-full">
                      {index === currentSlide && (
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-primary-soft rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 7, ease: "linear" }}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom marquee — softer */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="border-t border-white/[0.06] py-3 bg-[#050810]/85 backdrop-blur-sm overflow-hidden">
          <MarqueeText
            text={t("home:hero.marquee")}
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/25"
            speed={35}
          />
        </div>

        <div className="lg:hidden border-t border-white/[0.06] py-4 bg-[#050810]/90 backdrop-blur-sm">
          <div className="container flex items-center justify-between">
            <div className="flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-1 transition-all duration-300 rounded-full",
                    index === currentSlide
                      ? "w-8 bg-primary-soft"
                      : "w-4 bg-white/15"
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-white/55">
              {String(currentSlide + 1).padStart(2, "0")} /{" "}
              {String(heroSlides.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
