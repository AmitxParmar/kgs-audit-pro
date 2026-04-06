
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

const PUBLIC_PATHS = ['/audit-schedule', '/iaf-schedule', '/login', '/reset-password']

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading } = useAuthContext()
  const isPublic = PUBLIC_PATHS.includes(window.location.pathname)

  
  if (isLoading && !isPublic) {
    return null
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

  if (!user) {
    return <Navigate to="/login" replace />
  }

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

 
  if (isLoading) return null

 
  if (!user) {
    return <Navigate to="/login" replace />
  }

 
  return <>{children}</>
}