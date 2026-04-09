"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Send, Github, ArrowRight, ShieldCheck, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative z-10 w-full mt-auto border-t border-white/5 bg-transparent overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white drop-shadow-md">
                Crypto<span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-blue transition-all group-hover:from-accent-purple group-hover:to-accent-pink">News</span>
              </span>
            </Link>
            <p className="text-secondary text-sm leading-relaxed max-w-xs">
              AI-powered insights for the next generation of crypto enthusiasts. Trusted data, real-time analysis, and deep market intelligence.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
                { icon: <Send size={18} />, href: "#", label: "Telegram" },
                { icon: <Github size={18} />, href: "#", label: "GitHub" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:text-accent-cyan hover:border-accent-cyan/50 hover:bg-accent-cyan/5 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Platform Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Platform</h3>
            <ul className="space-y-4">
              {[
                { name: "Market Analytics", href: "/markets" },
                { name: "Latest News", href: "/" },
                { name: "About Insights", href: "/about" },
                { name: "Intelligence Hub", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-secondary hover:text-accent-cyan transition-colors flex items-center group">
                    <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal & Compliance Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Compliance</h3>
            <ul className="space-y-4">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cookie Policy", href: "/privacy" },
                { name: "Disclaimer", href: "/terms" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-secondary hover:text-accent-cyan transition-colors flex items-center group">
                    <ShieldCheck size={14} className="mr-2 text-white/20 group-hover:text-accent-cyan transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter / CTA Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                <Mail size={16} className="text-accent-cyan" />
                Stay Ahead
              </h3>
              <p className="text-xs text-secondary mb-4 leading-relaxed">
                Join our newsletter to receive the latest market intelligence directly in your inbox.
              </p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Email address..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all placeholder:text-gray-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-accent-cyan text-white hover:bg-accent-blue transition-colors">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-xs text-gray-500 font-medium">
            © {currentYear} NexusPulse Intelligence. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-xs text-secondary opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            System Status: Optimal
          </div>
          <div className="text-xs text-gray-500 italic">
            Empowered by Autonomous Systems
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
