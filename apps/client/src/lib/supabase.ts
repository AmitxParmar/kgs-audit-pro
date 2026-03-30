import { createClient } from "@supabase/supabase-js";

<<<<<<< Updated upstream
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

// Optional debug logs
console.log('Supabase URL:', supabaseUrl)
console.log('Anon key length:', supabaseAnonKey.length)
=======
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}
>>>>>>> Stashed changes

// hosted-only guard
if (supabaseUrl.includes("127.0.0.1") || supabaseUrl.includes("localhost")) {
  throw new Error(`Hosted-only mode: refusing local Supabase URL: ${supabaseUrl}`);
}

// Temporary debug — remove after fixing
console.log("Supabase URL:", supabaseUrl);
console.log("Anon key starts with:", supabaseAnonKey.slice(0, 20));
console.log("Anon key length:", supabaseAnonKey.length);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
<<<<<<< Updated upstream
    storageKey:        'kgs-audit-pro-auth',
  }
})
=======
    storageKey: "kgs-audit-pro-auth",
  },
});
>>>>>>> Stashed changes
