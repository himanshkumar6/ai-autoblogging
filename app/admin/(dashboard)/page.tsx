"use client";

import { createClient } from "@/lib/supabase/client";
import { Database, TrendingUp, Twitter, CheckCircle2, Server, Clock, Activity, Zap } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Premium Admin Dashboard Content
 * Features:
 * - Stats grid with GlassCard components
 * - Hover lift & glow effects
 * - Animated number placeholders
 * - High-polish system status status
 */
export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({ totalPosts: 0, publishedPosts: 0, tweetedPosts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [{ count: total }, { count: published }, { count: tweeted }] = await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("tweeted", true),
      ]);

      setStats({
        totalPosts: total || 0,
        publishedPosts: published || 0,
        tweetedPosts: tweeted || 0
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12"
    >
      {/* 1. Header Section */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-3 leading-tight">
          Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Control</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
          Monitor your autonomous AI ecosystem. Track content generation, vector synchronization, and social automation.
        </p>
      </header>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total AI Posts Card */}
        <motion.div variants={itemVariants}>
          <GlassCard hasHoverEffect className="p-6 md:p-8 group h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                <Database className="text-purple-400" size={24} />
              </div>
              <Activity className="text-black/5 dark:text-white/5 group-hover:text-purple-600/30 dark:group-hover:text-purple-500/30 transition-colors" size={40} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total AI Posts</p>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white group-hover:scale-[1.05] transition-transform origin-left duration-300">
              {loading ? <div className="h-10 w-20 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mt-1" /> : stats.totalPosts}
            </h3>
          </GlassCard>
        </motion.div>

        {/* Published Vectors Card */}
        <motion.div variants={itemVariants}>
          <GlassCard hasHoverEffect className="p-6 md:p-8 group shadow-cyan-500/10 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                <TrendingUp className="text-cyan-400" size={24} />
              </div>
              <Zap className="text-black/5 dark:text-white/5 group-hover:text-cyan-600/30 dark:group-hover:text-cyan-500/30 transition-colors" size={40} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Published Vectors</p>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white group-hover:scale-[1.05] transition-transform origin-left duration-300">
              {loading ? <div className="h-10 w-20 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mt-1" /> : stats.publishedPosts}
            </h3>
          </GlassCard>
        </motion.div>

        {/* Pushed to X Card */}
        <motion.div variants={itemVariants}>
          <GlassCard hasHoverEffect className="p-6 md:p-8 group shadow-blue-500/10 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <Twitter className="text-blue-400" size={24} />
              </div>
              <Twitter className="text-black/5 dark:text-white/5 group-hover:text-blue-600/30 dark:group-hover:text-blue-500/30 transition-colors" size={40} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Pushed to X</p>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white group-hover:scale-[1.05] transition-transform origin-left duration-300">
              {loading ? <div className="h-10 w-20 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mt-1" /> : stats.tweetedPosts}
            </h3>
          </GlassCard>
        </motion.div>
      </div>

      {/* 3. System Status & Actions Section */}
      <motion.div 
        variants={itemVariants}
        className="pt-4 grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Actions Card */}
        <GlassCard className="lg:col-span-1 p-6 md:p-8 bg-purple-600/5 border-purple-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-purple-500" size={24} />
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Auto-Pilot</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold leading-relaxed mb-8">
              Manually trigger the full AI pipeline: Trend Discovery → Content Generation → Social Automation.
            </p>
          </div>
          
          <button 
            onClick={async () => {
              const confirmRun = confirm("Are you sure you want to trigger the full autonomous pipeline? This may take 2-5 minutes.");
              if (!confirmRun) return;
              
              const btn = document.getElementById('autorun-btn');
              try {
                if (btn) {
                  btn.innerText = "Processing Vectors...";
                  btn.setAttribute('disabled', 'true');
                  btn.classList.add('opacity-50');
                }
                
                const res = await fetch('/api/auto-generate', {
                  method: 'POST',
                  headers: { 
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                const result = await res.json();
                
                if (result.success) {
                  alert("🚀 Pipeline Successful! New post generated: " + (result.data?.title || "Unknown Title"));
                  window.location.reload();
                } else {
                  alert("❌ Pipeline Error: " + (result.error || "Execution failed"));
                }
              } catch (err) {
                alert("❌ Critical Error: Request timed out or server crashed.");
              } finally {
                if (btn) {
                  btn.innerText = "Trigger Autonomous Pipeline";
                  btn.removeAttribute('disabled');
                  btn.classList.remove('opacity-50');
                }
              }
            }}
            id="autorun-btn"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-500/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
          >
            Trigger Autonomous Pipeline
          </button>
        </GlassCard>

        {/* Status Card */}
        <GlassCard className="lg:col-span-2 p-6 md:p-10 border-gray-200 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
            <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 text-gray-900 dark:text-white">
              <Server size={24} className="text-purple-600 dark:text-purple-400" />
              Infrastructure Nexus
            </h2>
            <div className="px-4 py-2 rounded-xl bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 flex items-center gap-3 self-start sm:self-auto">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-700 dark:text-green-400">All Systems Operational</span>
            </div>
          </div>

          <div className="space-y-2">
            <StatusRow 
              icon={Server} 
              label="Supabase Postgres Connection" 
              status="Active" 
              color="green" 
            />
            <StatusRow 
              icon={Zap} 
              label="Multi-Niche AI Engine (Crypto/NASA)" 
              status="Ready" 
              color="purple" 
            />
            <StatusRow 
              icon={Clock} 
              label="Automated Pipeline (Vercel Cron)" 
              status="Scheduled" 
              color="cyan" 
            />
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

function StatusRow({ icon: Icon, label, status, color }: { 
  icon: any, 
  label: string, 
  status: string, 
  color: 'green' | 'purple' | 'cyan' 
}) {
  const styles = {
    green: {
      pill: "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30",
      dot: "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
    },
    purple: {
      pill: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30",
      dot: "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
    },
    cyan: {
      pill: "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30",
      dot: "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.03] transition-all transform hover:translate-x-1 duration-300 gap-4">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
          <Icon size={18} className="text-gray-500 dark:text-gray-400" />
        </div>
        <span className="text-sm md:text-base font-bold text-gray-700 dark:text-gray-200">{label}</span>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3 px-2 sm:px-0">
        <span className={`text-[10px] px-3 py-1.5 rounded-lg border border-opacity-30 uppercase font-black tracking-widest ${styles[color].pill}`}>
          {status}
        </span>
        <div className={`w-2 h-2 rounded-full ${styles[color].dot}`} />
      </div>
    </div>
  );
}

