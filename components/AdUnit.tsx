"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
  html?: string;
  className?: string;
  label?: string;
}

export default function AdUnit({ html, className = "", label = "Advertisement" }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && html) {
      // Clear existing content
      containerRef.current.innerHTML = "";
      
      // Create a range/fragment to execute scripts within the raw HTML
      const range = document.createRange();
      const fragment = range.createContextualFragment(html);
      
      containerRef.current.appendChild(fragment);
    }
  }, [html]);

  if (!html) return null;

  return (
    <div className={`w-full flex flex-col items-center gap-2 py-4 ${className}`}>
      {label && (
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-white/20 select-none">
          {label}
        </span>
      )}
      <div 
        ref={containerRef} 
        className="min-h-[50px] w-full flex justify-center overflow-hidden"
      />
    </div>
  );
}
