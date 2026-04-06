import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 flex flex-col md:flex-row relative z-50">
      
      {/* Light/Dark Vibrant Bokeh Effect Background */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none bg-slate-50 dark:bg-[#060813] transition-colors duration-500">
        {/* Soft glowing orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[10000ms]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-300/30 dark:bg-cyan-600/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-indigo-300/30 dark:bg-indigo-600/10 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[15000ms]" />
      </div>

      {/* Admin Sidebar with mobile responsiveness */}
      <AdminSidebar userEmail={user?.email || "Admin@cryptonews.local"} />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden p-6 md:p-10 relative">
        <div className="max-w-5xl mx-auto w-full pt-4 md:pt-8 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
