import React from "react";

export default function KgsSidebar({
  sidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] transition-opacity lg:hidden",
          mobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={[
          "fixed z-50 inset-y-0 left-0 lg:static lg:z-auto",
          "bg-gradient-to-b from-slate-950 to-slate-950/80 border-r border-white/10",
          "transition-all duration-200 ease-out",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarCollapsed ? "lg:w-[84px]" : "lg:w-[260px]",
          "w-[260px]",
          "flex flex-col",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-900/80 border border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.45)] grid place-items-center">
              <span className="text-[12px] font-extrabold tracking-wide text-slate-100">
                KGS
              </span>
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="font-extrabold leading-tight">KGS</div>
                <div className="text-xs text-slate-400">KGS Audit Workflow</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <div className="px-3">
          <SectionTitle collapsed={sidebarCollapsed}>MAIN</SectionTitle>
          <NavItem collapsed={sidebarCollapsed} label="Dashboard" />
          <NavItem collapsed={sidebarCollapsed} label="Client Onboarding" />
          <NavItem collapsed={sidebarCollapsed} label="Auditor Enrollment" />

          <SectionTitle collapsed={sidebarCollapsed} className="mt-4">
            AUDIT
          </SectionTitle>
          <NavItem collapsed={sidebarCollapsed} label="Audit Schedule" active />
          <NavItem collapsed={sidebarCollapsed} label="Audit Reports" />
          <NavItem collapsed={sidebarCollapsed} label="Certification Verification" />
        </div>

        <div className="flex-1" />

        {!sidebarCollapsed && (
          <div className="px-4 pb-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-extrabold text-slate-200/90">
                Audit Framework
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                All rights reserved by KGS
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

/* ------------------------- Sidebar internal components ------------------------- */

function SectionTitle({ children, collapsed, className = "" }) {
  if (collapsed) return <div className="h-3" />;
  return (
    <div
      className={`px-3 pt-3 pb-2 text-[12px] font-semibold tracking-[0.18em] text-slate-500/80 ${className}`}
    >
      {children}
    </div>
  );
}

function NavItem({ label, active, collapsed }) {
  const Icon = sidebarIconFor(label);

  return (
    <button
      className={[
        "relative w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition",
        active ? "bg-blue-600/15" : "hover:bg-white/5",
      ].join(" ")}
      title={label}
      type="button"
    >
      {active && <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-500 rounded-r" />}

      <span
        className={[
          "w-6 grid place-items-center",
          active ? "text-slate-100" : "text-slate-400",
        ].join(" ")}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>

      {!collapsed && (
        <span
          className={[
            "text-sm",
            active ? "font-extrabold text-slate-100" : "text-slate-300/85",
          ].join(" ")}
        >
          {label}
        </span>
      )}
    </button>
  );
}

/* ------------------------------ Icons (SVG) ------------------------------ */

function sidebarIconFor(label) {
  switch (label) {
    case "Dashboard":
      return IconDashboard;
    case "Client Onboarding":
      return IconClientOnboarding;
    case "Auditor Enrollment":
      return IconAuditor;
    case "Audit Schedule":
      return IconList;
    case "Audit Reports":
      return IconDoc;
    case "Certification Verification":
      return IconStar;
    default:
      return IconDot;
  }
}

function IconDashboard({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconClientOnboarding({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 11a3.2 3.2 0 1 0-6.4 0A3.2 3.2 0 0 0 12 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.8 20c.9-3.4 3.9-5.2 8-5.2s7.1 1.8 8 5.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18.6 10.8h.01"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function IconAuditor({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a3.6 3.6 0 1 0-7.2 0A3.6 3.6 0 0 0 12 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.2 20.5c1-3.7 4.3-5.8 8.8-5.8s7.8 2.1 8.8 5.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconList({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h15M6 12h15M6 17h15"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M3.5 7h.01M3.5 12h.01M3.5 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDoc({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 12h8M8 16h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

function IconStar({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5l2.7 5.6 6.2.9-4.5 4.4 1.1 6.2L12 17.9 6.5 20.6l1.1-6.2L3.1 10l6.2-.9L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDot({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}