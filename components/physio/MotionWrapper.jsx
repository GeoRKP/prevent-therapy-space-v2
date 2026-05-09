"use client";

import { motion } from "framer-motion";

export function MotionWrapper({ children, delay = 0, className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
