"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Star, ArrowUpRight } from "lucide-react";
import { reviews, googleReviews } from "@/data/reviews";
import { SectionHeading } from "./SectionHeading";

// asPageIntro: στη σελίδα «Σχετικά» ο PageHero λέει ήδη «Στόχος μας…» —
// η ενότητα ξεκινά κατευθείαν από το περιεχόμενο, χωρίς δικό της τίτλο.
export function AboutFrenaSection({ asPageIntro = false }) {
  const { t, ready, i18n } = useTranslation("home");
  if (!ready) return null;

  const lang = i18n.language === "en" ? "en" : "el";
  const rating =
    lang === "el" ? googleReviews.ratingValue.replace(".", ",") : googleReviews.ratingValue;
  const points = t("aboutSection.points", { returnObjects: true }) || [];

  return (
    <section className="relative section-pad bg-[#050810]">
      <div className="container">
        {!asPageIntro && (
          <SectionHeading
            title={`${t("aboutSection.title")} ${t("aboutSection.subtitle")}`}
            subtitle={t("aboutSection.description")}
          />
        )}

        <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10 items-start">
          <figure className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden">
              <Image
                src="/images/treatments/physio-18-side-lying-shoulder.jpg"
                alt="Συνεδρία φυσικοθεραπείας στο PREVENT Therapy Space"
                fill
                className="object-cover"
                style={{ objectPosition: "center 25%" }}
                sizes="(max-width: 991px) 100vw, 40vw"
              />
            </div>
          </figure>

          <ul className="lg:col-span-6 lg:col-start-7 lg:pt-2">
            {points.map((point) => (
              <li key={point.title} className="py-7 first:pt-0 border-b border-white/12 last:border-b-0">
                <h3 className="t-h3 text-white">{point.title}</h3>
                <p className="t-body text-white/68 mt-2.5 max-w-[46ch]">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Κριτικές Google — πραγματικές, με παραπομπή στην καταχώρηση */}
        <div className="mt-24 lg:mt-32">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5 mb-10 lg:mb-12">
            <h2 className="t-h2 text-white">{t("aboutSection.reviews.title")}</h2>
            <a
              href={googleReviews.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-white/75 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Star key={j} className="w-4 h-4 fill-primary-soft text-primary-soft" />
                ))}
              </span>
              <span>
                <span className="font-semibold text-white tabular-nums">{rating}</span>
                {" · "}
                {googleReviews.reviewCount} {t("aboutSection.reviews.googleLabel")}
              </span>
              <ArrowUpRight className="w-4 h-4 text-white/45 group-hover:text-primary-soft transition-colors" />
            </a>
          </div>

          {/* Στο κινητό οι κριτικές είναι οριζόντιο carousel (snap) αντί για στοίβα */}
          <div className="grid md:grid-cols-3 gap-x-10 max-md:flex max-md:gap-6 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:-mx-4 max-md:px-4 max-md:scroll-px-4 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
            {reviews.slice(0, 3).map((review) => (
              <figure
                key={review.name}
                className="flex flex-col pt-7 border-t border-primary-soft/40 max-md:w-[84%] max-md:shrink-0 max-md:snap-start"
              >
                <blockquote className="flex-1 font-display italic text-[1.1875rem] leading-[1.55] text-white/88">
                  {lang === "el" ? `«${review.quote.el}»` : `“${review.quote.en}”`}
                </blockquote>
                <figcaption className="mt-6 t-small">
                  <span className="block font-semibold text-white">{review.name}</span>
                  <span className="block text-white/50">{t("aboutSection.reviews.reviewSource")}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
