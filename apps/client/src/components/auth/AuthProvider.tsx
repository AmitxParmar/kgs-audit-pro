import { ReactNode, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

interface AuthProviderProps {
  children: ReactNode
}



export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading } = useAuth()

  useEffect(() => {
    // Auth state is handled by the useAuth hook
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}


interface RoleRouteProps {
  children: ReactNode
  allowedRoles: string[]
}

export function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) return <Navigate to="/login" replace />

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />   // redirect to their own dashboard
  }

  return <>{children}</>
}

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
