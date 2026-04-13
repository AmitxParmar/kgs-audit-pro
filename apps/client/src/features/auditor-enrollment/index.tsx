
export const AuditorEnrollment = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-slate-100">Auditor Enrollment</h1>
      <p className="mt-2 text-slate-400">Manage auditor applications, certifications, and onboardings.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Pending Applications", count: 12, color: "text-blue-400" },
          { title: "Active Auditors", count: 45, color: "text-emerald-400" },
          { title: "Certifications Due", count: 8, color: "text-amber-400" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <div className="text-sm font-medium text-slate-400">{stat.title}</div>
            <div className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.count}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
        <div className="text-4xl mb-4">👨‍💼</div>
        <h3 className="text-lg font-semibold text-white">Enrollment Workflow</h3>
        <p className="mt-2 text-slate-500 max-w-md mx-auto">
          This module will handle the end-to-end recruitment and qualification process for new auditors.
        </p>
        <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition">
          Start New Enrollment
        </button>
      </div>
    </div>
  );
};

export default AuditorEnrollment;
