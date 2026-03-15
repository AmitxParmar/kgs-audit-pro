import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const supabaseUrl = env.SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || 'development_key'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export const supabaseAdmin = supabase
