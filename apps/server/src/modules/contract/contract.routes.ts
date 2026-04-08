import { Router } from "express";
import {
  getContracts,
  createContract,
  getContractById,
  updateContract,
} from "./contract.controller";
import { authMiddleware } from "@/middleware/auth";

/**
 * Routes for contract management.
 * All routes are protected by authMiddleware.
 */
const router = Router();

router.get("/", authMiddleware, getContracts);
router.post("/", authMiddleware, createContract);
router.get("/:id", authMiddleware, getContractById);
router.put("/:id", authMiddleware, updateContract);

export default router;
