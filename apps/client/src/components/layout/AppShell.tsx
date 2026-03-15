import { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-card border-r border-border">
        <nav className="p-4">
          <h2 className="text-lg font-semibold mb-4">KGS Audit Pro</h2>
          <ul className="space-y-2">
            <li>
              <a href="/" className="block p-2 rounded hover:bg-accent">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/audits" className="block p-2 rounded hover:bg-accent">
                Audits
              </a>
            </li>
            <li>
              <a href="/clients" className="block p-2 rounded hover:bg-accent">
                Clients
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
