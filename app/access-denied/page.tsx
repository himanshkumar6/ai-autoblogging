"use client";

import Link from "next/link";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import { ShieldAlert, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccessDenied() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
    }
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    // Optionally refresh router to re-evaluate server components
    router.refresh();
  };

  return (
    <Container className="min-h-[80vh] flex items-center justify-center relative z-10">
      <GlassCard className="p-12 md:p-16 text-center max-w-lg mx-auto flex flex-col items-center shadow-xl border border-white/10 dark:!bg-[#111]/80">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/20 blur-[50px] rounded-full point-events-none -z-10" />

        <div className="text-red-500 mb-6 bg-red-500/10 p-4 rounded-full">
          <ShieldAlert size={48} />
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-4">
          Access Denied
        </h1>
        
        <p className="text-secondary text-base mb-6 leading-relaxed">
          Your Google account is successfully authenticated, but it is not whitelisted for Admin privileges. Please choose another account.
        </p>

        {email && (
          <div className="bg-black/5 dark:bg-white/5 px-4 py-3 rounded-lg mb-10 w-full">
            <p className="text-sm font-medium text-gray-500">
              You are logged in as: <span className="text-gray-900 dark:text-white font-bold">{email}</span>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button
            onClick={handleLogout}
            className="group relative flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-6 py-3 w-full sm:w-auto text-sm font-bold text-red-500 hover:bg-red-500/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            <LogOut size={16} />
            Logout & Try Again
          </button>
          
          <Link
            href="/admin/login"
            className="group relative flex items-center justify-center gap-2 rounded-xl bg-white/5 dark:bg-white/10 px-6 py-3 w-full sm:w-auto text-sm font-bold text-primary border border-black/10 dark:border-white/10 transition-all duration-300 hover:scale-[0.98] hover:bg-black/5 dark:hover:bg-white/20"
          >
            Go to Login
          </Link>
        </div>
      </GlassCard>
    </Container>
  );
}
