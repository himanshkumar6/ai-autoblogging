import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client for backend/server-side operations.
 * This bypasses Row Level Security (RLS) and has full DB access.
 * NEVER expose this client or key to the browser.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
