// components/auth/ResetPasswordForm.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { AuthInput } from './AuthInput'
import { SubmitButton } from './SubmitButton'
import { ErrorAlert } from './AuthAlerts'

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const { updatePassword, updatePasswordError } = useAuth()

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await updatePassword(password)
      navigate('/login', {
        state: { successMessage: '✓ Password updated. Please sign in.' },
      })
    } catch (err) {
      console.error('Reset password error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <ErrorAlert error={updatePasswordError as Error | null} />

      <div className="space-y-4">
        <AuthInput
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          rightElement={
            <button type="button" onClick={() => setShowPassword(p => !p)}>
              {showPassword
                ? <EyeOff className="h-5 w-5 text-gray-400" />
                : <Eye    className="h-5 w-5 text-gray-400" />}
            </button>
          }
        />
      </div>

      <SubmitButton isSubmitting={isSubmitting} label="Update password" />

      <div className="text-sm">
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          ← Back to sign in
        </Link>
      </div>
    </form>
  )
}