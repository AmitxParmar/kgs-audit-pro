import { supabase } from "@/lib/supabase";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function AppShell() {
  const navigate = useNavigate();
  const [ctx, setCtx] = useState<"both" | "iatf" | "iaf">("both");

  const location = useLocation();
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-darkBg text-gray-200 text-[13px]">

      {/* ✅ SIDEBAR */}
      <aside className="w-[210px] bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-blueDark rounded flex items-center justify-center text-xs font-bold text-blue-400">
              KGS
            </div>
            <div>
              <div className="text-sm font-semibold text-white">KGS</div>
              <div className="text-[10px] text-gray-500">
                {ctx === "both"
                  ? "KGS Audit Workflow"
                  : ctx === "iatf"
                  ? "IATF 16949 Workflow"
                  : "IAF MD4 Workflow"}
              </div>
            </div>
          </div>
        </div>

        <nav className="p-3 text-sm flex-1">
          <div className="text-[10px] text-gray-500 uppercase mb-2">
            Main
          </div>

         <Link
  to="/"
  className={`block px-3 py-2 rounded ${
    location.pathname === "/" ? "bg-blueDark text-white" : "hover:bg-[#1a1f2e]"
  }`}
>
  Dashboard
</Link>

          <Link
  to="/clients"
  className={`block px-3 py-2 rounded ${
    location.pathname.startsWith("/clients")
      ? "bg-blueDark text-white"
      : "hover:bg-[#1a1f2e]"
  }`}
>
  Client Onboarding
</Link>

          <button className="px-3 py-2 hover:bg-[#1a1f2e] rounded w-full text-left">
            Auditor Enrollment
          </button>

          <button
            onClick={handleLogout}
            className="mt-4 text-red-400 px-3 py-2 hover:bg-[#1a1f2e] rounded w-full text-left"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* ✅ MAIN */}
      <div className="flex-1 flex flex-col">

        {/* ✅ TOPBAR */}
        <div className="h-[46px] bg-card border-b border-border flex items-center px-6 gap-3">
          <h1 className="font-semibold flex-1">
            {ctx === "both"
              ? "KGS Audit Dashboard"
              : ctx === "iatf"
              ? "KGS IATF 16949 Dashboard"
              : "KGS IAF MD4 Dashboard"}
          </h1>

          <span className="text-xs text-gray-400">Standard:</span>

          <div className="flex border border-border rounded-full overflow-hidden">
            {["both", "iatf", "iaf"].map((c) => (
              <button
                key={c}
                onClick={() => setCtx(c as any)}
                className={`px-3 py-1 text-xs ${
                  ctx === c
                    ? c === "iatf"
                      ? "bg-blueDark text-blue-400"
                      : c === "iaf"
                      ? "bg-amberDark text-yellow-400"
                      : "bg-[#1a2028] text-purple-400"
                    : "text-gray-400"
                }`}
              >
                {c === "both"
                  ? "Both"
                  : c === "iatf"
                  ? "IATF 16949"
                  : "IAF MD4"}
              </button>
            ))}
          </div>

          <div className="w-7 h-7 bg-[#1a2540] rounded-full flex items-center justify-center text-xs text-blue-400">
            RK
          </div>
        </div>

        {/* ✅ PAGE CONTENT */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}