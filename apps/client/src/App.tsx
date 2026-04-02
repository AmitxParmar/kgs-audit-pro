import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { ResetPassword } from './pages/ResetPassword'
import { ProtectedRoute } from './components/auth/AuthProvider'
import { useAuthContext } from './context/AuthContext'
import { ReactNode } from 'react'

// Redirect to '/' if the user is already authenticated
function GuestRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthContext()
  if (isLoading) return null
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                {/* Add more routes here */}
              </Routes>
            </AppShell>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
