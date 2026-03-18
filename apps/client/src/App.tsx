import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { ResetPassword } from './pages/ResetPassword'
import { ProtectedRoute } from './components/auth/AuthProvider'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/login" element={<Login />} />
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
