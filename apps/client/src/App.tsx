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
import AuditReports from "./pages/audit-reports/AuditReports";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" reverseOrder={false} />

        <Toaster position="top-center" reverseOrder={false} />
     <Routes>
  {/* Auth */}
  <Route path="/login" element={<Login />} />
  <Route path="/reset-password" element={<ResetPassword />} />

  {/* Public */}
  <Route path="/audit-schedule" element={<AuditSchedule />} />
  <Route path="/iaf-schedule" element={<IafSchedule />} />

  {/* Protected Layout */}
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    }
  >
   
    <Route index element={<Dashboard />} />

    <Route path="clients" element={<ClientsPage />} />
    <Route path="clients/onboard" element={<ClientOnboarding />} />

    <Route path="audit-reports" element={<AuditReports />} />

    <Route
      path="admin/*"
      element={
        <RoleRoute allowedRoles={["super_admin", "cb_admin"]}>
          <AdminRoutes />
        </RoleRoute>
      }
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
</Routes>
    </div>
  );
}

export default App;