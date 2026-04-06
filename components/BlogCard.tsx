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

  return (
    <GlassCard 
      hasHoverEffect 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="p-6 sm:p-8 flex flex-col justify-between h-full group"
    >
      <div>
        <div className="flex items-center gap-x-4 text-xs mb-5">
          <time dateTime={post.created_at} className="text-gray-500 dark:text-gray-400 font-medium">
            {date}
          </time>
          <span className="relative z-10 rounded-full bg-accent-blue/10 dark:bg-accent-blue/20 text-accent-blue dark:text-blue-300 px-3 py-1 font-semibold border border-accent-blue/20">
            Market Intel
          </span>
        </div>
        
        <div className="relative">
          <h3 className="text-xl sm:text-2xl font-bold leading-snug text-primary transition-colors group-hover:text-accent-cyan mb-4">
            <Link href={`/blog/${post.slug}`}>
              <span className="absolute inset-0 z-20" />
              {post.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-secondary line-clamp-3">
            {post.meta_description}
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex items-center text-accent-blue dark:text-accent-cyan text-sm font-bold tracking-wide transition-colors group-hover:text-accent-pink">
        Read Article
        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </GlassCard>
  );
}
