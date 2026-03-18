import { useAuth } from '../hooks/useAuth'
import { SuperAdminDashboard }  from './dashboards/SuperAdminDashboard'
import { CbAdminDashboard }     from './dashboards/CbAdminDashboard'
import { StaffDashboard }       from './dashboards/StaffDashboard'

// ─── Role → Dashboard map ─────────────────────────────────────────────────────
const DASHBOARD_MAP: Record<string, React.ComponentType> = {
  super_admin:           SuperAdminDashboard,
  cb_admin:              CbAdminDashboard,
  lead_auditor:          () => <PlaceholderDashboard role="Lead Auditor" />,
  auditor:               () => <PlaceholderDashboard role="Auditor" />,
  staff:                 StaffDashboard,
  accreditation_manager: () => <PlaceholderDashboard role="Accreditation Manager" />,
}

// ─── Dashboard router ─────────────────────────────────────────────────────────
export function Dashboard() {
  const { user } = useAuth()
  const role = user?.role

  if (!role || !(role in DASHBOARD_MAP)) {
    return <DefaultPortal />
  }

  const RoleDashboard = DASHBOARD_MAP[role]
  return <RoleDashboard />
}

// ─── Default portal ───────────────────────────────────────────────────────────
function DefaultPortal() {
  const { user, logout } = useAuth()

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.iconWrap}><span style={s.icon}>🔐</span></div>
        <h2 style={s.title}>Access pending</h2>
        <p style={s.subtitle}>
          Your account <strong>{user?.email}</strong> has been created but hasn't been
          assigned a role yet. Contact your CB administrator to get access.
        </p>

        <div style={s.infoBox}>
          <div style={s.infoTitle}>What happens next?</div>
          <div style={s.infoList}>
            {[
              'Your CB administrator will assign your role',
              'You will then have access to the relevant modules',
              'Log out and back in after your role has been assigned',
            ].map((item, i) => (
              <div key={i} style={s.infoItem}>
                <span style={s.infoNum}>{i + 1}</span>
                <span style={s.infoText}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.accountRow}>
          <div>
            <div style={s.accountLabel}>Signed in as</div>
            <div style={s.accountEmail}>{user?.email}</div>
          </div>
          <button style={s.refreshBtn} onClick={() => window.location.reload()}>
            ↻ Refresh
          </button>
        </div>

        <button style={s.logoutBtn} onClick={() => logout()}>
          Sign out
        </button>
      </div>
    </div>
  )
}

// ─── Placeholder for roles not yet built ─────────────────────────────────────
function PlaceholderDashboard({ role }: { role: string }) {
  return (
    <div style={s.page}>
      <div style={{ ...s.card, maxWidth: 440 }}>
        <div style={s.iconWrap}><span style={s.icon}>🚧</span></div>
        <h2 style={s.title}>{role} dashboard</h2>
        <p style={s.subtitle}>This dashboard is under construction and will be available soon.</p>
        <div style={s.badge}>Coming soon</div>
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page:         { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', padding: 24, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" },
  card:         { background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '40px 40px 32px', maxWidth: 480, width: '100%', boxShadow: '0 4px 24px rgba(15,76,117,0.08)', textAlign: 'center' },
  iconWrap:     { marginBottom: 16 },
  icon:         { fontSize: 48, lineHeight: 1 },
  title:        { fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' },
  subtitle:     { fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 0 24px' },
  infoBox:      { background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: '16px 20px', marginBottom: 24, textAlign: 'left' },
  infoTitle:    { fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  infoList:     { display: 'flex', flexDirection: 'column' as const, gap: 10 },
  infoItem:     { display: 'flex', alignItems: 'flex-start', gap: 10 },
  infoNum:      { width: 22, height: 22, borderRadius: '50%', background: '#0f4c75', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  infoText:     { fontSize: 13, color: '#475569', lineHeight: 1.5 },
  accountRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 16, textAlign: 'left' },
  accountLabel: { fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  accountEmail: { fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 2 },
  refreshBtn:   { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  logoutBtn:    { width: '100%', padding: 11, background: '#fff', color: '#64748b', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  badge:        { display: 'inline-block', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, marginTop: 8 },
}