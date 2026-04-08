export function CbAdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">CB Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Audit Management</h3>
          <p className="text-gray-600">Schedule and manage audits</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Auditor Management</h3>
          <p className="text-gray-600">Manage auditor assignments</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Client Management</h3>
          <p className="text-gray-600">Manage client relationships</p>
        </div>
      </div>
    </div>
  )
}