"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlowCard({ children, className, glowColor = "primary", hover = true }) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const glowColors = {
    primary: "hsl(var(--primary))",
    accent: "hsl(var(--accent))",
    white: "rgba(255, 255, 255, 0.5)",
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "relative overflow-hidden border border-white/10 bg-white/[0.02]",
        "transition-colors duration-300 hover:border-white/20",
        className
      )}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColors[glowColor]}10, transparent 40%)`,
        }}
      />

      {/* Border glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${glowColors[glowColor]}20, transparent 40%)`,
          mask: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {/* Corner accent on hover */}
      <div
        className="absolute top-0 left-0 w-6 h-6 transition-opacity duration-300"
        style={{ opacity: opacity * 0.8 }}
      >
        <div className="absolute top-0 left-0 w-full h-0.5 bg-primary" />
        <div className="absolute top-0 left-0 h-full w-0.5 bg-primary" />
      </div>

      {children}
    </motion.div>
  );
}
