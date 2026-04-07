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
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Control</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-2xl leading-relaxed">
          Monitor your autonomous AI ecosystem. Track content generation, vector synchronization, and social automation.
        </p>
      </header>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total AI Posts Card */}
        <motion.div variants={itemVariants}>
          <GlassCard hasHoverEffect className="p-8 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                <Database className="text-purple-400" size={24} />
              </div>
              <Activity className="text-black/5 dark:text-white/5 group-hover:text-purple-600/30 dark:group-hover:text-purple-500/30 transition-colors" size={40} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total AI Posts</p>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white group-hover:scale-[1.05] transition-transform origin-left duration-300">
              {loading ? <div className="h-10 w-20 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mt-1" /> : stats.totalPosts}
            </h3>
          </GlassCard>
        </motion.div>

        {/* Published Vectors Card */}
        <motion.div variants={itemVariants}>
          <GlassCard hasHoverEffect className="p-8 group shadow-cyan-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                <TrendingUp className="text-cyan-400" size={24} />
              </div>
              <Zap className="text-black/5 dark:text-white/5 group-hover:text-cyan-600/30 dark:group-hover:text-cyan-500/30 transition-colors" size={40} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Published Vectors</p>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white group-hover:scale-[1.05] transition-transform origin-left duration-300">
              {loading ? <div className="h-10 w-20 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mt-1" /> : stats.publishedPosts}
            </h3>
          </GlassCard>
        </motion.div>

        {/* Pushed to X Card */}
        <motion.div variants={itemVariants}>
          <GlassCard hasHoverEffect className="p-8 group shadow-blue-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <Twitter className="text-blue-400" size={24} />
              </div>
              <Twitter className="text-black/5 dark:text-white/5 group-hover:text-blue-600/30 dark:group-hover:text-blue-500/30 transition-colors" size={40} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Pushed to X</p>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white group-hover:scale-[1.05] transition-transform origin-left duration-300">
              {loading ? <div className="h-10 w-20 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mt-1" /> : stats.tweetedPosts}
            </h3>
          </GlassCard>
        </motion.div>
      </div>

      {/* 3. System Status Section */}
      <motion.div 
        variants={itemVariants}
        className="pt-4"
      >
        <GlassCard className="p-8 md:p-10 border-gray-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
              <Server size={22} className="text-purple-600 dark:text-purple-400" />
              Infrastructure Nexus
            </h2>
            <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-400">All Systems Operational</span>
            </div>
          </div>

          <div className="space-y-1">
            <StatusRow 
              icon={Server} 
              label="Supabase Postgres Connection" 
              status="Active" 
              color="green" 
            />
            <div className="h-px bg-gray-200 dark:bg-white/5 mx-4" />
            <StatusRow 
              icon={CheckCircle2} 
              label="Anthropic Claude-3.5-Sonnet Engine" 
              status="Ready" 
              color="purple" 
            />
            <div className="h-px bg-gray-200 dark:bg-white/5 mx-4" />
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
    <div className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all transform hover:translate-x-1 duration-300">
      <div className="flex items-center gap-4">
        <Icon size={18} className="text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[10px] px-2.5 py-1 rounded-lg border border-opacity-30 uppercase font-black tracking-widest ${styles[color].pill}`}>
          {status}
        </span>
        <div className={`w-2 h-2 rounded-full ${styles[color].dot}`} />
      </div>
    </div>
  );
}
