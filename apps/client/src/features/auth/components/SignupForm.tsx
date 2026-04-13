// components/auth/SignupForm.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { AuthInput } from './AuthInput'
import { SubmitButton } from './SubmitButton'
import { ErrorAlert } from './AuthAlerts'
import { useAuth } from '@/shared/hooks/useAuth'

export function SignupForm() {
  const navigate = useNavigate()
  const { signup, signupError } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const data = await signup({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name,
      })

      if (data?.user) {
        navigate('/', { replace: true })
      } else {
        // Email confirmation required — send user to login with a message
        navigate('/login', {
          state: { successMessage: '✉ Check your email to confirm your account.' },
        })
      }
    } catch (err) {
      console.error('Signup error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <ErrorAlert error={signupError as Error | null} />

      <div className="space-y-4">
        <AuthInput
          icon={<User className="h-5 w-5 text-gray-400" />}
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Full name"
        />

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
          autoComplete="new-password"
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

        <AuthInput
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
        />
      </div>

      <SubmitButton isSubmitting={isSubmitting} label="Sign up" />

      <div className="text-sm">
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          ← Back to sign in
        </Link>
      </div>
    </form>
  )
}