import { Router } from "express";
import { CertificationBodiesController } from "./certification-bodies.controller";

const router = Router();

router.get("/", CertificationBodiesController.getAll);

export default router;
