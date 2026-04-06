import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MarketsPage() {
  return (
    <Container className="pt-24 pb-24 relative z-10">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-black text-primary mb-6 tracking-tight drop-shadow-sm">
          Market Intelligence
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          Deep-dive analytics, protocol breakdowns, and algorithmic price predictions. Our datasets update autonomously via cron triggers.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <GlassCard className="p-8 group hover:-translate-y-2 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-6">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">On-Chain Analytics</h2>
          <p className="text-secondary mb-8">Access our raw AI breakdown of major exchange inflows, whale movements, and DeFi TVL shifts.</p>
          <div className="text-accent-cyan font-bold flex items-center text-sm">
            Explore Sector <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </GlassCard>

        <GlassCard className="p-8 group hover:-translate-y-2 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center text-accent-purple mb-6">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">Asset Reviews</h2>
          <p className="text-secondary mb-8">Unbiased, objective breakdowns of Layer 1 protocols and prominent Dapps generated via deep-learning.</p>
          <div className="text-accent-purple font-bold flex items-center text-sm">
            Explore Sector <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </GlassCard>
      </div>

      <div className="mt-16 text-center">
        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-xl px-8 py-3 bg-white/5 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md text-primary font-bold hover:bg-black/5 dark:hover:bg-white/20 transition-all hover:-translate-y-1"
        >
          Return Home
        </Link>
      </div>
    </Container>
  );
}
