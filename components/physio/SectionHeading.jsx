"use client";

import { RevealText } from "@/components/effects/kinetic-text";
import { cn } from "@/lib/utils";

export function SectionHeading({ id, label, title, subtitle, centered = true }) {
  return (
    <div className={cn("mb-16", centered ? "text-center" : "max-w-2xl")}>
      {label && (
        <RevealText>
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary-soft/70" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              {label}
            </span>
            {centered && <div className="w-8 h-px bg-primary-soft/70" />}
          </div>
        </RevealText>
      )}

      <RevealText delay={0.1}>
        <h2
          id={id}
          className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white mb-5"
        >
          {title}
        </h2>
      </RevealText>

      {subtitle && (
        <RevealText delay={0.2}>
          <p
            className={cn(
              "text-base lg:text-lg text-white/55 max-w-2xl leading-relaxed",
              centered ? "mx-auto" : ""
            )}
          >
            {subtitle}
          </p>
        </RevealText>
      )}
    </div>
  );
}
