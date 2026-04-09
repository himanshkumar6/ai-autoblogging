import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = [
  "admin@nexuspulse.local",
  process.env.ADMIN_EMAIL || ""
].filter(Boolean);

/**
 * Dual-Layer Authentication Utility
 * 1. Internal Secret: For server-to-server automation (auto-run)
 * 2. User Session: For manual dashboard usage by admins
 */
export async function checkAdminAuth(request: Request): Promise<boolean> {
  // 1. Check for Internal API Secret (Automation Bypass)
  const internalSecret = request.headers.get("x-internal-secret");
  const expectedSecret = process.env.INTERNAL_API_SECRET;

  if (expectedSecret && internalSecret === expectedSecret) {
    console.log("[Auth] Authorized via internal secret.");
    return true;
  }

  // 2. Fallback to Supabase User Session (Manual Dashboard)
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && ADMIN_EMAILS.includes(user.email || "")) {
      console.log(`[Auth] Authorized via admin session: ${user.email}`);
      return true;
    }
  } catch (error) {
    console.error("[Auth Error] Supabase session check failed:", error);
  }

  console.warn("[Auth Fail] Unauthorized access attempt.");
  return false;
}
