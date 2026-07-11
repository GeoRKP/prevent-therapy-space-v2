"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function SplitText({ text, className, delay = 0, stagger = 0.02 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    const chars = text.split("");

    return (
        <motion.span
            ref={ref}
            initial="hidden"
            animate={controls}
            className={cn("inline-flex flex-wrap", className)}
        >
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    variants={{
                        hidden: {
                            opacity: 0,
                            y: 50,
                            rotateX: -90,
                        },
                        visible: {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                        },
                    }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * stagger,
                        ease: [0.215, 0.61, 0.355, 1],
                    }}
                    style={{ display: "inline-block", transformOrigin: "bottom" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
}

export function RevealText({ children, className, delay = 0, direction = "up" }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const directionVariants = {
        up: { hidden: { y: "100%" }, visible: { y: 0 } },
        down: { hidden: { y: "-100%" }, visible: { y: 0 } },
        left: { hidden: { x: "100%" }, visible: { x: 0 } },
        right: { hidden: { x: "-100%" }, visible: { x: 0 } },
    };

    return (
        <div ref={ref} className={cn("overflow-hidden", className)}>
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={directionVariants[direction]}
                transition={{
                    duration: 0.8,
                    delay,
                    ease: [0.215, 0.61, 0.355, 1],
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}

export function GlitchText({ text, className }) {
    return (
        <span className={cn("relative inline-block group", className)}>
            {/* Main text */}
            <span className="relative z-10">{text}</span>

            {/* Glitch layers - only on hover */}
            <span
                className="absolute inset-0 text-cyan-400 opacity-0 group-hover:opacity-70 transition-opacity duration-100"
                style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                    transform: "translateX(-2px)",
                }}
                aria-hidden="true"
            >
                {text}
            </span>
            <span
                className="absolute inset-0 text-primary opacity-0 group-hover:opacity-70 transition-opacity duration-100"
                style={{
                    clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
                    transform: "translateX(2px)",
                }}
                aria-hidden="true"
            >
                {text}
            </span>
        </span>
    );
}

export function MarqueeText({ text, className, speed = 20, pauseOnHover = true }) {
    return (
        <div className={cn("overflow-hidden whitespace-nowrap", className)}>
            <motion.div
                className={cn(
                    "inline-flex gap-8",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
                animate={{ x: [0, "-50%"] }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {[...Array(4)].map((_, i) => (
                    <span key={i} className="flex-shrink-0">
                        {text}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

export function CountUpNumber({ value, suffix = "", className, duration = 2 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const controls = useAnimation();

    const numericValue = parseInt(value.replace(/\D/g, ""), 10);

    useEffect(() => {
        if (isInView) {
            controls.start({
                count: numericValue,
                transition: { duration, ease: "easeOut" },
            });
        }
    }, [isInView, numericValue, controls, duration]);

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ count: 0 }}
            animate={controls}
        >
            {({ count }) => (
                <>
                    {Math.round(count)}
                    {suffix}
                </>
            )}
        </motion.span>
    );
}

export function ParallaxText({ children, className, baseVelocity = 5 }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, baseVelocity * 100]);

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
}

export function StaggerWords({ text, className, delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const words = text.split(" ");

    return (
        <span ref={ref} className={cn("inline-flex flex-wrap gap-x-2", className)}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={isInView ? {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)"
                    } : {}}
                    transition={{
                        duration: 0.6,
                        delay: delay + i * 0.08,
                        ease: [0.215, 0.61, 0.355, 1],
                    }}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}

