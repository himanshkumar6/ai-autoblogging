import { createClient } from "@/lib/supabase/server";
import { Database, TrendingUp, Twitter, CheckCircle2, Server, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createClient();
  
  // Aggregate some metrics
  const { count: totalPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });
    
  const { count: publishedPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  const { count: tweetedPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("tweeted", true);

  return (
    <div className="pt-2">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-white/60 mb-2 tracking-tight">Mission Control</h1>
        <p className="text-gray-500 dark:text-white/40 font-medium">Overview of your autonomous ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-white/[0.02] p-8 rounded-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)] hover:border-purple-300 dark:hover:border-purple-500/30 transition-all duration-300 shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 p-6 text-purple-200 dark:text-purple-500/20 group-hover:text-purple-500 dark:group-hover:text-purple-500/40 transition-colors">
            <Database size={24} />
          </div>
          <p className="text-sm font-semibold text-gray-500 dark:text-white/50 mb-3 uppercase tracking-wider">Total AI Posts</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 dark:group-hover:from-purple-400 dark:group-hover:to-indigo-400 transition-all duration-300">{totalPosts || 0}</p>
        </div>
        
        <div className="bg-white dark:bg-white/[0.02] p-8 rounded-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(34,211,238,0.1)] hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-all duration-300 shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 p-6 text-cyan-200 dark:text-cyan-500/20 group-hover:text-cyan-500 dark:group-hover:text-cyan-500/40 transition-colors">
             <TrendingUp size={24} />
          </div>
          <div className="absolute left-0 top-0 w-1 h-full bg-cyan-400 dark:bg-cyan-500/50 hidden group-hover:block" />
          <p className="text-sm font-semibold text-gray-500 dark:text-white/50 mb-3 uppercase tracking-wider">Published Vectors</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white">{publishedPosts || 0}</p>
        </div>
        
        <div className="bg-white dark:bg-white/[0.02] p-8 rounded-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(29,161,242,0.1)] hover:border-[#1DA1F2]/30 transition-all duration-300 shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 p-6 text-[#1DA1F2]/20 group-hover:text-[#1DA1F2] dark:group-hover:text-[#1DA1F2]/40 transition-colors">
            <Twitter size={24} />
          </div>
          <p className="text-sm font-semibold text-gray-500 dark:text-white/50 mb-3 uppercase tracking-wider">Pushed to X</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white">{tweetedPosts || 0}</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-white/[0.02] p-8 md:p-10 rounded-2xl border border-gray-100 dark:border-white/5 backdrop-blur-md shadow-2xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">System Status</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <Server size={18} className="text-gray-400 dark:text-white/40" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/70">Supabase Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-xs text-green-700 dark:text-white/50 font-bold uppercase tracking-widest hidden sm:block">Active</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <CheckCircle2 size={18} className="text-gray-400 dark:text-white/40" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/70">Anthropic Claude API</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              <span className="text-xs text-purple-700 dark:text-white/50 font-bold uppercase tracking-widest hidden sm:block">Ready</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <Clock size={18} className="text-gray-400 dark:text-white/40" />
              <span className="text-sm font-medium text-gray-700 dark:text-white/70">Vercel Cron Trigger (6hr)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              <span className="text-xs text-cyan-700 dark:text-white/50 font-bold uppercase tracking-widest hidden sm:block">Scheduled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
