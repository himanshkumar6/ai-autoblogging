import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Or service role key for backend inserts if needed

// In a real production app, service role key should be used for the backend /cron
// For Next.js backend routes (auto-run API), we might want a server client.
// We will define both if necessary.

export const supabase = createClient(supabaseUrl, supabaseKey)
