"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Check, ArrowRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

// Μία πραγματική φωτογραφία ανά υπηρεσία (ίδια σειρά με services:services).
const PHOTOS = [
  { src: "/images/treatments/physio-11-foot-ankle-treatment.jpg", position: "center 40%" },
  { src: "/images/treatments/physio-21-cervical-supine.jpg", position: "35% center" },
  { src: "/images/clinic/inner-space-and-equipment.jpg", position: "30% center" },
  { src: "/images/team/konstantinos-patsakis-on-his-office-photo.jpg", position: "70% center" },
];

// asPageIntro: στη σελίδα /services η ενότητα μπαίνει κάτω από τον PageHero
// (που έχει ήδη τον τίτλο) και δείχνει κάθε υπηρεσία αναλυτικά, σε σειρές.
// Στην αρχική: τέσσερις στήλες με φωτογραφία, τίτλο και μία πρόταση.
export function ServicesGrid({ asPageIntro = false }) {
  const { t, ready } = useTranslation("services");
  if (!ready) return null;

  const services = t("services:services", { returnObjects: true }) || [];

  if (asPageIntro) {
    return (
      <section className="relative section-pad bg-[#050810]">
        <div className="container space-y-20 lg:space-y-28">
          {services.map((service, index) => {
            const photo = PHOTOS[index] || PHOTOS[0];
            const flip = index % 2 === 1;
            return (
              <article
                key={service.title}
                className="grid lg:grid-cols-12 gap-x-12 gap-y-8 items-center"
              >
                <div
                  className={
                    "lg:col-span-6 relative aspect-[5/4] rounded-[20px] overflow-hidden" +
                    (flip ? " lg:order-2 lg:col-start-7" : "")
                  }
                >
                  <Image
                    src={photo.src}
                    alt={service.title}
                    fill
                    className="object-cover"
                    style={{ objectPosition: photo.position }}
                    sizes="(max-width: 991px) 100vw, 50vw"
                  />
                </div>
                <div className={"lg:col-span-5" + (flip ? " lg:order-1" : " lg:col-start-8")}>
                  <h2 className="t-h2 text-white">{service.title}</h2>
                  <p className="t-lead text-white/70 mt-5">{service.description}</p>
                  {service.features?.length > 0 && (
                    <ul className="mt-8 border-t border-white/12">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3.5 py-3.5 border-b border-white/12 text-white/80"
                        >
                          <Check className="w-4 h-4 mt-1.5 shrink-0 text-primary-soft" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}

        </div>
      </section>
    );
  }

  return (
    <section className="relative section-pad bg-[#050810]">
      <div className="container">
        <SectionHeading title={t("services:title")} subtitle={t("services:subtitle")} />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 max-sm:gap-y-0">
          {services.map((service, index) => {
            const photo = PHOTOS[index] || PHOTOS[0];
            return (
              <li
                key={service.title}
                className="max-sm:flex max-sm:items-start max-sm:gap-4 max-sm:py-5 max-sm:border-b max-sm:border-white/12 max-sm:first:border-t"
              >
                <div className="relative aspect-[4/5] rounded-[18px] overflow-hidden max-sm:w-24 max-sm:shrink-0 max-sm:aspect-square max-sm:rounded-xl">
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    className="object-cover"
                    style={{ objectPosition: photo.position }}
                    sizes="(max-width: 575px) 96px, (max-width: 991px) 50vw, 25vw"
                  />
                </div>
                <div className="sm:mt-5">
                  <h3 className="t-h3 text-white">{service.title}</h3>
                  <p className="t-small text-white/65 mt-2 max-w-[32ch] max-sm:mt-1">
                    {service.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 lg:mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-semibold text-primary-soft hover:text-[#a3dec4] transition-colors"
          >
            {t("services:viewAllServices")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
