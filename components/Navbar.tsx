"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Markets", href: "/markets" },
    { name: "About", href: "/about" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || isMobileMenuOpen
          ? "bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border-b border-black/5 dark:border-white/10"
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
          
          <nav className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-accent-cyan dark:hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden md:block" />
            
            <div className="flex items-center gap-2">
              {mounted && (
                <button
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 hover:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                  aria-label="Toggle Dark Mode"
                >
                  {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-white/10 bg-white/95 dark:bg-[#0a0a0f]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-6 py-10 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-gray-800 dark:text-gray-200 hover:text-accent-cyan transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

