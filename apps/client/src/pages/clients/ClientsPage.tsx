import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Phone, Calendar, Clock } from "lucide-react";

export function ClientsPage() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState<string | null>(null);

  const clients = [
    {
      name: "Bravo Industries Sdn. Bhd.",
      code: "IAF-CLI-2026-001",
      email: "onboard@bravoindustries.com",
      phone: "+60 3 8765 4321",
      date: "Applied Apr 10, 2026",
      scope: "IAF MD4 — Certification Body Accreditation",
      stage: "Application Received",
      progress: 14,
      stageCount: "Stage 1 of 7",
    },
    {
      name: "Echo Systems Pte. Ltd.",
      code: "IAF-CLI-2026-002",
      email: "info@echosystems.sg",
      phone: "+65 6234 5678",
      date: "Applied Apr 8, 2026",
      scope: "IAF MD4 — Management System Certification",
      stage: "Application Received",
      progress: 14,
      stageCount: "Stage 1 of 7",
    },
    {
      name: "Delta Certifications GmbH",
      code: "IAF-CLI-2026-003",
      email: "contracts@deltacert.de",
      phone: "+49 89 2345 6789",
      date: "Applied Mar 22, 2026",
      scope: "IAF MD4 — Product Certification Scheme",
      stage: "Contract Creation",
      progress: 43,
      stageCount: "Stage 3 of 7",
    },
  ];

  const stages = [
    "Application Received",
    "Application Review",
    "Contract Creation",
    "Contract Review",
    "Contract Sent",
    "Contract Signed",
    "Onboarding Complete",
  ];

  const filteredClients = clients.filter((c) => {
    if (stageFilter && c.stage !== stageFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Client Onboarding
          </h1>
          <p className="text-xs text-gray-400">
            Manage IAF MD4 client applications and contracting
          </p>
        </div>

       <div className="flex gap-3 items-center">
  <select
  value={stageFilter || "All"}
  onChange={(e) =>
    setStageFilter(e.target.value === "All" ? null : e.target.value)
  }
  className="bg-[#1a1f2e] text-white border border-border px-4 py-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
>
  <option value="All" className="bg-[#1a1f2e] text-white">
    All Stages
  </option>
  {stages.map((stage) => (
    <option key={stage} value={stage} className="bg-[#1a1f2e] text-white">
      {stage}
    </option>
  ))}
</select>

          <button
            onClick={() => navigate("/clients/onboard")}
            className="bg-amber-500 hover:bg-amber-600 text-black text-sm px-4 py-2 rounded font-medium"
          >
            + New Client
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { title: "Total Clients", value: "9", sub: "IAF MD4" },
          { title: "In Progress", value: "3", sub: "Active pipeline" },
          { title: "Onboarding Complete", value: "5", sub: "This cycle" },
          { title: "Overdue Actions", value: "1", sub: "Needs attention" },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-gray-400">{s.title}</p>
            <h2 className="text-2xl font-bold mt-2 text-white">{s.value}</h2>
            <p className="text-xs text-green-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* PIPELINE */}
      <div className="grid grid-cols-7 bg-card border border-border rounded-xl overflow-hidden text-center">
        {stages.map((stage, i) => {
          const count = clients.filter((c) => c.stage === stage).length;

          return (
            <div
              key={i}
              onClick={() =>
                setStageFilter(stageFilter === stage ? null : stage)
              }
              className={`py-5 border-r border-border cursor-pointer ${
                stageFilter === stage ? "bg-[#1a1f2e]" : ""
              }`}
            >
              <div className="w-10 h-10 mx-auto rounded-full border border-amber-500 flex items-center justify-center text-amber-400 mb-2">
                {count}
              </div>
              <p className="text-[11px] text-gray-400">{stage}</p>
            </div>
          );
        })}
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 text-xs">
        {["All", "Active", "Complete", "Overdue"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full border ${
              filter === f
                ? "bg-amber-500 text-black border-amber-500"
                : "border-border text-gray-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* CLIENT CARDS */}
      <div className="space-y-4">
        {filteredClients.map((c, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-5 hover:bg-[#1a1f2e] transition"
          >
            {/* TOP */}
            <div className="flex justify-between mb-3">
              <div>
                <h2 className="text-white font-semibold">{c.name}</h2>
                <div className="flex gap-2 text-[11px] text-gray-500 mt-1">
                  <span>{c.code}</span>
                  <span className="px-2 py-[2px] bg-amber-900 text-amber-400 rounded">
                    IAF MD4
                  </span>
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-amber-900 text-amber-400">
                {c.stage}
              </span>
            </div>

            {/* DETAILS */}
            <div className="flex gap-6 text-[12px] text-gray-400 mb-3 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail size={12} /> {c.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={12} /> {c.phone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {c.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {c.scope}
              </span>
            </div>

            {/* PROGRESS */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Progress</span>

              <div className="flex-1 h-2 bg-[#1e2330] rounded">
                <div
                  className="h-2 bg-amber-400 rounded"
                  style={{ width: `${c.progress}%` }}
                />
              </div>

              <span className="text-xs text-amber-400">
                {c.progress}%
              </span>

              <span className="ml-3 text-[11px] px-3 py-1 bg-[#1a1f2e] rounded text-gray-300">
                {c.stageCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}