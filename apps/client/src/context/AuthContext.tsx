// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { AuthUser } from "../lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
});

/** Fetch extended profile (role, cb_id) from the users table. */
async function fetchProfile(
  userId: string
): Promise<{ role?: AuthUser["role"]; cb_id?: string; full_name?: string }> {
  try {
    const { data } = await supabase
      .from("users")
      .select("role, cb_id, full_name")
      .eq("id", userId)
      .maybeSingle();
    return data ?? {};
  } catch {
    return {};
  }
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    /**
     * Supabase v2 fires onAuthStateChange with INITIAL_SESSION immediately
     * on subscription. We rely on that as the primary source of truth and
     * use getSession() only as a fast-path fallback.
     *
     * Strategy:
     *  1. Subscribe to onAuthStateChange — it fires INITIAL_SESSION quickly.
     *  2. In the callback, set the user from the session immediately
     *     (so isLoading resolves fast), then enrich with profile in background.
     *  3. Safety timeout: if nothing fires within 5s, stop loading anyway.
     */

    // Safety net — never leave the app stuck in loading
    const safetyTimer = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 5000);

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setIsLoading(false);
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
      setUser(baseUser);
      setIsLoading(false); // ← unblock the UI right away
      clearTimeout(safetyTimer);
      queryClient.setQueryData(["auth", "user"], baseUser);

      // Enrich with profile data in the background (non-blocking)
      const profile = await fetchProfile(session.user.id);
      if (!mounted) return;

      const enrichedUser: AuthUser = {
        ...baseUser,
        name: profile.full_name ?? baseUser.name,
        role: profile.role,
        cb_id: profile.cb_id,
      };
      setUser(enrichedUser);
      queryClient.setQueryData(["auth", "user"], enrichedUser);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      data.subscription.unsubscribe();
    };
  }, [queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
