import { createClient } from '@supabase/supabase-js'

/**
 * Build-safe Supabase Client Getter
 * 
 * This ensures process.env is only accessed at runtime and prevents
 * build-time crashes on Vercel if variables are missing during static analysis.
 */
export function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Deprecated: Use getSupabase() instead.
export const supabase = (typeof window !== 'undefined' || process.env.NODE_ENV === 'test') 
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
  : null as any;
