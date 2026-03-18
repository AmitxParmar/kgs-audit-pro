import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password'

export function AuthForm() {
  const [mode, setMode]               = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [formData, setFormData]       = useState({
    email: '', password: '', confirmPassword: '', name: '',
  })

  const navigate = useNavigate()

  const {
    login, signup, resetPassword, updatePassword,
    isLoggingIn, isSigningUp, isResettingPassword, isUpdatingPassword,
    loginError, signupError, resetPasswordError, updatePasswordError,
  } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setSuccessMessage('')

  if (mode === 'login') {
    try {
      await login({ email: formData.email, password: formData.password })
    } catch (err) {
      console.error('login error:', err)
    } finally {
      // Token is in localStorage regardless — just go
      window.location.href = '/'
    }
    return
  }

  if (mode === 'signup') {
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name,
      })
    } catch (err) {
      console.error('signup error:', err)
    } finally {
      window.location.href = '/'
    }
    return
  }

  if (mode === 'forgot-password') {
    try {
      await resetPassword(formData.email)
      setSuccessMessage('✉ Password reset link sent — check your email.')
      setMode('login')
    } catch (err) {
      console.error(err)
    }
    return
  }

  if (mode === 'reset-password') {
    try {
      await updatePassword(formData.password)
      setSuccessMessage('✓ Password updated. Please sign in.')
      setMode('login')
    } catch (err) {
      console.error(err)
    }
  }
}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const error = (
  mode === 'login'           ? loginError :
  mode === 'signup'          ? signupError :
  mode === 'forgot-password' ? resetPasswordError :
  updatePasswordError
) as Error | null   // ← cast from unknown to Error | null

  const isLoading = mode === 'login'           ? isLoggingIn
                  : mode === 'signup'          ? isSigningUp
                  : mode === 'forgot-password' ? isResettingPassword
                  : isUpdatingPassword

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {mode === 'login'           && 'Sign in to your account'}
            {mode === 'signup'          && 'Create your account'}
            {mode === 'forgot-password' && 'Reset your password'}
            {mode === 'reset-password'  && 'Set new password'}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

     
    {successMessage && (
      <div className={[
        'bg-blue-50 border border-blue-200',
        'text-blue-700 px-4 py-3 rounded-md text-sm'
      ].join(' ')}>
        {successMessage}
      </div>
    )}

    {error && (
  <div className={[
    'bg-red-50 border border-red-200',
    'text-red-600 px-4 py-3 rounded-md text-sm'
  ].join(' ')}>
    {(error as Error)?.message || 'Authentication failed. Please check your credentials.'}
  </div>
)}      

          <div className="space-y-4">
            {/* Name — signup only */}
            {mode === 'signup' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="name" type="text" required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className="appearance-none rounded-md block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email" type="email" autoComplete="email" required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                disabled={mode === 'reset-password'}
                className="appearance-none rounded-md block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Password */}
            {(mode === 'login' || mode === 'signup' || mode === 'reset-password') && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={mode === 'reset-password' ? 'New password' : 'Password'}
                  className="appearance-none rounded-md block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword
                    ? <EyeOff className="h-5 w-5 text-gray-400" />
                    : <Eye    className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            )}

            {/* Confirm password — signup only */}
            {mode === 'signup' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className="appearance-none rounded-md block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Processing…
              </span>
            ) : (
              <>
                {mode === 'login'           && 'Sign in'}
                {mode === 'signup'          && 'Sign up'}
                {mode === 'forgot-password' && 'Send reset link'}
                {mode === 'reset-password'  && 'Update password'}
              </>
            )}
          </button>

          {/* Mode switcher links */}
          <div className="flex items-center justify-between text-sm">
            {mode === 'login' && (
              <>
                <button type="button" onClick={() => setMode('forgot-password')} className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </button>
                <button type="button" onClick={() => setMode('signup')} className="font-medium text-blue-600 hover:text-blue-500">
                  Create account
                </button>
              </>
            )}
            {(mode === 'signup' || mode === 'forgot-password' || mode === 'reset-password') && (
              <button type="button" onClick={() => setMode('login')} className="font-medium text-blue-600 hover:text-blue-500">
                ← Back to sign in
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}