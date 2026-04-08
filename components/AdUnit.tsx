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
    if (!containerRef.current || !html) return;

    // Clear existing content
    containerRef.current.innerHTML = "";
    
    // 1. Create a temporary container to parse the HTML string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html.trim();

    // 2. Extract scripts and non-script nodes
    const scripts = Array.from(tempDiv.querySelectorAll("script"));
    
    // 3. Append non-script HTML first
    // We remove scripts from the temp div before moving its contents
    scripts.forEach(s => s.remove());
    while (tempDiv.firstChild) {
      containerRef.current.appendChild(tempDiv.firstChild);
    }

    // 4. Sequentially inject scripts to maintain order (critical for atOptions)
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      
      // Copy all attributes (src, async, defer, type, data-*, etc.)
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Handle inline script content
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }

      // Special case for some ad networks that block cloudflare rocket loader or similar
      if (!newScript.getAttribute("type")) {
        newScript.type = "text/javascript";
      }

      containerRef.current?.appendChild(newScript);
    });

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
        className="min-h-[50px] w-full flex justify-center overflow-hidden ad-slot-container"
      />
    </div>
  );
}
