"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BrutalCard({
    children,
    className,
    variant = "default",
    hover = true,
    offset = 4,
}) {
    const variants = {
        default: {
            bg: "bg-[#0c1222]",
            border: "border-white/10",
            shadow: "shadow-[4px_4px_0px_0px_hsl(var(--primary))]",
            shadowHover: "hover:shadow-[8px_8px_0px_0px_hsl(var(--primary))]",
        },
        outline: {
            bg: "bg-transparent",
            border: "border-white/20",
            shadow: "shadow-none",
            shadowHover: "hover:border-primary",
        },
        solid: {
            bg: "bg-primary",
            border: "border-primary",
            shadow: "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]",
            shadowHover: "hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]",
        },
        glass: {
            bg: "bg-white/[0.02] backdrop-blur-xl",
            border: "border-white/10",
            shadow: "shadow-none",
            shadowHover: "hover:bg-white/[0.05]",
        },
    };

    const v = variants[variant];

    return (
        <motion.div
            whileHover={hover ? {
                x: -offset / 2,
                y: -offset / 2,
                transition: { duration: 0.2 }
            } : {}}
            className={cn(
                "relative border-2 transition-all duration-300",
                v.bg,
                v.border,
                v.shadow,
                hover && v.shadowHover,
                className
            )}
        >
            {children}
        </motion.div>
    );
}

export function GlitchCard({ children, className }) {
    return (
        <div className={cn("relative group", className)}>
            {/* Glitch layers */}
            <div className="absolute inset-0 bg-primary/20 translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="absolute inset-0 bg-cyan-500/20 -translate-x-1 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Main card */}
            <div className="relative bg-[#0c1222] border border-white/10">
                {children}
            </div>
        </div>
    );
}

export function ClipCard({ children, className, clipSize = 20 }) {
    return (
        <div
            className={cn(
                "relative bg-[#0c1222] border border-white/10",
                className
            )}
            style={{
                clipPath: `polygon(
          ${clipSize}px 0, 
          100% 0, 
          100% calc(100% - ${clipSize}px), 
          calc(100% - ${clipSize}px) 100%, 
          0 100%, 
          0 ${clipSize}px
        )`,
            }}
        >
            {/* Corner accent */}
            <div
                className="absolute top-0 left-0 w-[2px] bg-primary"
                style={{ height: `${clipSize + 10}px`, transform: 'translateY(-1px)' }}
            />
            <div
                className="absolute top-0 left-0 h-[2px] bg-primary"
                style={{ width: `${clipSize + 10}px`, transform: 'translateX(-1px)' }}
            />

            {children}
        </div>
    );
}

export function NumberedCard({ number, children, className }) {
    return (
        <div className={cn("relative", className)}>
            {/* Large background number */}
            <span className="absolute -top-6 -left-2 text-[120px] font-bold text-white/[0.02] leading-none select-none pointer-events-none">
                {String(number).padStart(2, '0')}
            </span>

            {/* Card content */}
            <div className="relative bg-white/[0.02] border border-white/10 backdrop-blur-sm">
                {/* Number indicator */}
                <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold">
                    {String(number).padStart(2, '0')}
                </div>
                {children}
            </div>
        </div>
    );
}

export function StackedCard({ children, className, layers = 2 }) {
    return (
        <div className={cn("relative", className)}>
            {/* Background layers */}
            {Array.from({ length: layers }).map((_, i) => (
                <div
                    key={i}
                    className="absolute inset-0 bg-white/[0.02] border border-white/5"
                    style={{
                        transform: `translate(${(i + 1) * 8}px, ${(i + 1) * 8}px)`,
                        zIndex: -i - 1,
                    }}
                />
            ))}

            {/* Main card */}
            <div className="relative bg-[#0c1222] border border-white/10">
                {children}
            </div>
        </div>
    );
}

