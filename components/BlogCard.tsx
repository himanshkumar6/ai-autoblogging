"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GlassCard from "./GlassCard";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    meta_description: string;
    created_at: string;
    content?: string; // Optional for read time calc
    tweeted?: boolean;
  };
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Simple reading time estimation (fallback if content is missing)
  const readTime = Math.ceil((post.content?.length || 1500) / 1000) + 1;

  // Curated category selection based on index for variety
  const categories = ["Trending", "Tech Insight", "AI Analysis", "Market Pulse"];
  const category = categories[index % categories.length];
  const badgeColors = [
    "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
    "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "bg-pink-500/10 text-pink-400 border-pink-500/20"
  ];
  const badgeColor = badgeColors[index % badgeColors.length];

  return (
    <GlassCard 
      hasHoverEffect 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="p-6 sm:p-8 flex flex-col justify-between h-full group border border-white/5 hover:border-white/10 transition-all duration-300"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${badgeColor}`}>
            {category}
          </span>
          <span className="text-[10px] font-black text-gray-500 dark:text-white/30 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-accent-cyan animate-pulse" />
            {readTime} min read
          </span>
        </div>
        
        <div>
          <h3 className="text-xl sm:text-2xl font-black leading-tight text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all duration-300 mb-4">
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0 z-30" />
              {post.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-white/50 line-clamp-2 font-medium">
            {post.meta_description}
          </p>
        </div>
      </div>
      
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-black uppercase tracking-widest group-hover:bg-accent-cyan group-hover:text-[#0a0a0f] transition-all duration-300 shadow-lg shadow-accent-cyan/5">
          Read Article
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
        <time dateTime={post.created_at} className="text-[10px] text-gray-400 dark:text-white/20 font-black uppercase tracking-tighter">
          {date}
        </time>
      </div>
    </GlassCard>
  );
}
