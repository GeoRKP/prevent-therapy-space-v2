"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

// Masonry με φυσικά aspect ratios — οι φωτογραφίες εμφανίζονται ολόκληρες,
// καθαρές, χωρίς σκίαση από πάνω.
const galleryItems = [
  { src: "/images/treatments/physio-04-back-mobilization.jpg", altKey: "treatment1", width: 499, height: 1080 },
  { src: "/images/clinic/beautifull-waiting-area-photo.jpg", altKey: "waitingArea", width: 800, height: 533 },
  { src: "/images/treatments/physio-20-seated-neck-shoulder.jpg", altKey: "treatment2", width: 607, height: 1080 },
  { src: "/images/clinic/equipment-photo.jpg", altKey: "equipment", width: 533, height: 800 },
  { src: "/images/treatments/physio-15-supine-treatment.jpg", altKey: "treatment5", width: 607, height: 1080 },
  { src: "/images/treatments/physio-13-wrist-hand-treatment.jpg", altKey: "treatment4", width: 607, height: 1080 },
  { src: "/images/clinic/beautifull-inner-photo-of-clinic.jpg", altKey: "clinicInterior", width: 800, height: 533 },
];

export function GallerySection() {
  const { t, ready } = useTranslation("home");
  if (!ready) return null;

  return (
    <section className="relative section-pad bg-[#070b14] m-section-alt">
      <div className="container">
        <SectionHeading title={t("gallery.title")} subtitle={t("gallery.subtitle")} />

        <div className="columns-2 lg:columns-3 gap-4 lg:gap-5 [column-fill:balance]">
          {galleryItems.map((item, i) => (
            <figure
              key={item.src}
              className={cn(
                "mb-4 lg:mb-5 break-inside-avoid rounded-[18px] overflow-hidden",
                i >= 6 && "max-lg:hidden" // στο κινητό 6 φωτογραφίες αρκούν
              )}
            >
              <Image
                src={item.src}
                alt={t(`gallery.alts.${item.altKey}`)}
                width={item.width}
                height={item.height}
                className="w-full h-auto"
                sizes="(max-width: 991px) 50vw, 33vw"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
