"use client";

import { motion } from "framer-motion";
import { Sparkles, BrainCircuit } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Premium AI-Powered Full-Screen Loader
 * 
 * Features:
 * - Ultra-smooth Framer Motion concentric rings
 * - Deep SaaS dark background with ambient mesh glows
 * - Glowing core with AI semantic iconography
 * - Indeterminate smooth progress bar
 */
export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut", exit: { duration: 0.4, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#050505] overflow-hidden"
    >
      {/* 1. Ambient Glowing Blobs */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Deep purple glow */}
        <div className="absolute top-[20%] left-[25%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        {/* Deep blue/cyan glow */}
        <div className="absolute bottom-[20%] right-[25%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      {/* 2. Centerpiece Animation */}
      <div className="relative flex items-center justify-center mb-10 w-48 h-48">
        {/* Outer Ring (Slow Rotation) */}
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
           className="absolute w-40 h-40 rounded-full border border-gray-200 dark:border-white/5 border-t-purple-500/40 border-r-indigo-500/40"
        />
        
        {/* Middle Ring (Reverse Medium Rotation) */}
        <motion.div
           animate={{ rotate: -360 }}
           transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
           className="absolute w-32 h-32 rounded-full border border-gray-100 dark:border-white/[0.03] border-l-cyan-500/40 border-b-purple-400/40"
        />

        {/* Inner Ring (Fast Rotation) */}
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
           className="absolute w-24 h-24 rounded-full border border-transparent border-t-blue-400/30 border-r-purple-500/30 border-b-cyan-400/30 border-l-indigo-500/30"
        />

        {/* Core AI Icon Block */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-16 h-16 bg-gradient-to-tr from-purple-200/50 to-indigo-200/50 dark:from-purple-900/40 dark:to-indigo-900/40 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-[0_0_30px_rgba(124,58,237,0.15)] dark:shadow-[0_0_40px_rgba(124,58,237,0.3)]"
        >
          <BrainCircuit className="text-purple-600 dark:text-purple-300" size={28} />
          
          {/* Subtle Sparkles on the core */}
          <motion.div 
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-1.5 -right-1.5"
          >
            <Sparkles className="text-cyan-600 dark:text-cyan-400" size={14} />
          </motion.div>
          <motion.div 
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-1 -left-1"
          >
            <Sparkles className="text-purple-600 dark:text-purple-400" size={10} />
          </motion.div>
        </motion.div>
      </div>

      {/* 3. Text & Typographic Animation */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-center gap-2 relative z-10"
      >
        <h2 className="text-lg md:text-xl font-semibold tracking-wide text-gray-900 dark:text-gray-100">
          Loading Markets
        </h2>
        
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <p className="text-xs font-medium text-gray-400 tracking-wider">
            Securing connection...
          </p>
        </motion.div>
      </motion.div>

      {/* 4. Elegant Indeterminate Progress Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-16 md:bottom-24 w-64 md:w-80 h-[2px] bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden"
      >
        <motion.div
          animate={{ 
            x: ["-100%", "200%"],
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full opacity-80"
        />
      </motion.div>

    </motion.div>
  );
}
