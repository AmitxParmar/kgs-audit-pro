import { Route } from 'react-router-dom'
import { GuestRoute } from '../AuthProvider'
import { AuthLayout } from '../layout'
import { LoginForm } from '../components/LoginForm'
import { ForgotPasswordForm } from '../components/ForgetPasswordForm'
import { ResetPasswordForm } from '../components/ResetPasswordForm'
import { SignupForm } from '../components/SignupForm'

export function AuthRoutes() {
  return (
    <Route element={<GuestRoute><AuthLayout title="auth title" /></GuestRoute>}>
      <Route index                    element={<LoginForm />} />
      <Route path="signup"            element={<SignupForm />} />
      <Route path="forgot-password"   element={<ForgotPasswordForm />} />
      <Route path="reset-password"    element={<ResetPasswordForm />} />
    </Route>
  )
}