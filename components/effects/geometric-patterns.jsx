"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DiagonalLines({ className, color = "white", spacing = 40, strokeWidth = 1, opacity = 0.03 }) {
    return (
        <div
            className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
            style={{
                backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent ${spacing - strokeWidth}px,
          ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} ${spacing - strokeWidth}px,
          ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} ${spacing}px
        )`,
            }}
        />
    );
}

export function CrosshatchPattern({ className, opacity = 0.02 }) {
    return (
        <svg
            className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
            style={{ opacity }}
        >
            <defs>
                <pattern id="crosshatch" patternUnits="userSpaceOnUse" width="20" height="20">
                    <line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="0.5" />
                    <line x1="20" y1="0" x2="0" y2="20" stroke="white" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#crosshatch)" />
        </svg>
    );
}

export function HexagonGrid({ className, size = 60, opacity = 0.04 }) {
    const hexPath = `
    M ${size * 0.5} 0
    L ${size} ${size * 0.25}
    L ${size} ${size * 0.75}
    L ${size * 0.5} ${size}
    L 0 ${size * 0.75}
    L 0 ${size * 0.25}
    Z
  `;

    return (
        <svg
            className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
            style={{ opacity }}
        >
            <defs>
                <pattern id="hexgrid" patternUnits="userSpaceOnUse" width={size * 1.5} height={size * Math.sqrt(3)}>
                    <path d={hexPath} fill="none" stroke="currentColor" strokeWidth="1" transform="translate(0,0)" />
                    <path d={hexPath} fill="none" stroke="currentColor" strokeWidth="1" transform={`translate(${size * 0.75},${size * Math.sqrt(3) / 2})`} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexgrid)" className="text-white" />
        </svg>
    );
}

export function FloatingShapes({ className }) {
    const shapes = [
        { type: "circle", size: 200, x: "10%", y: "20%", delay: 0 },
        { type: "square", size: 150, x: "80%", y: "60%", delay: 0.5 },
        { type: "triangle", size: 120, x: "60%", y: "15%", delay: 1 },
        { type: "circle", size: 100, x: "90%", y: "80%", delay: 1.5 },
        { type: "square", size: 80, x: "15%", y: "75%", delay: 2 },
    ];

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        left: shape.x,
                        top: shape.y,
                        width: shape.size,
                        height: shape.size,
                    }}
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{
                        opacity: 0.03,
                        scale: [1, 1.1, 1],
                        rotate: [0, shape.type === "square" ? 90 : 0, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 8,
                        delay: shape.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {shape.type === "circle" && (
                        <div className="w-full h-full rounded-full border-2 border-white" />
                    )}
                    {shape.type === "square" && (
                        <div className="w-full h-full border-2 border-primary rotate-45" />
                    )}
                    {shape.type === "triangle" && (
                        <div
                            className="w-full h-full"
                            style={{
                                borderLeft: `${shape.size / 2}px solid transparent`,
                                borderRight: `${shape.size / 2}px solid transparent`,
                                borderBottom: `${shape.size}px solid transparent`,
                                borderBottomColor: "rgba(239, 68, 68, 0.3)",
                            }}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
}

export function AnimatedGridLines({ className }) {
    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            {/* Horizontal scanning line */}
            <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            {/* Vertical scanning line */}
            <motion.div
                className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
                initial={{ left: "-10%" }}
                animate={{ left: "110%" }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
}

export function CornerFrames({ className }) {
    const cornerStyle = "absolute w-8 h-8 border-primary";

    return (
        <div className={cn("absolute inset-4 pointer-events-none", className)}>
            <div className={cn(cornerStyle, "top-0 left-0 border-t-2 border-l-2")} />
            <div className={cn(cornerStyle, "top-0 right-0 border-t-2 border-r-2")} />
            <div className={cn(cornerStyle, "bottom-0 left-0 border-b-2 border-l-2")} />
            <div className={cn(cornerStyle, "bottom-0 right-0 border-b-2 border-r-2")} />
        </div>
    );
}

