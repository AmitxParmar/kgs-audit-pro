// src/components/layout/AppShell.tsx
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { ReactNode } from "react";

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ctx, setCtx] = useState<"both" | "iatf" | "iaf">("both");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-950 to-slate-950/80 text-gray-200 text-[13px]">

      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] transition-opacity lg:hidden",
          mobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* ── SIDEBAR ────────────────────────────────────────────────────── */}
      <aside
        className={[
          "fixed z-50 inset-y-0 left-0 lg:static lg:z-auto",
          "bg-gradient-to-b from-slate-950 to-slate-950/80 border-r border-white/10",
          "transition-all duration-200 ease-out flex flex-col",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[210px]",
          "w-[210px]",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 border border-white/10 rounded-lg grid place-items-center flex-shrink-0">
              <span className="text-[11px] font-extrabold text-slate-100">KGS</span>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white leading-tight">KGS</div>
                <div className="text-[10px] text-slate-500">
                  {ctx === "both" ? "KGS Audit Workflow" : ctx === "iatf" ? "IATF 16949 Workflow" : "IAF MD4 Workflow"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">

          {/* MAIN section */}
          <SectionTitle collapsed={sidebarCollapsed}>MAIN</SectionTitle>

          <NavItem
            to="/"
            label="Dashboard"
            active={isActive("/")}
            collapsed={sidebarCollapsed}
            icon={<IconDashboard />}
          />
          <NavItem
            to="/clients"
            label="Client Onboarding"
            active={isActive("/clients")}
            collapsed={sidebarCollapsed}
            icon={<IconClientOnboarding />}
          />
          <NavItem
            to="/admin/users"
            label="Auditor Enrollment"
            active={isActive("/admin")}
            collapsed={sidebarCollapsed}
            icon={<IconAuditor />}
          />

          {/* AUDIT section */}
          <SectionTitle collapsed={sidebarCollapsed} className="mt-4">AUDIT</SectionTitle>

          <NavItem
            to="/audit-schedule"
            label="Audit Schedule"
            active={isActive("/audit-schedule")}
            collapsed={sidebarCollapsed}
            icon={<IconList />}
          />
          <NavItem
            to="/iaf-schedule"
            label="IAF Schedule"
            active={isActive("/iaf-schedule")}
            collapsed={sidebarCollapsed}
            icon={<IconDoc />}
          />
          <NavItem
            to="/audit-reports"
            label="Audit Reports"
            active={isActive("/audit-reports")}
            collapsed={sidebarCollapsed}
            icon={<IconDoc />}
          />
          <NavItem
            to="/certification"
            label="Certification"
            active={isActive("/certification")}
            collapsed={sidebarCollapsed}
            icon={<IconStar />}
          />

          {/* Logout */}
          <div className="mt-4">
            <button
              onClick={handleLogout}
              title="Logout"
              className="relative w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition hover:bg-white/5 text-red-400"
            >
              <span className="w-6 grid place-items-center">
                <IconLogout />
              </span>
              {!sidebarCollapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex px-3 pb-4">
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="w-full flex items-center justify-center h-8 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition text-slate-400 text-xs"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? "»" : "«"}
          </button>
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <div className="h-[46px] bg-card border-b border-border flex items-center px-4 gap-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden h-8 w-8 rounded-md border border-white/10 bg-white/5 grid place-items-center text-slate-300"
            onClick={() => setMobileSidebarOpen(true)}
          >
            ☰
          </button>

          <h1 className="font-semibold flex-1 text-sm">
            {ctx === "both" ? "KGS Audit Dashboard" : ctx === "iatf" ? "KGS IATF 16949 Dashboard" : "KGS IAF MD4 Dashboard"}
          </h1>

          <span className="text-xs text-gray-400">Standard:</span>
          <div className="flex border border-border rounded-full overflow-hidden">
            {(["both", "iatf", "iaf"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCtx(c)}
                className={`px-3 py-1 text-xs ${
                  ctx === c
                    ? c === "iatf" ? "bg-blueDark text-blue-400"
                    : c === "iaf"  ? "bg-amberDark text-yellow-400"
                    : "bg-[#1a2028] text-purple-400"
                    : "text-gray-400"
                }`}
              >
                {c === "both" ? "Both" : c === "iatf" ? "IATF 16949" : "IAF MD4"}
              </button>
            ))}
          </div>

          <div className="w-7 h-7 bg-[#1a2540] rounded-full grid place-items-center text-xs text-blue-400">
            RK
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-auto p-6 bg-gradient-to-b from-slate-950 to-slate-950/80">
          <Outlet context={{ ctx }} />
        </div>
      </div>
    </div>
  );
}

/* ── Internal components ─────────────────────────────────────────────────── */

function SectionTitle({ children, collapsed, className = "" }: { children: ReactNode; collapsed: boolean; className?: string }) {
  if (collapsed) return <div className="h-3" />;
  return (
    <div className={`px-3 pt-3 pb-1 text-[10px] font-semibold tracking-[0.18em] text-slate-500/80 uppercase ${className}`}>
      {children}
    </div>
  );
}

function NavItem({
  to,
  label,
  active,
  collapsed,
  icon,
}: {
  to: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  icon: ReactNode;
}) {
  return (
    <Link
      to={to}
      title={label}
      className={[
        "relative flex items-center gap-3 px-3 py-2 rounded-md transition",
        active ? "bg-blue-600/15" : "hover:bg-white/5",
      ].join(" ")}
    >
      {active && <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-500 rounded-r" />}
      <span className={["w-6 grid place-items-center flex-shrink-0", active ? "text-slate-100" : "text-slate-400"].join(" ")}>
        {icon}
      </span>
      {!collapsed && (
        <span className={["text-sm truncate", active ? "font-bold text-slate-100" : "text-slate-300/85"].join(" ")}>
          {label}
        </span>
      )}
    </Link>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */

function IconDashboard() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconClientOnboarding() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M12 11a3.2 3.2 0 1 0-6.4 0A3.2 3.2 0 0 0 12 11Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.8 20c.9-3.4 3.9-5.2 8-5.2s7.1 1.8 8 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconAuditor() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a3.6 3.6 0 1 0-7.2 0A3.6 3.6 0 0 0 12 12Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.2 20.5c1-3.7 4.3-5.8 8.8-5.8s7.8 2.1 8.8 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconList() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M6 7h15M6 12h15M6 17h15" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M3.5 7h.01M3.5 12h.01M3.5 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12h8M8 16h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M12 3.5l2.7 5.6 6.2.9-4.5 4.4 1.1 6.2L12 17.9 6.5 20.6l1.1-6.2L3.1 10l6.2-.9L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
