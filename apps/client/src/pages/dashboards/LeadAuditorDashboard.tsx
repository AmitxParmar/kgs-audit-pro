export function LeadAuditorDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lead Auditor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">My Audits</h3>
          <p className="text-gray-600">View and manage assigned audits</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Audit Reports</h3>
          <p className="text-gray-600">Generate and review audit reports</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Team Management</h3>
          <p className="text-gray-600">Manage audit team members</p>
        </div>
      </div>
    </div>
  )
}