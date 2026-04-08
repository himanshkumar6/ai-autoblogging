"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hasHoverEffect?: boolean;
}

/**
 * Theme-Aware Premium Glassmorphism Card
 * Features:
 * - Adaptive background (white/5 in dark, white/80 in light)
 * - Backdrop blur
 * - High-contrast borders
 */
export default function GlassCard({ 
  children, 
  className = "", 
  hasHoverEffect = false, 
  ...props 
}: GlassCardProps) {
  const hoverStyles = hasHoverEffect 
    ? "hover:bg-white/95 dark:hover:bg-white/10 hover:border-purple-200 dark:hover:border-white/20 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 ease-out"
    : "";

  return (
    <motion.div
      {...props}
      className={`
        relative overflow-hidden 
        bg-white/70 dark:bg-white/5 backdrop-blur-xl 
        border border-gray-200 dark:border-white/10 
        shadow-xl shadow-purple-500/5 
        rounded-2xl 
        ${hoverStyles} 
        ${className}
      `}
    >
      {/* Light Mode Top Border Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-100 dark:opacity-0 transition-opacity pointer-events-none" />
      
      {/* Dark Mode Top Border Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 dark:opacity-40 transition-opacity pointer-events-none" />
      
      {children}
    </motion.div>
  );
}
