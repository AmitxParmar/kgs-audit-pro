import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, AuthUser } from '../lib/auth'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
export function useAuth() {
  const queryClient               = useQueryClient()
 // const navigate                  = useNavigate()
  const [user, setUser]           = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

export function useAuth() {
  const { user, isLoading } = useAuthContext()  // ← just read context
  const queryClient = useQueryClient()
  // ── Login ─────────────────────────────────────────────────────────────────
  // mutationFn returns the full Supabase data object so AuthForm can
  // read data.session and navigate immediately — no race condition
  const loginMutation = useMutation({
    mutationFn: authService.login,          // returns { user, session }
    onSuccess: (data) => {
      if (data.user) {
        const authUser: AuthUser = {
          id:    data.user.id,
          email: data.user.email!,
          name:  data.user.user_metadata?.name,
          role:  data.user.user_metadata?.role,   // role comes via onAuthStateChange
        }
        setUser(authUser)
        setIsLoading(false)
        queryClient.setQueryData(['auth', 'user'], authUser)
      }
    },
  })

  // ── Signup ────────────────────────────────────────────────────────────────
  const signupMutation = useMutation({
    mutationFn: authService.signup,         // returns { user, session }
    onSuccess: (data) => {
      if (data.user && data.session) {
        const authUser: AuthUser = {
          id:    data.user.id,
          email: data.user.email!,
          name:  data.user.user_metadata?.name,
        }
        setUser(authUser)
        setIsLoading(false)
      }
    },
  })

  const resetPasswordMutation  = useMutation({ mutationFn: authService.resetPassword })
  const updatePasswordMutation = useMutation({ mutationFn: authService.updatePassword })

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
    isLoading,
    login:               loginMutation.mutateAsync,   // returns data to caller
    signup:              signupMutation.mutateAsync,  // returns data to caller
    resetPassword:       resetPasswordMutation.mutateAsync,
    updatePassword:      updatePasswordMutation.mutateAsync,
    logout:              logoutMutation.mutateAsync,
    isLoggingIn:         loginMutation.isPending,
    isSigningUp:         signupMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isUpdatingPassword:  updatePasswordMutation.isPending,
    isLoggingOut:        logoutMutation.isPending,
    loginError:          loginMutation.error,
    signupError:         signupMutation.error,
    resetPasswordError:  resetPasswordMutation.error,
    updatePasswordError: updatePasswordMutation.error,
  }
}
