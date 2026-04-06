import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth Callback Handler
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  console.log(`[DEBUG] /auth/callback triggered. Code present: ${!!code}. Host: ${origin}`);

  if (!code) {
    console.error("[auth/callback] No code param found in URL. OAuth likely cancelled.");
    return NextResponse.redirect(`${origin}/admin/login?error=oauth_cancelled`);
  }

  try {
    const supabase = createClient();
    console.log(`[DEBUG] Attempting exchangeCodeForSession...`);
    
    // Convert the single-use code from Google into an encrypted session cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] Exchange failed:", error.message);
      const params = new URLSearchParams({
        error: "auth_failed",
        details: error.message,
      });
      return NextResponse.redirect(`${origin}/admin/login?${params}`);
    }

    console.log(`[DEBUG] exchangeCodeForSession successful. Redirecting to: ${next}`);

    // Session successfully established!
    return NextResponse.redirect(`${origin}${next}`);
  } catch (err: any) {
    console.error("[auth/callback] Unexpected error during exchange:", err);
    const params = new URLSearchParams({
      error: "server_error",
      details: err?.message || "Unknown error",
    });
    return NextResponse.redirect(`${origin}/admin/login?${params}`);
  }
}
