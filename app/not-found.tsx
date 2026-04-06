import Link from "next/link";
import Container from "@/components/Container";
import { ArrowLeft } from "lucide-react";
import GlassCard from "@/components/GlassCard";

export default function NotFound() {
  return (
    <Container className="min-h-[80vh] flex items-center justify-center relative z-10">
      <GlassCard className="p-12 md:p-16 text-center max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent-cyan/20 blur-[50px] rounded-full point-events-none -z-10" />

        <div className="text-accent-cyan font-black text-8xl md:text-9xl tracking-tighter drop-shadow-lg mb-6">
          404
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Signal Lost
        </h1>
        
        <p className="text-secondary text-lg mb-10 max-w-md mx-auto leading-relaxed">
          The autonomous algorithms couldn't find the data block you are looking for. The node might have been relocated.
        </p>

        <Link
          href="/"
          className="group relative flex items-center justify-center gap-2 rounded-xl bg-white/5 dark:bg-white/10 px-8 py-4 text-sm font-bold text-primary border border-black/10 dark:border-white/10 transition-all duration-300 hover:scale-[0.98] hover:bg-black/5 dark:hover:bg-white/20 overflow-hidden"
        >
          <ArrowLeft size={18} className="relative z-10 group-hover:-translate-x-1 transition-all text-accent-cyan" />
          <span className="relative z-10 transition-colors">Return to Safety</span>
        </Link>
      </GlassCard>
    </Container>
  );
}
