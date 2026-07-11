"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

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
