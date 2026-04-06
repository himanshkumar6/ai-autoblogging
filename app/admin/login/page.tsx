"use client";

import { createClient } from "@/lib/supabase/client";
import GlassCard from "@/components/GlassCard";
import { Lock, AlertCircle } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Error messages for each error code returned by the callback route
const ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "Authentication failed. The session could not be established. Please try again.",
  oauth_cancelled: "Login was cancelled. Please try again.",
  server_error: "A server error occurred. Please try again later.",
};

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Show error from callback redirect (e.g. ?error=auth_failed)
  useEffect(() => {
    const errorCode = searchParams.get("error");
    if (errorCode) {
      setError(ERROR_MESSAGES[errorCode] ?? "An unexpected error occurred. Please try again.");
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Must point to /auth/callback — Supabase exchanges the OAuth code
          // for a session cookie here, then redirects to /admin.
          // Using window.location.origin ensures this works on both
          // localhost:3000 and production without hardcoding any URL.
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) throw oauthError;
      // If no error, the browser is being redirected to Google by Supabase.
      // We keep the loading spinner active during the redirect.
    } catch (err: any) {
      console.error("OAuth error:", err);
      setError(err?.message || "Failed to initiate Google login. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <GlassCard className="p-6 md:p-8 w-full max-w-md mx-auto text-center relative shadow-2xl border border-white/10 dark:!bg-[#111]/80">
        <div className="mx-auto w-12 h-12 bg-accent-blue/20 rounded-full flex items-center justify-center mb-6">
          <Lock size={20} className="text-accent-cyan" />
        </div>

        <h1 className="text-2xl font-black text-primary tracking-tight mb-2">Admin Portal</h1>
        <p className="text-sm text-secondary mb-8">Sign in with your authorized Google account to access mission control.</p>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 text-left bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full relative flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          {isLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>
      </GlassCard>
    </div>
  );
}

// useSearchParams requires a Suspense boundary in Next.js App Router
export default function AdminLogin() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
