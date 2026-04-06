// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuthUser } from '../lib/auth'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isProfileLoading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isProfileLoading: false,
})

/** Fetch extended profile (role, cb_id) from the users table. */
async function fetchProfile(
  userId: string
): Promise<{ role?: AuthUser["role"]; cb_id?: string; full_name?: string }> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("role, cb_id, full_name")
      .eq("id", userId)
      .maybeSingle();
    if (error) console.error("fetchProfile error:", error)
    console.log("fetchProfile result:", data)
    return data ?? {};
  } catch (err) {
    console.error("fetchProfile exception:", err)
    return {};
  }
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    // Safety net — never leave the app stuck in loading
    const safetyTimer = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 5000);

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setIsLoading(false);
        setIsProfileLoading(false);
        queryClient.setQueryData(["auth", "user"], null);
        clearTimeout(safetyTimer);
        return;
      }

      // Resolve loading immediately with base session data
      const baseUser: AuthUser = {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name,
      };

      // Only replace user if ID changed, OR if we have no role yet
      setUser((prev) => (prev?.id === baseUser.id && prev?.role ? prev : baseUser));
      setIsLoading(false); // ← unblock the UI right away
      clearTimeout(safetyTimer);
      queryClient.setQueryData(["auth", "user"], baseUser);

      // Check if we already have an enriched user with a role (e.g. on token refresh)
      // to avoid redundant DB calls and the isProfileLoading flash
      setUser((currentUser) => {
        if (currentUser?.id === session.user.id && currentUser?.role) {
          // Already enriched — skip fetch
          queryClient.setQueryData(["auth", "user"], currentUser);
          return currentUser;
        }
        // Need to fetch — kick it off asynchronously
        setIsProfileLoading(true);
        fetchProfile(session.user.id).then((profile) => {
          if (!mounted) return;
          const enrichedUser: AuthUser = {
            ...baseUser,
            name: profile.full_name ?? baseUser.name,
            role: profile.role,
            cb_id: profile.cb_id,
          };
          setUser(enrichedUser);
          setIsProfileLoading(false);
          queryClient.setQueryData(["auth", "user"], enrichedUser);
        });
        return baseUser;
      });
    });

    return () => {
      mounted = false
      clearTimeout(safetyTimer)
      data.subscription.unsubscribe()
    }
  }, [queryClient]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, isLoading, isProfileLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
