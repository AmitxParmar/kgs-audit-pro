export function AuditorDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Auditor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Assigned Audits</h3>
          <p className="text-gray-600">View audit assignments</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Checklist Completion</h3>
          <p className="text-gray-600">Complete audit checklists</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Non-conformities</h3>
          <p className="text-gray-600">Report and track issues</p>
        </div>
      </div>
    </div>
  )
}
