"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function AnimatedGridBackground({
  className,
  children,
  gridSize = 40,
  gridColor = "rgba(255,255,255,0.03)",
  dotColor = "rgba(255,255,255,0.08)",
  showDots = true,
  animated = true,
}) {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(${gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />
      
      {/* Animated Gradient Overlay */}
      {animated && (
        <div className="absolute inset-0 z-0 opacity-30">
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.3), transparent)`,
            }}
          />
        </div>
      )}
      
      {/* Dots Pattern */}
      {showDots && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

