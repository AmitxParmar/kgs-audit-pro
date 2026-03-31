import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Ctx = "both" | "iatf" | "iaf";

const CTX_SUBTITLE: Record<Ctx, string> = {
  both: "KGS Audit Workflow",
  iatf: "IATF 16949 Workflow",
  iaf: "IAF MD4 Workflow",
};

const CTX_TITLE: Record<Ctx, string> = {
  both: "KGS Audit Dashboard",
  iatf: "KGS IATF 16949 Dashboard",
  iaf: "KGS IAF MD4 Dashboard",
};

const CTX_BUTTON_LABEL: Record<Ctx, string> = {
  both: "Both",
  iatf: "IATF 16949",
  iaf: "IAF MD4",
};

function getCtxButtonClass(ctx: Ctx, active: boolean) {
  if (!active) return "text-gray-400";

  switch (ctx) {
    case "iatf":
      return "bg-blueDark text-blue-400";
    case "iaf":
      return "bg-amberDark text-yellow-400";
    case "both":
    default:
      return "bg-[#1a2028] text-purple-400";
  }
}

type NavItem = { to: string; label: string; end?: boolean };

export function AppShell() {
  const navigate = useNavigate();
  const [ctx, setCtx] = useState<Ctx>("both");

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } finally {
      navigate("/login");
    }
  }

  const linkBase = "block px-3 py-2 rounded transition w-full text-left";
  const linkActive = "bg-blueDark text-white";
  const linkIdle = "hover:bg-[#1a1f2e] text-gray-200";

  const navItems = useMemo<NavItem[]>(
    () => [
      { to: "/", label: "Dashboard", end: true },
      { to: "/clients", label: "Client Onboarding" },
      { to: "/auditor-enrollment", label: "Auditor Enrollment" },
      { to: "/audit-schedule", label: "Audit Schedule" },
      { to: "/audit-reports", label: "Audit Reports" },
      { to: "/certification-verification", label: "Certification Verification" },
    ],
    []
  );

  return (
    <div className="flex h-screen bg-darkBg text-gray-200 text-[13px]">
      <aside className="w-[230px] bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-blueDark rounded flex items-center justify-center text-xs font-bold text-blue-400">
              KGS
            </div>

            <div>
              <div className="text-sm font-semibold text-white">KGS</div>
              <div className="text-[10px] text-gray-500">{CTX_SUBTITLE[ctx]}</div>
            </div>
          </div>
        </div>

        <nav className="p-3 text-sm flex-1 overflow-auto">
          <div className="text-[10px] text-gray-500 uppercase mb-2">Dashboard</div>

          {navItems.slice(0, 3).map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="text-[10px] text-gray-500 uppercase mt-5 mb-2">Audit</div>

          {navItems.slice(3).map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              {label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="mt-5 text-red-400 px-3 py-2 hover:bg-[#1a1f2e] rounded w-full text-left"
            type="button"
          >
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="h-[46px] bg-card border-b border-border flex items-center px-6 gap-3">
          <h1 className="font-semibold flex-1">{CTX_TITLE[ctx]}</h1>

          <span className="text-xs text-gray-400">Standard:</span>

          <div className="flex border border-border rounded-full overflow-hidden">
            {(["both", "iatf", "iaf"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCtx(c)}
                className={`px-3 py-1 text-xs ${getCtxButtonClass(c, ctx === c)}`}
                type="button"
              >
                {CTX_BUTTON_LABEL[c]}
              </button>
            ))}
          </div>

          <div className="w-7 h-7 bg-[#1a2540] rounded-full flex items-center justify-center text-xs text-blue-400">
            RK
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <Outlet context={{ ctx }} />
        </div>
      </div>
    </div>
  );
}