import { Request, Response } from "express";
import { CertificationBodiesService } from "./certification-bodies.service";

export class CertificationBodiesController {
  static async getAll(req: Request, res: Response) {
    try {
      const cbs = await CertificationBodiesService.getAll();
      res.json({
        status: "success",
        message: "Certification bodies fetched successfully",
        data: cbs,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          status: "error",
          message: "Failed to fetch certification bodies",
          error: err.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to fetch certification bodies",
          error: "An unknown error occurred",
        });
      }
    }
  }
}
