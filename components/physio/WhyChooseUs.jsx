"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Hand, Target, HeartHandshake } from "lucide-react";

const featureIcons = [Hand, Target, HeartHandshake];

export function WhyChooseUs() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  const features = t("whyChooseUs.features", { returnObjects: true }) || [];

  return (
    <section className="relative section-pad bg-[#050810]">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
          <div className="lg:col-span-6">
            <h2 className="t-h2 text-white">
              {t("whyChooseUs.title")} {t("whyChooseUs.titleHighlight")}
            </h2>
            <p className="t-lead text-white/68 mt-5 max-w-[34rem]">
              {t("whyChooseUs.description")}
            </p>

            <ul className="mt-10 border-t border-white/12">
              {features.map((feature, index) => {
                const Icon = featureIcons[index] || Hand;
                return (
                  <li
                    key={feature.title}
                    className="grid grid-cols-[1.5rem_1fr] gap-x-4 py-6 border-b border-white/12"
                  >
                    <Icon className="w-5 h-5 mt-1 text-primary-soft" aria-hidden="true" />
                    <div>
                      <h3 className="t-h4 text-white">{feature.title}</h3>
                      <p className="t-small text-white/65 mt-1.5">{feature.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Φωτογραφία μόνο στο desktop — στο κινητό η προηγούμενη ενότητα έχει ήδη φωτογραφία */}
          <div className="lg:col-span-5 lg:col-start-8 max-lg:hidden">
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden">
              <Image
                src="/images/treatments/physio-12-thoracic-stretch.jpg"
                alt="Θεραπευτική τεχνική στο PREVENT Therapy Space"
                fill
                className="object-cover"
                style={{ objectPosition: "center 30%" }}
                sizes="40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
