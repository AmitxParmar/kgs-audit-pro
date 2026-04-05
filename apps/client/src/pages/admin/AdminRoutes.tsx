import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'

// ─── Sub-page placeholders ────────────────────────────────────────────────────
// Replace each with your real page components as you build them

function UserAccess() {
  return <AdminPage title="Manage user access" icon="👥" description="Add, edit, deactivate users and assign roles across your CB." />
}

function AuditStandards() {
  return <AdminPage title="Audit standards" icon="📋" description="Configure ISO standards, clauses, and checklist templates." />
}

function UserHistory() {
  return <AdminPage title="User history" icon="🕐" description="Full audit trail of user actions across the platform." />
}

function RecycleBin() {
  return <AdminPage title="Recycle bin" icon="🗑" description="Restore or permanently delete soft-deleted records and documents." />
}

// ─── Shared placeholder layout ────────────────────────────────────────────────
function AdminPage({ title, icon, description }: { title: string; icon: string; description: string }) {
  return (
    <div style={page.wrap}>
      <div style={page.icon}>{icon}</div>
      <h2 style={page.title}>{title}</h2>
      <p style={page.desc}>{description}</p>
      <div style={page.badge}>Coming soon — replace with your real component</div>
    </div>
  )
}

const page = {
  wrap:  { padding: '48px 32px', textAlign: 'center' as const, fontFamily: "'DM Sans', sans-serif" },
  icon:  { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' },
  desc:  { fontSize: 14, color: '#64748b', maxWidth: 400, margin: '0 auto 20px' },
  badge: { display: 'inline-block', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600 },
}

// ─── Admin nav items ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/admin/users',      label: 'User access',     icon: '👥' },
  { to: '/admin/standards',  label: 'Audit standards', icon: '📋' },
  { to: '/admin/history',    label: 'User history',    icon: '🕐' },
  { to: '/admin/recycle-bin', label: 'Recycle bin',    icon: '🗑' },
]

// ─── AdminRoutes ──────────────────────────────────────────────────────────────
// Renders a left nav + nested sub-routes under /admin/*
// Wrapped by <RoleRoute allowedRoles={['super_admin', 'cb_admin']}> in App.tsx

export function AdminRoutes() {
  const navigate = useNavigate()

  return (
    <div style={s.shell}>
      {/* Sidebar nav */}
      <aside style={s.sidebar}>
        <div style={s.sidebarHeader}>
          <span style={s.sidebarTitle}>Admin</span>
          <button
            style={s.backBtn}
            onClick={() => navigate('/')}
            title="Back to dashboard"
          >
            ← Dashboard
          </button>
        </div>

        <nav style={s.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...s.navItem,
                ...(isActive ? s.navItemActive : {}),
              })}
            >
              <span style={s.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <main style={s.main}>
        <Routes>
          {/* Default /admin → redirect to /admin/users */}
          <Route index element={<UserAccess />} />
          <Route path="users"       element={<UserAccess />} />
          <Route path="standards"   element={<AuditStandards />} />
          <Route path="history"     element={<UserHistory />} />
          <Route path="recycle-bin" element={<RecycleBin />} />
        </Routes>
      </main>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const NAV_BG     = '#0f172a'
const NAV_ACTIVE = '#1e40af'

const s: Record<string, React.CSSProperties> = {
  shell: {
    display:        'flex',
    minHeight:      '100%',
    fontFamily:     "'DM Sans', sans-serif",
  },
  sidebar: {
    width:          220,
    background:     NAV_BG,
    display:        'flex',
    flexDirection:  'column',
    flexShrink:     0,
    padding:        '20px 0',
  },
  sidebarHeader: {
    padding:        '0 16px 16px',
    borderBottom:   '1px solid rgba(255,255,255,0.08)',
    marginBottom:   8,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    fontSize:   14,
    fontWeight: 700,
    color:      '#fff',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  },
  backBtn: {
    background: 'none',
    border:     '1px solid rgba(255,255,255,0.15)',
    color:      'rgba(255,255,255,0.6)',
    fontSize:   11,
    padding:    '3px 8px',
    borderRadius: 6,
    cursor:     'pointer',
    fontFamily: 'inherit',
  },
  nav: {
    display:       'flex',
    flexDirection: 'column',
    gap:           2,
    padding:       '8px 10px',
  },
  navItem: {
    display:     'flex',
    alignItems:  'center',
    gap:         10,
    padding:     '9px 12px',
    borderRadius: 8,
    fontSize:    13,
    fontWeight:  500,
    color:       'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    transition:  'background 0.15s, color 0.15s',
  },
  navItemActive: {
    background: NAV_ACTIVE,
    color:      '#fff',
  },
  navIcon: {
    fontSize:   16,
    lineHeight: 1,
    flexShrink: 0,
  },
  main: {
    flex:       1,
    background: '#f8fafc',
    overflow:   'auto',
  },
}
