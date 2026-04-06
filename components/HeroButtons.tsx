"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

export default function HeroButtons() {
  const handleScroll = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative z-20">
      <button
        onClick={(e) => handleScroll(e, "latest-posts")}
        className="group relative flex items-center justify-center gap-2 rounded-xl bg-primary dark:bg-white px-8 py-4 text-sm font-bold text-white dark:text-gray-900 transition-all duration-300 hover:scale-[0.98] hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 group-hover:text-white transition-colors">Start Reading</span>
        <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 group-hover:text-white transition-all" />
      </button>
      
      <button
        onClick={(e) => handleScroll(e, "about")}
        className="rounded-xl px-8 py-4 text-sm font-bold text-primary dark:text-white border border-black/10 dark:border-white/10 glass-bg hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 hover:scale-[0.98]"
      >
        View Analytics
      </button>
    </div>
  );
}
