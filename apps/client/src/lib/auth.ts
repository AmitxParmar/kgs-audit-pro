import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  name?: string
  user_role?: 'super_admin' | 'cb_admin' ...  // ← second uses 'user_role'
  cb_id?: string
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

export interface AuthUser {
  id:    string
  email: string
  name?: string
  user_role?: 'super_admin' | 'cb_admin' | 'lead_auditor' | 'auditor' | 'staff' | 'accreditation_manager'
  cb_id?: string
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

  async signup(credentials: SignupCredentials) {
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
      },
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
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    console.log("SESSION:", session)
    console.log("SESSION ERROR:", error)

    if (!session?.user) return null

    const { data: profile } = await supabase
      .from('users')
      .select('role, cb_id, full_name')
      .eq('id', session.user.id)
      .maybeSingle()

    return {
      id: session.user.id,
      email: session.user.email!,
      name: profile?.full_name ?? session.user.user_metadata?.name,
      role: profile?.role,
      cb_id: profile?.cb_id,
    }
  } catch (err) {
    console.error('getSession error:', err)
    return null
  }
},

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) { callback(null); return }

    // ← Same — query users table, not JWT
    const { data: profile } = await supabase
      .from('users')
      .select('role, cb_id, full_name')
      .eq('id', session.user.id)
      .maybeSingle()

    callback({
      id:    session.user.id,
      email: session.user.email!,
      name:  profile?.full_name ?? session.user.user_metadata?.name,
      role:  profile?.role,
      cb_id: profile?.cb_id,
    })
  })
},
}
