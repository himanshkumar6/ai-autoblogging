"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Wand2, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium Admin Sidebar (Highly Responsive V2)
 * Features:
 * - Mobile (<640px): Full Drawer (w-64) with Backdrop
 * - Tablet (640px-1024px): Compact Mode (w-20) Icons Only
 * - Desktop (>1024px): Full Sidebar (w-64)
 */
export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() || "";
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts Database", href: "/admin/posts", icon: FileText },
    { name: "AI Generator", href: "/admin/generate", icon: Wand2 },
  ];

  const NavItem = ({ item, onClick, isCompact }: { item: any; onClick?: () => void; isCompact?: boolean }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link 
        href={item.href} 
        onClick={onClick} 
        title={isCompact ? item.name : ""}
        className={`
          group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 w-full text-left
          ${isActive 
            ? "bg-gray-100 dark:bg-white/[0.08] text-gray-900 dark:text-white shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-gray-200 dark:border-white/5"
            : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02] border border-transparent"
          }
          ${isCompact ? "justify-center px-0" : ""}
        `}
      >
        {isActive && !isCompact && (
          <div className="absolute left-[-12px] w-1.5 h-8 bg-purple-500 rounded-r-2xl shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
        )}
        
        <Icon size={isCompact ? 22 : 20} className={`${isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-white"} transition-colors shrink-0`} />
        
        {!isCompact && (
          <>
            <span className="flex-1 truncate">{item.name}</span>
            <ChevronRight size={16} className={`${isActive ? "opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0"} transition-all`} />
          </>
        )}

        {/* Compact Tooltip */}
        {isCompact && (
          <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-black rounded-lg opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none z-50 whitespace-nowrap shadow-xl">
            {item.name}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
          </div>
        )}
      </Link>
    );
  };

  if (!mounted) return null;

  return (
    <>
      {/* 1. Mobile Header (Fixed Top) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-gray-200 dark:border-white/5 z-[60]">
        <div className="flex flex-col">
          <span className="text-xl font-black font-sans tracking-tighter text-gray-900 dark:text-white leading-none">
            Ai<span className="text-purple-600 dark:text-purple-400">Blog</span>
          </span>
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[.25em] mt-1">Admin Portal</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-900 dark:text-white p-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all active:scale-95 border border-gray-200 dark:border-white/5"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 2. Sidebar Implementation */}
      <AnimatePresence mode="wait">
        <aside 
          className={`
            fixed top-0 left-0 h-screen transition-all duration-500 ease-in-out z-[70]
            bg-white dark:bg-[#050505] border-r border-gray-200 dark:border-white/5 shadow-2xl
            flex flex-col
            ${isOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0"}
            ${!isOpen ? "md:w-20 lg:w-64" : "w-64"}
          `}
        >
          {/* Logo Section */}
          <div className={`h-24 flex flex-col justify-center border-b border-gray-200 dark:border-white/5 transition-all ${(!isOpen && "md:items-center px-0") || "px-8"}`}>
            <Link href="/admin" className="block relative group">
              <div className="flex flex-col">
                <span className={`font-black tracking-tighter text-gray-900 dark:text-white leading-none transition-all ${(!isOpen && "text-xl md:text-2xl") || "text-2xl"}`}>
                  Ai<span className="text-purple-600 dark:text-purple-400">Blog</span>
                </span>
                {(isOpen || mounted && window.innerWidth >= 1024) && (
                  <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[.3em] mt-2 opacity-80">Admin Portal</p>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto px-4 py-8 space-y-12 custom-scrollbar ${(!isOpen && "md:px-2") || "px-4"}`}>
            {/* MAIN MENU SECTION */}
            <div>
              {(isOpen || window.innerWidth >= 1024) && (
                <p className="px-4 mb-6 text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">Main Menu</p>
              )}
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <NavItem 
                    key={item.href} 
                    item={item} 
                    onClick={() => setIsOpen(false)} 
                    isCompact={!isOpen && window.innerWidth >= 768 && window.innerWidth < 1024}
                  />
                ))}
              </div>
            </div>

            {/* SYSTEM SECTION */}
            <div>
              <div className={`px-4 mb-6 flex justify-between items-center text-gray-400 dark:text-gray-500 ${(!isOpen && "md:justify-center md:px-0") || ""}`}>
                {(isOpen || window.innerWidth >= 1024) && (
                  <p className="text-[11px] font-black uppercase tracking-[0.4em]">System</p>
                )}
                {(isOpen || window.innerWidth >= 1024) && (
                  <button 
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  >
                    {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <NavItem 
                  item={{ name: "Settings", href: "/admin/settings", icon: Settings }} 
                  onClick={() => setIsOpen(false)} 
                  isCompact={!isOpen && window.innerWidth >= 768 && window.innerWidth < 1024}
                />
              </div>
            </div>
          </nav>

          {/* User Section */}
          <div className={`p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.01] ${(!isOpen && "md:p-2") || "p-4"}`}>
            <div className={`relative group p-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 mb-4 overflow-hidden transition-all ${(!isOpen && "md:p-3 md:justify-center") || ""}`}>
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 dark:bg-purple-500 p-0.5 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20 shrink-0">
                  <span className="bg-white dark:bg-[#050505] w-full h-full rounded-[14px] flex items-center justify-center text-purple-600 dark:text-white">
                    {userEmail?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                {(isOpen || window.innerWidth >= 1024) && (
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-900 dark:text-white font-black truncate leading-none mb-2">{userEmail.split('@')[0]}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-widest font-black">Online</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <form action="/auth/signout" method="POST">
              <button 
                type="submit" 
                className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-black text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-500/20 ${(!isOpen && "md:px-0") || ""}`}
              >
                <LogOut size={18} />
                {(isOpen || window.innerWidth >= 1024) && <span>Logout</span>}
              </button>
            </form>
          </div>
        </aside>
      </AnimatePresence>

      {/* 3. Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[65]" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

