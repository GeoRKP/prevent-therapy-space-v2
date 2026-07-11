"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Generate deterministic positions based on index to avoid hydration mismatch
function generateMeteorStyle(index) {
  // Use a simple seeded approach for consistent values
  const seed1 = ((index * 17) % 100);
  const seed2 = ((index * 31 + 7) % 100);
  const seed3 = ((index * 13 + 3) % 10) / 10;
  const seed4 = ((index * 23 + 5) % 8) + 2;

  return {
    top: `${seed1}%`,
    left: `${seed2}%`,
    animationDelay: `${seed3}s`,
    animationDuration: `${seed4}s`,
  };
}

export function Meteors({ number = 20, className }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const meteors = new Array(number).fill(true);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteors.map((_, idx) => (
        <span
          key={idx}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]"
          style={generateMeteorStyle(idx)}
        >
          <span className="absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </div>
  );
}
