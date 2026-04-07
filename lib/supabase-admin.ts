import { createClient } from '@supabase/supabase-js'

/**
 * Build-safe Admim Supabase Client Getter
 * 
 * Ensures process.env is only accessed at runtime and prevents
 * build-time crashes if SUPABASE_SERVICE_ROLE_KEY is missing during static analysis.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    if (process.env.NODE_ENV === 'production' && !key) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing. Admin operations will fail.")
    }
    // Return a dummy client during build time if env is missing
    return createClient(url || 'https://placeholder.supabase.co', key || 'placeholder')
  }

  return createClient(url, key)
}

// Deprecated: Use getSupabaseAdmin() instead.
export const supabaseAdmin = (process.env.SUPABASE_SERVICE_ROLE_KEY) 
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  : null as any;
