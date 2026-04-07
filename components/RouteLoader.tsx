"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Loader from "@/components/Loader";
import { AnimatePresence } from "framer-motion";

export default function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Hide loader safely when the navigation fully completes and the new page mounts
  // We use a small delay here so that if Next.js caches the route and loads instantly (0ms),
  // the loader doesn't instantly blink or cancel itself. It forces a minimum 400ms smooth transition.
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 400); 
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, searchParams, isLoading]);

  // 2. Intercept click events to show loader immediately BEFORE Next.js fetches and swaps routes
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Don't intercept if user is opening in new tab or using shortcut modifiers
      if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        return;
      }

      // Find closest anchor tag
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (!anchor) return;
      
      // Get the target route
      const href = anchor.getAttribute("href");
      const targetStr = anchor.getAttribute("target");
      
      // Skip if missing href, it's an external/system link, or it opens in a blank tab
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http") || targetStr === "_blank") {
        return;
      }
      
      // Check if it's actually changing the path or search params
      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(href, window.location.origin);

        if (currentUrl.pathname !== targetUrl.pathname || currentUrl.search !== targetUrl.search) {
          setIsLoading(true);
          
          // Failsafe: If the route never changes (e.g. network error), ensure the UI unlocks
          if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = setTimeout(() => {
            setIsLoading(false);
          }, 5000);
        }
      } catch (err) {
        // Fallback for valid relative paths if URL constructor fails
        if (href.startsWith("/")) {
          setIsLoading(true);
        }
      }
    };

    // Listen on capture phase to guarantee interception immediately on user click
    document.addEventListener("click", handleAnchorClick, true);
    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && <Loader />}
    </AnimatePresence>
  );
}
