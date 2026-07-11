"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MagneticElement({ children, className, strength = 0.3 }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        setPosition({
            x: distanceX * strength,
            y: distanceY * strength,
        });
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        setPosition({ x: 0, y: 0 });
    }, []);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            className={cn("inline-block", className)}
        >
            {children}
        </motion.div>
    );
}

export function FloatingCursor({ className }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        // Check for hoverable elements
        const handleHoverChange = (e) => {
            const hoverable = e.target.closest("[data-cursor-hover]");
            setIsHovering(!!hoverable);
        };
        document.addEventListener("mouseover", handleHoverChange);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseover", handleHoverChange);
        };
    }, []);

    return (
        <motion.div
            className={cn(
                "fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference",
                className
            )}
            animate={{
                x: position.x - (isHovering ? 30 : 10),
                y: position.y - (isHovering ? 30 : 10),
                scale: isHovering ? 1 : 1,
                opacity: isVisible ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
            <motion.div
                className="rounded-full bg-white"
                animate={{
                    width: isHovering ? 60 : 20,
                    height: isHovering ? 60 : 20,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />
        </motion.div>
    );
}

