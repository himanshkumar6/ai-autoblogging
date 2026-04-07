"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { AnimatePresence, motion } from "framer-motion";

export default function GlobalLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 1. Initially set to true so it ALWAYS shows immediately on page load
  const [isLoading, setIsLoading] = useState(true);

  // 2. Route Transition Handling & Load Simulation
  useEffect(() => {
    // Force loading state true on every route change
    setIsLoading(true);

    // Artificial delay to guarantee the loader displays smoothly 
    // and blocks the UI fully before revealing content
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return (
    <>
      {/* Ensure loader is fixed above everything and animates out cleanly */}
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>

      {/* Render children normally so they build their DOM accurately in the background 
          while Loader overlays them completely. This prevents fixed positioning bugs 
          and layout shifts. */}
      {children}
    </>
  );
}
