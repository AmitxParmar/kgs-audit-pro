"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
const PERMISSIONS = {
    audits: {
        create: ['cb_admin', 'lead_auditor'],
        read: ['cb_admin', 'lead_auditor', 'auditor', 'staff'],
        transition: ['cb_admin', 'lead_auditor'],
        delete: ['cb_admin', 'super_admin'],
    },
    non_conformances: {
        create: ['lead_auditor', 'auditor'],
        read: ['cb_admin', 'lead_auditor', 'auditor', 'staff'],
        resolve: ['lead_auditor', 'cb_admin'],
    },
    certificates: {
        grant: ['cb_admin'],
        upload: ['cb_admin', 'lead_auditor'],
        read: ['cb_admin', 'lead_auditor', 'auditor', 'staff'],
        revoke: ['cb_admin', 'super_admin'],
    },
    documents: {
        create: ['cb_admin', 'accreditation_manager', 'staff'],
        read: ['cb_admin', 'lead_auditor', 'auditor', 'staff', 'accreditation_manager'],
        update: ['cb_admin', 'accreditation_manager'],
        delete: ['cb_admin', 'super_admin'],
        approve: ['cb_admin', 'accreditation_manager'],
    },
    users: {
        create: ['cb_admin', 'super_admin'],
        read: ['cb_admin', 'super_admin'],
        update: ['cb_admin', 'super_admin'],
        delete: ['super_admin'],
    },
    training: {
        read: ['cb_admin', 'lead_auditor', 'auditor', 'accreditation_manager'],
        complete: ['auditor', 'lead_auditor'],
        approve: ['cb_admin', 'accreditation_manager'],
    },
};
function requirePermission(resource, action) {
    return async (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ error: 'Unauthenticated' });
        const allowed = PERMISSIONS[resource]?.[action] ?? [];
        if (!allowed.includes(user.role)) {
            return res.status(403).json({
                error: `Role '${user.role}' cannot '${action}' on '${resource}'`,
            });
        }
        if (user.role !== 'super_admin' && req.params.cbId) {
            if (req.params.cbId !== user.cb_id) {
                return res.status(403).json({ error: 'Cross-CB access denied' });
            }
        }
        return next();
    };
}
//# sourceMappingURL=rbac.js.map