import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// Temporary debug — remove after fixing
//console.log('Supabase URL:', supabaseUrl)
//console.log('Anon key starts with:', supabaseAnonKey?.slice(0, 20))
//console.log('Anon key length:', supabaseAnonKey?.length)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — add them in Vercel → Settings → Environment Variables and redeploy.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true,
    storageKey:        'kgs-audit-pro-auth',  // ← unique key avoids conflicts
  }
})