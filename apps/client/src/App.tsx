import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./pages/dashboards/Dashboard";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { ProtectedRoute, RoleRoute } from "./components/auth/AuthProvider";
import { AdminRoutes } from "./pages/admin/AdminRoutes";
import { ClientsPage } from "./pages/clients/ClientsPage";
import ClientOnboarding from "./pages/clients/ClientOnboarding";
import { Toaster } from "react-hot-toast";

import AuditSchedule from "./pages/audit-schedule/AuditSchedule";
import IafSchedule from "./pages/audit-schedule/IAFSchedule";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* FULL PAGE (NO SIDEBAR) */}
        <Route
          path="/clients/onboard"
          element={
            <ProtectedRoute>
              <ClientOnboarding />
            </ProtectedRoute>
          }
        />

        {/* SIDEBAR LAYOUT (PROTECTED) */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientsPage />} />

          {/* ✅ Audit pages (now they show inside AppShell sidebar layout) */}
          <Route path="/audit-schedule" element={<AuditSchedule />} />
          <Route path="/iaf-schedule" element={<IafSchedule />} />

          <Route
            path="/admin/*"
            element={
              <RoleRoute allowedRoles={["super_admin", "cb_admin"]}>
                <AdminRoutes />
              </RoleRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;