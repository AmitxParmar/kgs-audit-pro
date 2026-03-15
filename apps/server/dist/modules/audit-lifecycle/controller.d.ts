import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
export declare const getAudits: (req: Request, res: Response) => Promise<void>;
export declare const createAudit: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getAuditById: (req: Request, res: Response) => Promise<void>;
export declare const updateAudit: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=controller.d.ts.map