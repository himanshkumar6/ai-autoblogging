"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setReadingProgress((currentScrollY / scrollHeight) * 100);
      }
    };

    window.addEventListener("scroll", updateScroll);
    updateScroll();

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-[60] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink shadow-[0_0_10px_rgba(6,182,212,0.8)]"
        style={{ width: `${readingProgress}%`, transition: 'width 0.1s ease-out' }} 
      />
    </div>
  );
}
