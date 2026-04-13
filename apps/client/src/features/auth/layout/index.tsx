import { Outlet } from "react-router-dom"

interface AuthLayoutProps {
  title: string
}

export function AuthLayout({ title = "sad" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        {/* Logo + title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center">
            <img
              src="/KGS_LOGO.png"
              alt="KGS Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                const t = e.target as HTMLImageElement
                t.style.display = 'none'
                const fb = t.nextElementSibling as HTMLElement
                if (fb) fb.style.display = 'flex'
              }}
            />
            <div className="hidden h-12 w-12 bg-blue-600 rounded-lg items-center justify-center text-white font-bold text-xl">
              KGS
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">{title}</h2>
        </div>

        <Outlet/>
      </div>
    </div>
  )
}