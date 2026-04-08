"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import AdRenderer from "./AdRenderer";

interface SidebarProps {
  trendingPosts?: any[];
  adCode?: string;
}

export default function Sidebar({ trendingPosts = [], adCode }: SidebarProps) {
  // If we don't have enough posts yet, fallback to a neat empty state or placeholders
  const displayPosts = trendingPosts.length > 0 ? trendingPosts : [];

  return (
    <aside className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-8 lg:sticky lg:top-28 h-fit pb-12 z-10">
      
      {/* Trending Widget */}
      <GlassCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 md:p-8"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Trending Pulse</h4>
        </div>
        
        <ul className="space-y-8">
          {displayPosts.length === 0 ? (
            <p className="text-secondary text-sm">Awaiting neural network data...</p>
          ) : (
            displayPosts.map((post, i) => (
              <li key={post.id || i} className="group cursor-pointer">
                <Link href={`/blog/${post.slug || '#'}`}>
                  <div className="flex gap-4 items-start">
                    <span className="text-2xl font-black text-gray-300 dark:text-white/10 group-hover:text-accent-cyan transition-colors">
                      {i + 1}
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-gray-900 dark:text-gray-200 leading-tight group-hover:text-accent-cyan transition-colors line-clamp-2 italic">
                        {post.title}
                      </h5>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </GlassCard>

      {/* Sidebar Ad Placement */}
      <AdRenderer adCode={adCode} className="my-0" />

      {/* Newsletter Widget */}
      <GlassCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent-purple/20 blur-3xl rounded-full" />
        
        <div className="relative z-10">
          <h4 className="text-gray-900 dark:text-white font-black text-lg sm:text-xl tracking-tighter mb-2">Alpha Delivered</h4>
          <p className="text-gray-700 dark:text-white/40 text-xs sm:text-sm mb-8 font-medium leading-relaxed">
            Get the latest AI-generated crypto intel delivered to your inbox daily.
          </p>
          
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full px-4 py-3.5 rounded-xl text-sm bg-black/5 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 border border-transparent focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all"
            />
            <button className="w-full bg-gray-900 dark:bg-accent-blue text-white font-black py-4 px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </GlassCard>
    </aside>
  );
}
