import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, AuthUser } from '../lib/auth'
import { useState, useEffect } from 'react'

export function useAuth() {
  const queryClient = useQueryClient()
  const [user, setUser]           = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)  // ← own state, not derived from user

  useEffect(() => {
    // Safety net — never spin longer than 5s
    const timeout = setTimeout(() => setIsLoading(false), 5000)

    // 1. Check if there's an existing session on page load
    authService.getSession()
      .then((sessionUser) => {
        setUser(sessionUser)
        queryClient.setQueryData(['auth', 'user'], sessionUser)
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false)       // ← always resolves, even if null
        clearTimeout(timeout)
      })

    // 2. Listen for login/logout changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user)
      setIsLoading(false)         // ← also resolves on any auth event
      queryClient.setQueryData(['auth', 'user'], user)
    })

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [queryClient])

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.user) {
        const authUser = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
        }
        setUser(authUser)
        setIsLoading(false)
      }
    },
  })

  const signupMutation        = useMutation({ mutationFn: authService.signup })
  const resetPasswordMutation = useMutation({ mutationFn: authService.resetPassword })
  const updatePasswordMutation= useMutation({ mutationFn: authService.updatePassword })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setUser(null)
      setIsLoading(false)
      queryClient.clear()
    },
  })

  return {
    user,
    isLoading,                              // ← now a proper boolean, not !user
    login:           loginMutation.mutateAsync,
    signup:          signupMutation.mutateAsync,
    resetPassword:   resetPasswordMutation.mutateAsync,
    updatePassword:  updatePasswordMutation.mutateAsync,
    logout:          logoutMutation.mutateAsync,
    isLoggingIn:     loginMutation.isPending,
    isSigningUp:     signupMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isUpdatingPassword:  updatePasswordMutation.isPending,
    isLoggingOut:    logoutMutation.isPending,
    loginError:      loginMutation.error,
    signupError:     signupMutation.error,
    resetPasswordError:   resetPasswordMutation.error,
    updatePasswordError:  updatePasswordMutation.error,
  }
}