// apps/server/src/middleware/rbac.ts
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export type Role =
  | 'super_admin' | 'cb_admin' | 'lead_auditor'
  | 'auditor' | 'staff' | 'accreditation_manager';

// Resource → action → roles allowed
const PERMISSIONS: Record<string, Record<string, Role[]>> = {
  audits: {
    create:     ['cb_admin', 'lead_auditor'],
    read:       ['cb_admin', 'lead_auditor', 'auditor', 'staff'],
    transition: ['cb_admin', 'lead_auditor'],
    delete:     ['cb_admin', 'super_admin'],
  },
  non_conformances: {
    create:  ['lead_auditor', 'auditor'],
    read:    ['cb_admin', 'lead_auditor', 'auditor', 'staff'],
    resolve: ['lead_auditor', 'cb_admin'],
  },
  certificates: {
    grant:   ['cb_admin'],
    upload:  ['cb_admin', 'lead_auditor'],
    read:    ['cb_admin', 'lead_auditor', 'auditor', 'staff'],
    revoke:  ['cb_admin', 'super_admin'],
  },
  documents: {
    create:  ['cb_admin', 'accreditation_manager', 'staff'],
    read:    ['cb_admin', 'lead_auditor', 'auditor', 'staff', 'accreditation_manager'],
    update:  ['cb_admin', 'accreditation_manager'],
    delete:  ['cb_admin', 'super_admin'],
    approve: ['cb_admin', 'accreditation_manager'],
  },
  users: {
    create:  ['cb_admin', 'super_admin'],
    read:    ['cb_admin', 'super_admin'],
    update:  ['cb_admin', 'super_admin'],
    delete:  ['super_admin'],
  },
  training: {
    read:     ['cb_admin', 'lead_auditor', 'auditor', 'accreditation_manager'],
    complete: ['auditor', 'lead_auditor'],
    approve:  ['cb_admin', 'accreditation_manager'],
  },
};

export function requirePermission(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // populated by auth middleware
    if (!user) return res.status(401).json({ error: 'Unauthenticated' });

    const allowed = PERMISSIONS[resource]?.[action] ?? [];
    if (!allowed.includes(user.role as Role)) {
      return res.status(403).json({
        error: `Role '${user.role}' cannot '${action}' on '${resource}'`,
      });
    }

    // CB isolation: non-super_admin can only access their own CB's data
    if (user.role !== 'super_admin' && req.params.cbId) {
      if (req.params.cbId !== user.cb_id) {
        return res.status(403).json({ error: 'Cross-CB access denied' });
      }
    }

    return next();
  };
}