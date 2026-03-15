import { Request, Response, NextFunction } from 'express';
export type Role = 'super_admin' | 'cb_admin' | 'lead_auditor' | 'auditor' | 'staff' | 'accreditation_manager';
export declare function requirePermission(resource: string, action: string): (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=rbac.d.ts.map