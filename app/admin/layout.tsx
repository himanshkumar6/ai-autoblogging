export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/AdminSidebar";
import ParticleBackground from "@/components/ParticleBackground";
import { redirect } from "next/navigation";

/**
 * app/admin/layout.tsx — Premium Dashboard Layout (Root)
 * 
 * Fixed theme support:
 * - Adaptive background (Light/Dark)
 * - Optimized content spacing
 */
export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware handles all redirects for /admin and /admin/login.
  // We only fetch the user here for the Sidebar and other UI components.
  const safeUser = typeof user === 'object' && user !== null ? user : null;


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500 selection:bg-purple-500/30">
      
      {/* 1. Global Background System */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        {/* Dark Mode Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0b0b1a] to-[#1a1a2e] dark:opacity-100 opacity-0 transition-opacity duration-700" />
        
        {/* Light Mode Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-purple-50 dark:opacity-0 opacity-100 transition-opacity duration-700" />
        
        {/* Subtle Glowing Mesh (Theme Adaptive) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 dark:bg-purple-500/10 blur-[120px] animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 dark:bg-blue-500/10 blur-[120px] animate-pulse duration-[8000ms]" />
      </div>

      {/* 2. Floating Particle System */}
      <ParticleBackground />

      {/* 3. Fixed Sidebar Component */}
      <AdminSidebar userEmail={safeUser?.email || ""} />

      {/* 4. Main Content Area */}
      <main className="lg:ml-64 flex-1 min-h-screen relative pt-20 lg:pt-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
