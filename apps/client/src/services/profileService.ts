import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;      // profiles.id (NOT auth.users.id)
  name: string;
  email: string;
  role: string | null;
  cb_id?: string;  // optional — present if the profile has a CB link
}

export const profileService = {
  /**
   * Returns the current user's profile row.
   * profiles.id is its own UUID; look up by email since there is no
   * direct FK between profiles and auth.users in this schema.
   */
  async getCurrent(): Promise<Profile> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("Not authenticated");

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, name, email, role")
      .eq("email", user.email!)
      .maybeSingle();

    if (error) throw error;
    if (!profile) {
      throw new Error(
        `No profile found for ${user.email}. ` +
        "Please contact your administrator to create a profile.",
      );
    }

    return profile as Profile;
  },

  /**
   * Returns the auth user object. Use this when you need auth.users.id
   * (e.g. for application_master.last_action_by which FK→ auth.users).
   */
  async getAuthUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Not authenticated");
    return user;
  },
};
