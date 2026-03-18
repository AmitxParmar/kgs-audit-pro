// apps/client/src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell }      from './components/layout/AppShell'
import { Dashboard }     from './pages/dashboards/Dashboard'
import { Login }         from './pages/Login'
import { ResetPassword } from './pages/ResetPassword'
import { ProtectedRoute, RoleRoute } from './components/auth/AuthProvider'
import { AdminRoutes } from './pages/admin/AdminRoutes'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/login"          element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                {/* Single dashboard route — role routing happens inside Dashboard.tsx */}
                <Route path="/"         element={<Dashboard />} />

                {/* Role-gated routes */}
                <Route path="/admin/*"  element={
                  <RoleRoute allowedRoles={['super_admin', 'cb_admin']}>
                    <AdminRoutes />
                  </RoleRoute>
                }/>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }/>
      </Routes>
    </div>
  )
}

export default App