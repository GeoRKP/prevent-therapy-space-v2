"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextReveal({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TextRevealByWord({ text, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");

  return (
    <div ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{
            duration: 0.5,
            delay: i * 0.04,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

export function GradientText({ children, className }) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-primary via-red-400 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[text-gradient_3s_linear_infinite]",
        className
      )}
    >
      {children}
    </span>
  );
}

export function TypewriterText({ text, className, speed = 50 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const chars = text.split("");

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.1,
            delay: i * (speed / 1000),
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function HighlightText({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute bottom-0 left-0 h-[30%] bg-primary/30 -z-0"
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
      />
    </span>
  );
}
