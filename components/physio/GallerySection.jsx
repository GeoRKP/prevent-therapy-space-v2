"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { RevealText } from "@/components/effects/kinetic-text";

// Masonry με φυσικά aspect ratios — οι φωτογραφίες εμφανίζονται ολόκληρες, χωρίς κόψιμο.
const galleryItems = [
  { src: "/images/treatments/physio-04-back-mobilization.jpg", altKey: "treatment1", width: 499, height: 1080 },
  { src: "/images/clinic/beautifull-waiting-area-photo.jpg", altKey: "waitingArea", width: 800, height: 533 },
  { src: "/images/treatments/physio-20-seated-neck-shoulder.jpg", altKey: "treatment2", width: 607, height: 1080 },
  { src: "/images/clinic/equipment-photo.jpg", altKey: "equipment", width: 533, height: 800 },
  { src: "/images/treatments/physio-01-lumbar-massage.jpg", altKey: "treatment3", width: 499, height: 1080 },
  { src: "/images/team/konstantinos-patsakis-on-his-office-photo.jpg", altKey: "office", width: 800, height: 574 },
  { src: "/images/treatments/physio-13-wrist-hand-treatment.jpg", altKey: "treatment4", width: 607, height: 1080 },
  { src: "/images/clinic/beautifull-inner-photo-of-clinic.jpg", altKey: "clinicInterior", width: 800, height: 533 },
];

export function GallerySection() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  return (
    <section className="relative py-28 lg:py-36 overflow-hidden bg-surface-0">
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <RevealText>
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-primary/70" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t("gallery.label")}
              </span>
              <div className="w-8 h-px bg-primary/70" />
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white mb-5">
              {t("gallery.title")}
            </h2>
          </RevealText>

          <RevealText delay={0.2}>
            <p className="text-base lg:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
              {t("gallery.subtitle")}
            </p>
          </RevealText>
        </div>

        <div className="columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto [column-fill:balance]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
              className="group relative mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-white/[0.06]"
            >
              <Image
                src={item.src}
                alt={t(`gallery.alts.${item.altKey}`)}
                width={item.width}
                height={item.height}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-surface-0/25 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
