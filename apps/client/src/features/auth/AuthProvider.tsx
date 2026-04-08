// src/components/auth/AuthProvider.tsx
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

const PUBLIC_PATHS = ['/', '/audit-schedule', '/iaf-schedule', '/reset-password']

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading } = useAuthContext()
  const isPublic = PUBLIC_PATHS.includes(window.location.pathname)

  if (isLoading && !isPublic) {
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
  const { user, isLoading } = useAuthContext()

  if (isLoading) return null
  if (!user) return <Navigate to="/" replace />
  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export function GuestRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthContext()

  if (isLoading) return null

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
