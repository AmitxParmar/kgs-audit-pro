// components/auth/LoginForm.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { AuthInput } from './AuthInput'
import { SubmitButton } from './SubmitButton'
import { ErrorAlert, SuccessAlert } from './AuthAlerts'

interface LoginFormProps {
  /** Optional success message passed in from another flow (e.g. after signup/reset) */
  successMessage?: string
}

export function LoginForm({ successMessage = '' }: LoginFormProps) {
  const navigate = useNavigate()
  const { login, loginError } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await login({ email: formData.email, password: formData.password })
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <SuccessAlert message={successMessage} />
      <ErrorAlert error={loginError as Error | null} />

      <div className="space-y-4">
        <AuthInput
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
        />

        <AuthInput
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          rightElement={
            <button type="button" onClick={() => setShowPassword(p => !p)}>
              {showPassword
                ? <EyeOff className="h-5 w-5 text-gray-400" />
                : <Eye    className="h-5 w-5 text-gray-400" />}
            </button>
          }
        />
      </div>

      <SubmitButton isSubmitting={isSubmitting} label="Sign in" />

      <div className="flex items-center justify-between text-sm">
        <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
          Forgot your password?
        </Link>
        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
          Create account
        </Link>
      </div>
    </form>
  )
}