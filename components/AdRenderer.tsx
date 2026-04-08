"use client";

import { useEffect, useRef, useState } from "react";

interface AdRendererProps {
  adCode?: string;
  className?: string;
}

/**
 * AdRenderer Component - Robust Injection System
 * Manually parses adCode and re-injects scripts to ensure execution in SPA environments.
 * Strictly prevents double-execution and handles dynamic height checks for layout stability.
 */
export default function AdRenderer({ adCode, className = "" }: AdRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const executionToken = useRef(false);

  useEffect(() => {
    // 1. Immediate exit if no code or already rendered to this mount
    if (!adCode || executionToken.current) return;

    const targetContainer = containerRef.current;
    if (!targetContainer) return;

    try {
      // 2. Clear current state to avoid duplication
      targetContainer.innerHTML = "";
      
      // 3. Parse the adCode string into a temporary structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(adCode, "text/html");
      const nodes = Array.from(doc.body.childNodes);

      // 4. Iterate and manually recreate each node
      nodes.forEach((node) => {
        if (node.nodeName === "SCRIPT") {
          const oldScript = node as HTMLScriptElement;
          const newScript = document.createElement("script");

          // Copy all identifying attributes (src, async, data-*, etc.)
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });

          // Re-embed inner content for inline configuration scripts (like atOptions)
          if (oldScript.innerHTML) {
            newScript.innerHTML = oldScript.innerHTML;
            
            // SPECIAL FIX for Adsterra atOptions:
            // If the script contains 'atOptions', we need to ensure it's on the window object
            if (oldScript.innerHTML.includes("atOptions")) {
              try {
                // Safely evaluate the atOptions assignment to window
                const scriptBody = oldScript.innerHTML.trim();
                // This will execute 'atOptions = { ... }' in global scope
                const evalScript = new Function(scriptBody);
                evalScript();
              } catch (evalErr) {
                console.warn("[AdRenderer] Failed to evaluate inline script:", evalErr);
              }
            }
          }

          targetContainer.appendChild(newScript);
        } else {
          // Clone and append non-script nodes (like target containers/divs)
          targetContainer.appendChild(node.cloneNode(true));
        }
      });

      // 5. Mark as successfully executed for this lifecycle
      executionToken.current = true;

      // 6. Final Stability Check: If no content renders after 10s, hide to avoid whitespace
      const checkTimer = setTimeout(() => {
        if (targetContainer && targetContainer.offsetHeight === 0) {
          console.warn("[AdRenderer] No content detected. Self-destructing for layout purity.");
          setIsVisible(false);
        }
      }, 10000);

      return () => clearTimeout(checkTimer);
    } catch (err) {
      console.error("[AdRenderer] Critical injection failure:", err);
      setIsVisible(false);
    }
  }, [adCode]);

  // Prevent rendering if invalid or hidden
  if (!adCode || !isVisible) return null;

  return (
    <div className={`w-full flex justify-center items-center my-10 overflow-hidden text-center transition-all duration-500 scale-100 ${className}`}>
      <div 
        ref={containerRef} 
        className="ad-slot-container max-w-full inline-block mx-auto min-h-[1px]"
        style={{ margin: "0 auto" }}
      />
    </div>
  );
}
