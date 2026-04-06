"use client";

import { useEffect, useRef } from "react";

/**
 * Premium SaaS Particle Background
 * Features:
 * - High-speed Canvas rendering
 * - Elegant, slow-moving glowing dots
 * - Adaptive dot count (performance-focused)
 * - Harmonious purple/blue/cyan palette
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Premium SaaS Palette: Purple, Blue, Cyan
    const colors = ["#8b5cf6", "#3b82f6", "#06b6d4"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      velocityX: number;
      velocityY: number;
      color: string;
      opacity: number;
      fadeDirection: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1; // 1-3px dots
        
        // Ultra-slow, elegant movement
        this.velocityX = (Math.random() - 0.5) * 0.15;
        this.velocityY = (Math.random() - 0.5) * 0.15;
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeDirection = Math.random() > 0.5 ? 0.005 : -0.005;
      }

      update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Subtle opacity pulsing
        this.opacity += this.fadeDirection;
        if (this.opacity > 0.6 || this.opacity < 0.1) {
          this.fadeDirection *= -1;
        }

        // Seamless wrap-around
        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Soft focus glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        
        // Reset for performance optimization
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      // Higher density but smaller dots for "funded startup" look
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      const cappedCount = Math.min(particleCount, 100); // Performance cap
      
      for (let i = 0; i < cappedCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6, mixBlendMode: 'screen' }}
    />
  );
}
