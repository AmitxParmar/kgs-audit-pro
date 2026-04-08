import { Request, Response } from "express";
import { AuditService } from "./audit-reporting.service";
import { AuditSchema } from "@/schemas/audit-reporting.schema";

export class AuditController {
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await AuditService.getStats();
      res.json({
        status: "success",
        message: "Stats fetched successfully",
        data: stats,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          status: "error",
          message: "Failed to fetch stats",
          error: err.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to fetch stats",
          error: "An unknown error occurred",
        });
      }
    }
  }

  static async getAudit(req: Request, res: Response) {
    try {
      const audit = await AuditService.getAuditById(req.params.id);
      res.json({
        status: "success",
        message: "Audit fetched successfully",
        data: audit,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          status: "error",
          message: "Failed to fetch audit",
          error: err.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to fetch audit",
          error: "An unknown error occurred",
        });
      }
    }
  }

  static async createAudit(req: Request, res: Response) {
    try {
      const validated = AuditSchema.safeParse(req.body);
      if (!validated.success) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          error: validated.error.issues,
        });
      }
      const audit = await AuditService.createAudit(validated.data);
      res.status(201).json({
        status: "success",
        message: "Audit created successfully",
        data: audit,
      });
    } catch (err: any) {
      console.error("Create audit error:", err);
      res.status(500).json({
        status: "error",
        message: "Failed to create audit",
        error: err.message || err,
      });
    }
  }

  static async getGroupedAudits(req: Request, res: Response) {
    try {
      const { clientId, cbId, status, fromDate, toDate, limit } = req.query;
      const grouped = await AuditService.getAuditsGroupedByStatus(
        {
          clientId: clientId as string,
          cbId: cbId as string,
          status: status as string,
          fromDate: fromDate as string,
          toDate: toDate as string,
        },
        limit ? parseInt(limit as string) : undefined,
      );
      res.json({
        status: "success",
        message: "Grouped audits fetched successfully",
        data: grouped,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          status: "error",
          message: "Failed to fetch grouped audits",
          error: err.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to fetch grouped audits",
          error: "An unknown error occurred",
        });
      }
    }
  }

  static async getStandards(req: Request, res: Response) {
    try {
      const standards = await AuditService.getStandards();
      res.json({
        status: "success",
        message: "Standards fetched successfully",
        data: standards,
      });
    } catch (err: any) {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch standards",
        error: err.message,
      });
    }
  }

  static async getAuditors(req: Request, res: Response) {
    try {
      const auditors = await AuditService.getAuditors();
      res.json({
        status: "success",
        message: "Auditors fetched successfully",
        data: auditors,
      });
    } catch (err: any) {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch auditors",
        error: err.message,
      });
    }
  }
}
