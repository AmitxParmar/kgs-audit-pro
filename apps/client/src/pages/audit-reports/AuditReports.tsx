// src/pages/audit-reports/AuditReports.tsx

export default function AuditReports() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center gap-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 grid place-items-center">
        <svg className="w-9 h-9 text-slate-400" viewBox="0 0 24 24" fill="none">
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
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Heading */}
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-2">
          Audit Reports
        </h2>
        <p className="text-sm text-slate-500 max-w-xs">
          No reports have been generated yet. Completed audit reports will appear
          here.
        </p>
      </div>

      {/* Placeholder action */}
      <button
        disabled
        className="px-5 py-2 rounded-md text-sm font-medium bg-blue-600/20 text-blue-400 border border-blue-500/30 cursor-not-allowed opacity-60"
      >
        Generate Report
      </button>
    </div>
  );
}
