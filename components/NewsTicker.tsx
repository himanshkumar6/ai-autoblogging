"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function NewsTicker() {
  const [headlines, setHeadlines] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHeadlines = async () => {
      const supabase = getSupabase();
      const { data } = await supabase
        .from("posts")
        .select("title, slug")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (data) setHeadlines(data);
    };

    fetchHeadlines();

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (headlines.length || 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [headlines.length]);

  if (headlines.length === 0) return null;

  return (
    <div className="fixed top-20 w-full z-40 bg-white/60 dark:bg-[#0a0a0f]/60 backdrop-blur-md border-b border-black/5 dark:border-white/5 h-10 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        {/* Breaking Badge */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Breaking</span>
        </div>

        <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

        {/* Headline Slider */}
        <div className="flex-1 relative h-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center"
            >
              <Link 
                href={`/blog/${headlines[currentIndex].slug}`}
                className="text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-accent-cyan truncate transition-colors max-w-[80vw] sm:max-w-full"
              >
                {headlines[currentIndex].title}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots (Optional/Visual) */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          {headlines.map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-1 rounded-full transition-all duration-300 ${i === currentIndex ? "bg-accent-cyan w-3" : "bg-black/10 dark:bg-white/10"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
