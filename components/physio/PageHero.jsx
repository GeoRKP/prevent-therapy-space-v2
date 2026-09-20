"use client";

import { RevealText } from "@/components/effects/kinetic-text";

export function PageHero({ label, title, subtitle, backgroundImage }) {
  return (
    <section className="relative overflow-hidden bg-canvas pt-32 pb-16 lg:pt-40 lg:pb-24">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/70 via-canvas/85 to-canvas" />

      <div className="container relative z-10">
        <div className="max-w-4xl">
          <RevealText>
            <div className="inline-flex items-center gap-3 mb-7">
              <div className="w-10 h-px bg-brand/70" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-60">
                {label}
              </span>
            </div>
          </RevealText>

          <RevealText delay={0.1}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-ink mb-5">
              {title}
            </h1>
          </RevealText>

          {subtitle && (
            <RevealText delay={0.2}>
              <p className="text-base lg:text-lg text-ink-55 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            </RevealText>
          )}
        </div>
      </div>
    </section>
  );
}
