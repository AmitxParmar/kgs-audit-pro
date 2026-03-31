// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { authService, AuthUser } from '../lib/auth'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, isLoading: true })

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const sessionUser = await authService.getSession()
        if (!mounted) return
        setUser(sessionUser)
        queryClient.setQueryData(['auth', 'user'], sessionUser)
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    initAuth()

    // ✅ Only ONE subscription, ever
    const { data } = authService.onAuthStateChange((authUser) => {
      if (!mounted) return
      setUser(authUser)
      setIsLoading(false)
      queryClient.setQueryData(['auth', 'user'], authUser)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [queryClient])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// ✅ This replaces useAuth's state/effect — just reads from context
export function useAuthContext() {
  return useContext(AuthContext)
}