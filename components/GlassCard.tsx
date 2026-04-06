"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hasHoverEffect?: boolean;
}

export default function GlassCard({ children, className = "", hasHoverEffect = false, ...props }: GlassCardProps) {
  const hoverStyles = hasHoverEffect 
    ? "hover:bg-glass-bgHover hover:border-white/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300"
    : "";

  return (
    <motion.div
      {...props}
      className={`relative overflow-hidden bg-white/5 dark:bg-[#15151f]/40 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-sm rounded-2xl ${hoverStyles} ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      {children}
    </motion.div>
  );
}
