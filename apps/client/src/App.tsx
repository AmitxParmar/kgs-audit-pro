import { Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { AppShell } from "./shared/layout/AppShell";
import {
  Dashboard,
  ProtectedRoute,
  RoleRoute,
  AuthRoutes,
  AdminRoutes,
  ClientsPage,
  ClientOnboarding,
  AuditReports,
  AuditSchedule,
  IafSchedule,
  Certification,
  AuditorEnrollment,
} from "./features";

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
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/onboard" element={<ClientOnboarding />} />

          <Route path="auditor-enrollment" element={<AuditorEnrollment />} />

          <Route path="audit-schedule" element={<AuditSchedule />} />
          <Route path="iaf-schedule" element={<IafSchedule />} />

          <Route path="audit-reports" element={<AuditReports />} />
          <Route path="certification" element={<Certification />} />

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
