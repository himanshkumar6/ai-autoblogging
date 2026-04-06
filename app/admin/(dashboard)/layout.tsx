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

  // Guard: Redirect to login if unauthenticated
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      
      {/* 1. Global Background System */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        {/* Animated deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0b0b1a] to-[#1a1a2e]" />
        
        {/* Subtle glowing mesh overlays */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse duration-[8000ms]" />
      </div>

      {/* 2. Floating Particle System */}
      <ParticleBackground />

      {/* 3. Fixed Sidebar Component */}
      <AdminSidebar userEmail={user.email!} />

      {/* 4. Main Content Area */}
      {/* Lg:ml-64 creates the required space for the fixed sidebar */}
      <main className="lg:ml-64 flex-1 min-h-screen relative pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
