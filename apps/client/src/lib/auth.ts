import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials extends LoginCredentials {
  name: string
  confirmPassword: string
}

export interface ResetPasswordData {
  email: string
}

export interface UpdatePasswordData {
  password: string
  confirmPassword: string
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error
    return data
  },

  signup: async ({ name, email, password }: {
  name: string
  email: string
  password: string
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }   // stores name in user_metadata
    }
  })
  if (error) throw error
  return data
},

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
    return data
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    })

    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  getSession: async (): Promise<AuthUser | null> => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  return {
    id:    session.user.id,
    email: session.user.email!,
    name:  session.user.user_metadata?.name,
  }
},

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
        })
      } else {
        callback(null)
      }
    })
  },
}
