import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client generator for backend/server-side operations.
 * This bypasses Row Level Security (RLS) and has full DB access.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Return a proxy or dummy client during build time if env is missing
    // or just let it fail at runtime.
    if (process.env.NODE_ENV === 'production' && !key) {
      console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Admin operations will fail.");
    }
  }

  return createClient(url!, key!);
}

// Keep the export for compatibility but it should be avoided if possible. 
// Preferred way is calling getSupabaseAdmin() inside handlers.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);
