import { supabase } from "../../config/supabase";

export class CertificationBodiesService {
  static async getAll() {
    const { data, error } = await supabase
      .from("certification_bodies")
      .select("id, name, accred_no, country, status")
      .order("name");

    if (error) throw error;
    return data;
  }
}
