import { CreateContract } from "@/schemas/contract.schema";
import { supabase } from "../../config/supabase";

/**
 * Service for handling contract-related business logic and database operations.
 */
export const contractService = {
  /**
   * Creates a new contract in the system.
   * 
   * @param data - The contract data to insert
   * @param userId - ID of the user creating the contract
   * @returns The newly created contract record
   * @throws Error if required fields are missing or if database insertion fails
   */
  async createContract(data: CreateContract, userId: string) {
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

  /**
   * Updates an existing contract by its ID.
   * 
   * @param id - The unique ID of the contract to update
   * @param data - Partial contract data to apply
   * @returns The updated contract record
   * @throws Error if the contract is not found or if database update fails
   */
  async updateContract(id: string, data: Partial<CreateContract>) {
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
