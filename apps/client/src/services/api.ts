import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL;

console.log("API URL:", API_URL); 

export async function apiFetch(path: string, options: RequestInit = {}) {

  // ✅ Get token from Supabase
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  if (!token) {
    throw new Error("User not logged in")
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // ✅ VERY IMPORTANT
      ...(options.headers || {}),
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'API error')
  }

  return res.json()
}