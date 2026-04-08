export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/AdminSidebar";
import ParticleBackground from "@/components/ParticleBackground";
import { redirect } from "next/navigation";

/**
 * app/admin/(dashboard)/layout.tsx — Premium Dashboard Layout
 * 
 * Features:
 * - Persistent fixed sidebar (lg:w-64)
 * - Main content auto-offset (lg:ml-64)
 * - Deep SaaS-grade gradient background
 * - Particle system integration
 * - Max-width container for content focus
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirects are handled by middleware.
  const safeUser = typeof user === 'object' && user !== null ? user : null;


  return (
    <div className="min-h-screen text-gray-900 dark:text-white selection:bg-purple-500/30 w-full overflow-hidden relative">
      
      {/* 1. Global Background System - Tied definitively to the root wrapper! */}
      <div className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-[#050505] dark:via-[#0b0b1a] dark:to-[#1a1a2e] -z-50 pointer-events-none" />
      
      {/* Ambient glow mesh locked definitively to screen size */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] animate-pulse duration-[8000ms]" />
      </div>

      {/* 2. Floating Particle System */}
      <ParticleBackground />

      {/* 3. Fixed Sidebar Component */}
      <AdminSidebar userEmail={safeUser?.email || ""} />

      {/* 5. Main Content Area */}
      {/* 
          Responsive Margin Rules:
          - ml-0 (Mobile): Overlay sidebar
          - md:ml-20 (Tablet): Compact icon sidebar
          - lg:ml-64 (Desktop): Full sidebar
      */}
      <main className="flex-1 min-h-screen relative transition-all duration-500 ease-in-out ml-0 md:ml-20 lg:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
