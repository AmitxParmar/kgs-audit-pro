import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./pages/dashboards/Dashboard";
import {
  ProtectedRoute,
  RoleRoute,
} from "./features/auth/AuthProvider";
import { AdminRoutes } from "./pages/admin/AdminRoutes";
import { ClientsPage, ClientOnboarding } from "./features/client-onboarding";
import { Toaster } from "react-hot-toast";
import AuditReports from "./features/audit-reports";
import { AuthRoutes } from "./features/auth/routes/AuthRoutes";
import AuditSchedule from "./features/audit-schedule/AuditSchedule";
import IafSchedule from "./features/iaf-schedule/components/IAFSchedule";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Auth */}
        {AuthRoutes()}
        <Route path="login" element={<Navigate to="/" replace />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/onboard" element={<ClientOnboarding />} />

          <Route path="audit-schedule" element={<AuditSchedule />} />
          <Route path="iaf-schedule" element={<IafSchedule />} />

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
