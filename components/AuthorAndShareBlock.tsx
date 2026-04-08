"use client";

import { useState } from "react";
import { Twitter, Link as LinkIcon, Check } from "lucide-react";

interface AuthorAndShareBlockProps {
  authorName?: string;
  authorDesignation?: string;
  authorImage?: string;
  postTitle: string;
}

export default function AuthorAndShareBlock({ 
  authorName = "Himanshu", 
  authorDesignation = "Crypto Analyst", 
  authorImage,
  postTitle
}: AuthorAndShareBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: postTitle,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback to Twitter
      const text = encodeURIComponent(`Read this article: ${postTitle}`);
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full py-6 sm:py-8 border-t border-b border-black/5 dark:border-white/5 gap-6">
      <div className="flex items-center gap-4 text-left justify-center sm:justify-start">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-0.5 flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
          {authorImage ? (
             <img src={authorImage} alt={authorName} className="w-full h-full object-cover rounded-lg sm:rounded-[11px]" />
          ) : (
             <div className="w-full h-full rounded-lg sm:rounded-[11px] bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-purple flex items-center justify-center">
               <span className="text-white font-display font-black text-xs sm:text-sm tracking-tighter uppercase p-1 truncate">
                  {authorName.slice(0, 2)}
               </span>
             </div>
          )}
        </div>
        <div>
          <p className="text-[10px] sm:text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none mb-1.5 flex items-center gap-2">
            {authorName}
            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
          </p>
          {authorDesignation && (
            <p className="text-[8px] sm:text-[9px] text-gray-500 dark:text-white/40 font-bold tracking-widest uppercase font-display">{authorDesignation}</p>
          )}
        </div>
      </div>

      {/* Interactive Share Buttons */}
      <div className="flex items-center justify-center gap-2">
        <button 
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:text-white hover:bg-[#1DA1F2] dark:hover:bg-white dark:hover:text-black transition-all font-black text-[9px] uppercase tracking-widest border border-transparent w-1/2 sm:w-auto" 
          aria-label="Share Article"
        >
          <Twitter size={14} />
          Share
        </button>
        <button 
          onClick={handleCopyLink}
          className="p-2 sm:p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all border border-transparent flex justify-center w-1/2 sm:w-auto overflow-hidden relative" 
          aria-label="Copy Link"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <LinkIcon size={14} />}
        </button>
      </div>
    </div>
  );
}
