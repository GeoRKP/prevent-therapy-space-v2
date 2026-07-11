"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function BackgroundBeams({ className }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Primary beam */}
      <div
        className="absolute h-[800px] w-[400px] opacity-30 blur-[100px]"
        style={{
          background: `linear-gradient(180deg, hsl(var(--primary)) 0%, transparent 100%)`,
          left: `${mousePosition.x - 200}px`,
          top: `${mousePosition.y - 400}px`,
          transform: "rotate(-45deg)",
          transition: "left 0.3s ease-out, top 0.3s ease-out",
        }}
      />
      
      {/* Secondary beam */}
      <div
        className="absolute h-[600px] w-[300px] opacity-20 blur-[80px]"
        style={{
          background: `linear-gradient(180deg, hsl(var(--accent)) 0%, transparent 100%)`,
          left: `${mousePosition.x - 150}px`,
          top: `${mousePosition.y - 300}px`,
          transform: "rotate(45deg)",
          transition: "left 0.4s ease-out, top 0.4s ease-out",
        }}
      />
      
      {/* Static ambient beams */}
      <div className="absolute -top-[40%] left-[20%] h-[600px] w-[400px] rotate-12 bg-gradient-to-b from-primary/20 to-transparent opacity-30 blur-[100px]" />
      <div className="absolute -bottom-[30%] right-[10%] h-[500px] w-[300px] -rotate-12 bg-gradient-to-t from-accent/20 to-transparent opacity-25 blur-[80px]" />
    </div>
  );
}

export function BackgroundGradient({ className, children, containerClassName }) {
  return (
    <div className={cn("relative group", containerClassName)}>
      <div
        className={cn(
          "absolute -inset-px rounded-[inherit] bg-gradient-to-r from-primary via-accent to-primary opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70",
          className
        )}
      />
      <div
        className={cn(
          "absolute -inset-px rounded-[inherit] bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          className
        )}
      />
      {children}
    </div>
  );
}

