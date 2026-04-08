"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
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
    image_url?: string;
  };
  index: number;
  priority?: boolean;
}

export default function BlogCard({ post, index, priority = false }: BlogCardProps) {
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
      className="flex flex-col justify-between h-full group border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-white/5 flex items-center justify-center">
        {post.image_url ? (
          <>
            <Image 
              src={post.image_url} 
              alt={post.title} 
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent-cyan/20 blur-2xl rounded-full animate-pulse" />
              <ImageIcon size={48} className="text-white/20 relative z-10" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-60" />
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${badgeColor}`}>
            {category}
          </span>
          <span className="text-[10px] font-black text-gray-600 dark:text-white/30 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-accent-cyan animate-pulse" />
            {readTime} min read
          </span>
        </div>
        
        <div>
          <h3 className="text-xl sm:text-2xl font-black leading-tight text-gray-900 dark:text-white group-hover:text-accent-cyan dark:group-hover:text-accent-cyan transition-colors duration-500 mb-4">
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0 z-30" />
              {post.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-white/50 line-clamp-2 font-medium group-hover:text-gray-900 dark:group-hover:text-white/70 transition-colors duration-500">
            {post.meta_description}
          </p>
        </div>
      </div>
      
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-black uppercase tracking-widest group-hover:bg-accent-cyan group-hover:text-[#0a0a0f] transition-all duration-500 shadow-lg shadow-accent-cyan/5">
          Read Article
          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-500" />
        </div>
        <time dateTime={post.created_at} className="text-[10px] text-gray-600 dark:text-white/20 font-black uppercase tracking-tighter">
          {date}
        </time>
      </div>
      </div>
    </GlassCard>
  );
}
