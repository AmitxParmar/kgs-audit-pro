// components/auth/ForgotPasswordForm.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { AuthInput } from "./AuthInput";
import { ErrorAlert } from "./AuthAlerts";
import { SubmitButton } from "./SubmitButton";

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { resetPassword, resetPasswordError } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      navigate("/login", {
        state: {
          successMessage: "✉ Password reset link sent — check your email.",
        },
      });
    } catch (err) {
      console.error("Forgot password error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <ErrorAlert error={resetPasswordError as Error | null} />

      <div className="space-y-4">
        <AuthInput
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />
      </div>

      <SubmitButton isSubmitting={isSubmitting} label="Send reset link" />

      <div className="text-sm">
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          ← Back to sign in
        </Link>
      </div>
    </form>
  );
}
