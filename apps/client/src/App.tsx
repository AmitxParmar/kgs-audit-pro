import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./pages/dashboards/Dashboard";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { ProtectedRoute, RoleRoute } from "./components/auth/AuthProvider";
import { AdminRoutes } from "./pages/admin/AdminRoutes";


import AuditSchedule from "./pages/audit-schedule/AuditSchedule";
import IafSchedule from "./pages/audit-schedule/IafSchedule";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅ PUBLIC routes (no ProtectedRoute) */}
        <Route path="/audit-schedule" element={<AuditSchedule />} />
        <Route path="/iaf-schedule" element={<IafSchedule />} />

        {/* Protected app  */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppShell>
                <Routes>
                  {/* Dashboard (protected) */}
                  <Route path="/" element={<Dashboard />} />

                  {/* Admin (protected + role gated) */}
                  <Route
                    path="/admin/*"
                    element={
                      <RoleRoute allowedRoles={["super_admin", "cb_admin"]}>
                        <AdminRoutes />
                      </RoleRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;