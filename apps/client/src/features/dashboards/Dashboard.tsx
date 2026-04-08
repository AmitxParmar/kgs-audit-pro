// apps/client/src/pages/Dashboard.tsx  ← replace existing file
import { useAuth } from '@/shared/hooks/useAuth'
import { SuperAdminDashboard }    from './SuperAdminDashboard'
import { CbAdminDashboard }       from './CbAdminDashboard'

import { AuditorDashboard }       from './AuditorDashboard'
import { StaffDashboard }         from './StaffDashboard'
import { AccreditationDashboard } from './AccreditationDashboard'
import { ComingSoon }              from './ComingSoon'

const DASHBOARD_MAP = {
  super_admin:             SuperAdminDashboard,
  cb_admin:                CbAdminDashboard,
  lead_auditor: () => <ComingSoon role="lead_auditor" />,
  auditor:                 AuditorDashboard,
  staff:                   StaffDashboard,
  accreditation_manager:   AccreditationDashboard,
} as const

export function Dashboard() {
  const { user, isProfileLoading } = useAuth()
  const role = user?.role

  // While the background profile fetch is in-flight AND we don't have a role yet, show a spinner
  if (isProfileLoading && !role) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: 80 }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
          <div style={{ fontSize: 14 }}>Loading your dashboard…</div>
        </div>
      </div>
    )
  }

  if (!role || !(role in DASHBOARD_MAP)) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No role assigned</div>
        <div style={{ fontSize: 14 }}>Contact your CB administrator to assign your role.</div>
        <div style={{ fontSize: 12, marginTop: 8, color: '#9ca3af' }}>User: {user?.email}</div>
      </div>
    )
  }

  const RoleDashboard = DASHBOARD_MAP[role as keyof typeof DASHBOARD_MAP]
  return <RoleDashboard />
}
