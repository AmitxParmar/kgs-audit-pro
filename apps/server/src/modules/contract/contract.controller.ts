import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middleware/auth";
import { supabase } from "@/config/supabase";
import { contractService } from "./contract.service";
import { CreateContractSchema } from "@/schemas/contract.schema";

//TODO: add validation and imporve error handling
/**
 * Retrieves all contracts from the master table, ordered by creation date.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with list of contracts or error message
 */
export const getContracts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("contract_master")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Handles the creation of a new contract.
 * Validates required fields and associates the contract with the authenticated user.
 *
 * @param req - Authenticated Express request object containing contract data
 * @param res - Express response object
 * @returns JSON response with success status and created contract data
 */
export const createContract = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Use Zod schema for validation before extracting req.body
    const validation = CreateContractSchema.safeParse(req.body);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${firstError.path.join(".")} - ${firstError.message}`,
        errors: validation.error.errors,
      });
    }

    const result = await contractService.createContract(
      validation.data,
      userId,
    );

    return res.status(201).json({
      success: true,
      message: "Contract created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create contract",
      error: error.message,
    });
  }
};

/**
 * Fetches a single contract by its unique ID.
 *
 * @param req - Express request object with ID in params
 * @param res - Express response object
 * @returns JSON response with contract data or 404 if not found
 */
export const getContractById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    console.log("Fetching contract with ID:", req.params.id);
    const { data, error } = await supabase
      .from("contract_master")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();

    console.log("Supabase response - Data:", data, "Error:", error);

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Contract not found",
      });
    }

    return res.json(data);
  } catch (error: any) {
    console.error("Error in getContractById:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Updates an existing contract's information.
 *
 * @param req - Authenticated Express request object with ID in params and update data in body
 * @param res - Express response object
 * @returns JSON response with updated contract data
 */
export const updateContract = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<any> => {
  try {
    // (Optional) Add validation for updates if needed, currently using partial body
    const result = await contractService.updateContract(
      req.params.id,
      req.body,
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
