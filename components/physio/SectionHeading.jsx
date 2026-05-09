"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({ label, title, subtitle, centered = true, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={cn("mb-14", centered && "text-center")}
    >
      {label && (
        <span
          className={cn(
            "block text-xs font-bold tracking-[0.2em] uppercase mb-4",
            light ? "text-white/70" : "text-primary"
          )}
        >
          {label}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold mb-3 tracking-tight",
          light ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-lg max-w-2xl font-light leading-relaxed",
            centered && "mx-auto",
            light ? "text-white/70" : "text-on-surface-variant"
          )}
        >
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "mt-4 h-1 w-16 rounded-full bg-primary",
          centered && "mx-auto"
        )}
      />
    </motion.div>
  );
}
