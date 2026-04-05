export function AccreditationDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Accreditation Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Document Management</h3>
          <p className="text-gray-600">Manage accreditation documents</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Accreditation Audits</h3>
          <p className="text-gray-600">Schedule accreditation audits</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Compliance Tracking</h3>
          <p className="text-gray-600">Monitor compliance status</p>
        </div>
      </div>
    </div>
  )
}
