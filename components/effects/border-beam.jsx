"use client";

import { cn } from "@/lib/utils";

export function BorderBeam({
  className,
  size = 200,
  duration = 10,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "hsl(var(--primary))",
  colorTo = "transparent",
  delay = 0,
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 [mask-clip:padding-box,border-box] [mask-composite:intersect]",
        className
      )}
      style={{
        borderWidth: `${borderWidth}px`,
        borderStyle: "solid",
        borderColor: "transparent",
        mask: `linear-gradient(transparent, transparent), linear-gradient(white, white)`,
        WebkitMask: `linear-gradient(transparent, transparent), linear-gradient(white, white)`,
      }}
    >
      <span
        className="absolute aspect-square animate-border-beam"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${borderWidth}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo})`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}

export function AnimatedBorder({ children, className }) {
  return (
    <div className={cn("relative group", className)}>
      {/* Animated border */}
      <div className="absolute -inset-px bg-gradient-to-r from-primary via-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content container */}
      <div className="relative bg-[#050810] border border-white/10 group-hover:border-transparent transition-colors">
        {children}
      </div>
    </div>
  );
}
