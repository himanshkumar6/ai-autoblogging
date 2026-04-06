"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-[#0a0a0f]/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white drop-shadow-md">
              Crypto<span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-blue transition-all group-hover:from-accent-purple group-hover:to-accent-pink">News</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-8">
            <div className="hidden md:flex gap-8">
              <Link href="/" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-accent-cyan dark:hover:text-white transition-colors">Home</Link>
              <Link href="/markets" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-accent-cyan dark:hover:text-white transition-colors">Markets</Link>
              <Link href="/about" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-accent-cyan dark:hover:text-white transition-colors">About</Link>
            </div>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden md:block" />
            
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 hover:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                aria-label="Toggle Dark Mode"
              >
                {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
