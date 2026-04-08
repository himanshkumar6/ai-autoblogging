"use client";

import React, { useEffect, useState, useId } from "react";
import { useTheme } from "next-themes";

interface AdSlotProps {
  adCode?: string;
  className?: string;
  minHeight?: string;
}

/**
 * AdSlot - Isolated Proxy Engine.
 * Points to a standalone HTML file to isolate ad scripts from the main 
 * React/Webpack context while maintaining same-origin permissions.
 */
export default function AdSlot({ adCode, className = "", minHeight }: AdSlotProps) {
  const [dynamicHeight, setDynamicHeight] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const slotId = useId();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleMessage = (event: MessageEvent) => {
      // Strict origin check for security
      if (event.origin !== window.location.origin) return;
      
      // Ensure we only listen to resize events specifically routed to this isolated component
      if (event.data?.type === 'AD_RESIZE' && event.data?.height && event.data?.id === slotId) {
         setDynamicHeight(`${event.data.height}px`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [slotId]);

  if (!mounted || !adCode) return null;

  // Encode the ad code and unique ID for safe transfer via URL fragment
  let adPayload = "";
  try {
    const payloadObj = JSON.stringify({ code: adCode, id: slotId, theme: resolvedTheme || "dark" });
    adPayload = btoa(unescape(encodeURIComponent(payloadObj)));
  } catch (e) {
    // Fallback encoding for unsupported characters
    const fallbackObj = JSON.stringify({ code: adCode, id: slotId, theme: resolvedTheme || "dark" });
    adPayload = btoa(fallbackObj);
  }

  const proxyUrl = `/ad-slot-proxy.html#${adPayload}`;

  return (
    <div 
      className={`ad-slot-proxy-wrapper w-full flex justify-center items-center overflow-hidden py-4 bg-transparent dark:bg-transparent transition-all duration-300 ${className}`}
      style={{ minHeight: minHeight || "90px" }}
    >
      <iframe
        key={resolvedTheme || "default"}
        title="Isolated Ad Slot"
        src={proxyUrl}
        className="w-full border-none bg-transparent dark:bg-transparent overflow-hidden pointer-events-auto transition-all duration-500"
        style={{ 
          height: dynamicHeight || minHeight || "90px",
          maxWidth: "100%",
          display: "block",
          colorScheme: "light dark"
        }}
        sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
        scrolling="no"
        allowTransparency={true}
      />
    </div>
  );
}
