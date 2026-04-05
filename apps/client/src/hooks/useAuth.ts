import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, AuthUser } from '../lib/auth'
import { useAuthContext } from '../context/AuthContext'

export function useAuth() {
  const { user, isLoading } = useAuthContext()
  const queryClient = useQueryClient()

  // ── Login ──────────────────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.user) {
        const authUser: AuthUser = {
          id:    data.user.id,
          email: data.user.email!,
          name:  data.user.user_metadata?.name,
          role:  data.user.user_metadata?.role,
        }
        queryClient.setQueryData(['auth', 'user'], authUser)
      }
    },
  });

  // ── Signup ─────────────────────────────────────────────────────────────
  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      if (data.user && data.session) {
        const authUser: AuthUser = {
          id:    data.user.id,
          email: data.user.email!,
          name:  data.user.user_metadata?.name,
        }
        queryClient.setQueryData(['auth', 'user'], authUser)
      }
    },
  })

  const resetPasswordMutation  = useMutation({ mutationFn: authService.resetPassword })
  const updatePasswordMutation = useMutation({ mutationFn: authService.updatePassword })

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear()
    },
  });

  return {
    user,
    isLoading,
    login:               loginMutation.mutateAsync,
    signup:              signupMutation.mutateAsync,
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
