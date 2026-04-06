import { supabase } from "../../config/supabase";

export interface ContractInput {
  client_id: string;
  contract_number: string;
  contract_type?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  status: string;
  created_by?: string;
  reviewed_by?: string;
  review_notes?: string;
  reviewed_at?: string;
  sent_at?: string;
  signed_at?: string;
  contract_status?: string;
  application_id?: string;
  pdf_url?: string;
  emailed_at?: string;
}

export const contractService = {
  async createContract(data: ContractInput, userId: string) {
    if (!data.client_id || !data.contract_number || !data.status) {
      throw new Error(
        "client_id, contract_number, and status are required fields",
      );
    }

    try {
      const { data: contract, error } = await supabase
        .from("contract_master")
        .insert({
          ...data,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return contract;
    } catch (error) {
      console.error("ERROR CREATING CONTRACT:", error);
      throw error;
    }
  },

  async updateContract(id: string, data: Partial<ContractInput>) {
    try {
      const { data: contract, error } = await supabase
        .from("contract_master")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!contract) {
        throw new Error(`Contract with id ${id} not found.`);
      }
      return contract;
    } catch (error) {
      console.error("ERROR UPDATING CONTRACT:", error);
      throw error;
    }
  },
};
