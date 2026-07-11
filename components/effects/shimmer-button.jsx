"use client";

import { cn } from "@/lib/utils";

export function ShimmerButton({
  children,
  className,
  shimmerColor = "rgba(255,255,255,0.3)",
  shimmerSize = "0.1em",
  shimmerDuration = "2s",
  background = "hsl(var(--primary))",
  ...props
}) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden px-8 font-bold uppercase tracking-wider text-sm text-white transition-all duration-300",
        "hover:-translate-y-1",
        "active:translate-y-0",
        "disabled:opacity-50 disabled:hover:translate-y-0",
        className
      )}
      style={{ background }}
      {...props}
    >
      {/* Shadow layer */}
      <span className="absolute inset-0 bg-white/20 translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Corner accent on hover */}
      <div className="absolute top-0 left-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-white/50" />
        <div className="absolute top-0 left-0 h-full w-0.5 bg-white/50" />
      </div>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

export function BrutalButton({
  children,
  className,
  variant = "primary",
  size = "default",
  ...props
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "bg-transparent border border-white/15 text-white hover:border-primary hover:text-primary",
    ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "h-10 px-6 text-xs",
    default: "h-12 px-8 text-sm",
    lg: "h-14 px-10 text-sm",
  };

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300",
        "hover:-translate-y-1 active:translate-y-0",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Shadow layer for primary variant */}
      {variant === "primary" && (
        <span className="absolute inset-0 bg-white/20 translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
      )}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
