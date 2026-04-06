"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Wand2, LogOut, Settings, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive 
        ? "bg-gradient-to-r from-purple-600/10 dark:from-purple-600/20 to-indigo-600/5 dark:to-indigo-600/10 text-purple-700 dark:text-white border border-purple-500/10 dark:border-purple-500/20 shadow-[0_3px_15px_rgba(124,58,237,0.05)] dark:shadow-[0_0_15px_rgba(124,58,237,0.1)]" 
        : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
    }`;
  };

  return (
    <>
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 relative z-50">
        <span className="text-lg font-black tracking-tighter text-gray-900 dark:text-white">
          Crypto<span className="text-purple-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:to-indigo-400">News</span>
        </span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-white p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Desktop Persistent, Mobile absolute overlay) */}
      <aside className={`
        fixed md:relative top-0 left-0 w-64 h-full bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 flex-shrink-0 flex flex-col z-[100] transition-transform duration-300 md:translate-x-0 shadow-2xl md:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-20 hidden md:flex items-center px-8 border-b border-gray-200 dark:border-white/[0.06] shrink-0">
          <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
            Crypto<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">News</span>
          </span>
        </div>
        
        {/* Mobile close button inside sidebar */}
        <div className="md:hidden absolute top-4 right-4 text-gray-500 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-full transition-colors" onClick={() => setIsOpen(false)}>
           <X size={24} />
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 mt-10 md:mt-0">
          <Link onClick={() => setIsOpen(false)} href="/admin" className={getLinkClasses("/admin")}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/admin/posts" className={getLinkClasses("/admin/posts")}>
            <FileText size={18} />
            Posts Database
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/admin/generate" className={getLinkClasses("/admin/generate")}>
            <Wand2 size={18} className={pathname === "/admin/generate" ? "animate-pulse text-purple-400" : ""} />
            AI Generator
          </Link>
          
          <div className="pt-8 pb-3 px-4 flex justify-between items-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/40">Configuration</p>
            {mounted && (
              <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
          </div>
          
          <Link onClick={() => setIsOpen(false)} href="/admin/settings" className={getLinkClasses("/admin/settings")}>
            <Settings size={18} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/[0.06] shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-white/[0.03] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-[0_3px_10px_rgba(124,58,237,0.3)]">
              {userEmail.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-800 dark:text-white/90 font-medium truncate">{userEmail}</p>
              <p className="text-[10px] text-gray-500 dark:text-white/40 uppercase tracking-widest mt-0.5 font-semibold">Active Session</p>
            </div>
          </div>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-white/60 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-transparent active:scale-95">
              <LogOut size={16} />
              Secure Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[90] md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
