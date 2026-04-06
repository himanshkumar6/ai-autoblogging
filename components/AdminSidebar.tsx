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
 * Premium Admin Sidebar
 * Features:
 * - Fixed full-height glassmorphic design
 * - Theme-aware (Dark/Light mode support)
 * - Updated Logo (AiBlog) + Subtitle (Admin Portal)
 */
export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Posts Database", href: "/admin/posts", icon: FileText },
    { name: "AI Generator", href: "/admin/generate", icon: Wand2 },
  ];

  const configItems = [
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const NavItem = ({ item, onClick }: { item: any; onClick?: () => void }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link 
        href={item.href} 
        onClick={onClick}
        className={`
          group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
          ${isActive 
            ? "bg-purple-600/10 dark:bg-white/10 text-purple-700 dark:text-white shadow-lg shadow-purple-500/10 border border-purple-500/20 dark:border-white/10" 
            : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5 border border-transparent"
          }
        `}
      >
        <Icon size={18} className={`${isActive ? "text-purple-600 dark:text-purple-400" : "group-hover:text-purple-500 dark:group-hover:text-purple-300"} transition-colors`} />
        <span className="flex-1">{item.name}</span>
        {isActive && (
          <motion.div 
            layoutId="activeIndicator"
            className="absolute left-0 w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full"
          />
        )}
        <ChevronRight size={14} className={`${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"} transition-opacity`} />
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-black/40 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 z-[60]">
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tighter text-gray-900 dark:text-white leading-none">
            Ai<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Blog</span>
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Admin Portal</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-900 dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <AnimatePresence>
        {(isOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.aside 
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`
              fixed top-0 left-0 w-64 h-screen 
              bg-white/90 dark:bg-[#0a0a0f]/80 backdrop-blur-3xl 
              border-r border-gray-200 dark:border-white/5 
              flex flex-col z-[70]
              ${isOpen ? "shadow-2xl shadow-purple-500/10" : ""}
            `}
          >
            {/* Logo Section */}
            <div className="h-24 flex flex-col justify-center px-8 border-b border-gray-200 dark:border-white/5">
              <Link href="/admin" className="block">
                <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                  Ai<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Blog</span>
                </span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 ml-0.5">Admin Portal</p>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-8 custom-scrollbar">
              <div>
                <p className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Main Menu</p>
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <NavItem key={item.href} item={item} onClick={() => setIsOpen(false)} />
                  ))}
                </div>
              </div>

              <div>
                <div className="px-4 mb-4 flex justify-between items-center text-gray-400 dark:text-gray-500">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">System</p>
                  {mounted && (
                    <button 
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400"
                    >
                      {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {configItems.map((item) => (
                    <NavItem key={item.href} item={item} onClick={() => setIsOpen(false)} />
                  ))}
                </div>
              </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-200 dark:border-white/5">
              <div className="relative group p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
                    <span className="bg-white dark:bg-[#0a0a0f] w-full h-full rounded-full flex items-center justify-center text-purple-600 dark:text-white">
                      {userEmail?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-900 dark:text-white font-bold truncate leading-none mb-1.5">{userEmail}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Authorized</p>
                    </div>
                  </div>
                </div>
              </div>

              <form action="/auth/signout" method="POST">
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
                >
                  <LogOut size={16} />
                  Secure Logout
                </button>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[65]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
