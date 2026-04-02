import { supabase } from "./supabase";

// ✅ Single AuthUser interface
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?:
    | "super_admin"
    | "cb_admin"
    | "lead_auditor"
    | "auditor"
    | "staff"
    | "accreditation_manager";
  cb_id?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  password: string;
  confirmPassword: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw error;
    return data;
  },

  async signup(credentials: SignupCredentials) {
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { name: credentials.name },
      },
    });
    if (error) throw error;
    return data;
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
