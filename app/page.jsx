"use client";

import { Hero } from "@/components/physio/Hero";
import { ServicesGrid } from "@/components/physio/ServicesGrid";
import { HowItWorks } from "@/components/physio/HowItWorks";
import { WhyChooseUs } from "@/components/physio/WhyChooseUs";
import { AboutFrenaSection } from "@/components/physio/AboutFrenaSection";
import { GallerySection } from "@/components/physio/GallerySection";
import { CtaSection } from "@/components/physio/CtaSection";
import HeadManager from "@/components/common/HeadManager";

export default function HomePage() {
  return (
    <>
      <HeadManager namespace="home" pageKey="meta" />
      <Hero />
      <ServicesGrid />
      <HowItWorks />
      <AboutFrenaSection />
      <WhyChooseUs />
      <GallerySection />
      <CtaSection />
    </>
  );
}
