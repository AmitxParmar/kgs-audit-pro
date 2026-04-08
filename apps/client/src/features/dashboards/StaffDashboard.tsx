"use client";
import { useState } from "react";

export function StaffDashboard() {
  const [ctx, setCtx] = useState<"both" | "iatf" | "iaf">("both");
  const [filter, setFilter] = useState<"all" | "iatf" | "iaf">("all");

  const audits = [
    {
      title: "Surveillance Audit",
      site: "Test Site 1",
      date: "June 15, 2026",
      std: "iatf",
      status: "Planning",
    },
    {
      title: "Registration Audit Stage 1",
      site: "Test Site 2",
      date: "Jun 28, 2026",
      std: "iatf",
      status: "Scheduled",
    },
    {
      title: "Transfer Audit",
      site: "Plant A",
      date: "Mar 10, 2026",
      std: "iatf",
      status: "Overdue",
      overdue: true,
    },
    {
      title: "Initial Accreditation Audit",
      site: "Bravo Industries",
      date: "Apr 12, 2026",
      std: "iaf",
      status: "Execution",
    },
  ];

  const filteredAudits =
    filter === "all" ? audits : audits.filter((a) => a.std === filter);

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-950 to-slate-950/80 text-gray-200 text-[13px]">

     

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        

        {/* CONTENT */}
        <div className="p-6 overflow-auto">

          {/* KPI */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              "Total Audits (2026)",
              "Open NCs",
              "Closed NCs",
              "Avg Closure Time",
            ].map((k, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-4"
              >
                <p className="text-xs text-gray-400">{k}</p>
                <h2 className="text-2xl font-bold mt-2">28</h2>
                <p className="text-xs text-green-400">Good</p>
              </div>
            ))}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-[1fr_300px] gap-4">

            {/* LEFT */}
            <div className="bg-card border border-border rounded-lg p-4">

              <div className="flex justify-between mb-3">
                <h3 className="font-semibold">Upcoming Audits</h3>

                <div className="flex gap-2 text-xs">
                  {["all", "iatf", "iaf"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f as any)}
                      className={`px-3 py-1 rounded-full border ${
                        filter === f
                          ? "bg-[#1a1f2e] text-white"
                          : "text-gray-400 border-border"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAudits.map((a, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border border-border rounded p-3 mb-2 hover:bg-[#1a1f2e]"
                >
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-gray-400">
                      {a.site} • {a.date}
                    </p>

                    {a.overdue && (
                      <p className="text-red-400 text-xs">
                        ● 22 days overdue
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded bg-blueDark">
                      {a.status}
                    </span>
                    <div className="text-[10px] mt-1">
                      {a.std.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <h3 className="mb-3">Overall Compliance</h3>

              {/* Donut */}
              <div className="relative w-28 h-28 mx-auto mb-2">
                <svg viewBox="0 0 110 110">
                  <circle
                    cx="55"
                    cy="55"
                    r="44"
                    stroke="#1e2330"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r="44"
                    stroke="#4ade80"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="248 30"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                  {ctx === "iatf" ? "99%" : ctx === "iaf" ? "96%" : "98%"}
                </div>
              </div>

              <p className="text-xs text-gray-400">Combined compliance</p>
              <p className="text-green-400 text-sm">Excellent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}