export function SuccessAlert({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
      {message}
    </div>
  )
}

export function ErrorAlert({ error }: { error: Error | null }) {
  if (!error) return null
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
      {error?.message || 'Authentication failed. Please check your credentials.'}
    </div>
  )
}