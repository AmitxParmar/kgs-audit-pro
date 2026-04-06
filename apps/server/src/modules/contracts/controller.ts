import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth";
import { supabase } from "../../config/supabase";
import { contractService } from "./service";

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

export const createContract = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Explicit validation for required fields
    const { client_id, contract_number, status } = req.body;
    if (!client_id || !contract_number || !status) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: client_id, contract_number, and status are required.",
      });
    }

    const result = await contractService.createContract(req.body, userId);

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

export const updateContract = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<any> => {
  try {
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
