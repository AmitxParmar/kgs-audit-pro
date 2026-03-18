import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, AuthUser } from '../lib/auth'
import { useState, useEffect } from 'react'

export function useAuth() {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user)
      queryClient.setQueryData(['auth', 'user'], user)
    })

    return () => subscription.unsubscribe()
  }, [queryClient])

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
        })
      }
    },
  })

  const signupMutation = useMutation({
    mutationFn: authService.signup,
  })

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
  })

  const updatePasswordMutation = useMutation({
    mutationFn: authService.updatePassword,
  })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setUser(null)
      queryClient.clear()
    },
  })

  return {
    user,
    isLoading: !user,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    updatePassword: updatePasswordMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isUpdatingPassword: updatePasswordMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    updatePasswordError: updatePasswordMutation.error,
  }
}
