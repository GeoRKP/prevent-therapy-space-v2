"use client";

import { RevealText } from "@/components/effects/kinetic-text";
import { cn } from "@/lib/utils";

export function SectionHeading({ label, title, subtitle, centered = true }) {
  return (
    <div className={cn("mb-20", centered ? "text-center" : "")}>
      {label && (
        <RevealText>
          <div
            className={cn(
              "inline-flex items-center gap-4 mb-6",
              centered ? "" : ""
            )}
          >
            <div className="w-8 h-px bg-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              {label}
            </span>
            {centered && <div className="w-8 h-px bg-primary" />}
          </div>
        </RevealText>
      )}

      <RevealText delay={0.1}>
        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-[0.95] tracking-tight text-white mb-6">
          {title}
        </h2>
      </RevealText>

      {subtitle && (
        <RevealText delay={0.2}>
          <p
            className={cn(
              "text-lg text-white/50 max-w-2xl leading-relaxed",
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
