// apps/client/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import App from './App.tsx'
import './styles/globals.css'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace' }}>
          <h2 style={{ color: 'red' }}>App failed to start</h2>
          <pre style={{ background: '#fee', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap' }}>
            {(this.state.error as Error).message}
          </pre>
          <p style={{ color: '#666', fontSize: 13 }}>
            Check: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel Environment Variables.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
      
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
 // <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  //</React.StrictMode>,
)
