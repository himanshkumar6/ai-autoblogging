"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

interface SidebarProps {
  trendingPosts?: any[];
}

export default function Sidebar({ trendingPosts = [] }: SidebarProps) {
  // If we don't have enough posts yet, fallback to a neat empty state or placeholders
  const displayPosts = trendingPosts.length > 0 ? trendingPosts : [];

  return (
    <aside className="flex w-full lg:w-[350px] flex-shrink-0 flex-col gap-6 lg:sticky lg:top-28 h-max pb-8 z-10">
      
      {/* Trending Widget */}
      <GlassCard
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Trending Now</h4>
        </div>
        
        <ul className="space-y-6">
          {displayPosts.length === 0 ? (
            <p className="text-secondary text-sm">Awaiting neural network data...</p>
          ) : (
            displayPosts.map((post, i) => (
              <li key={post.id || i} className="group cursor-pointer relative">
                <Link href={`/blog/${post.slug || '#'}`}>
                  <div className="flex gap-4 items-start relative z-10">
                    <span className="text-2xl font-black text-gray-200 dark:text-white/10 group-hover:text-accent-cyan transition-colors">
                      0{i + 1}
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug group-hover:text-accent-cyan transition-colors line-clamp-2">
                        {post.title}
                      </h5>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                        {Math.floor((post.title.length * 15.4) % 1000) + 200 } views
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </GlassCard>

      {/* Newsletter Widget */}
      <GlassCard
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 relative overflow-hidden"
      >
        {/* Glow orb inside the card */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-purple/30 blur-3xl rounded-full" />
        
        <div className="relative z-10">
          <h4 className="text-white font-bold text-lg mb-2">Alpha Delivered.</h4>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Get the latest AI-generated crypto intel and market sentiment directly in your inbox.
          </p>
          
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full px-4 py-3 rounded-xl text-sm bg-black/5 dark:bg-black/50 text-primary placeholder-gray-500 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:border-transparent transition-all"
            />
            <button className="w-full group relative overflow-hidden bg-white dark:bg-accent-blue hover:bg-gray-50 dark:hover:bg-accent-cyan text-gray-900 dark:text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md active:scale-95">
              <span className="relative z-10">Join the Waitlist</span>
            </button>
          </div>
        </div>
      </GlassCard>

    </aside>
  );
}
