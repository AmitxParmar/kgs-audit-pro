export function StaffDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">My Tasks</h3>
          <p className="text-gray-600">View assigned tasks</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Training Records</h3>
          <p className="text-gray-600">View training history</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <p className="text-gray-600">Update personal information</p>
        </div>
      </div>
    </div>
  )
}
