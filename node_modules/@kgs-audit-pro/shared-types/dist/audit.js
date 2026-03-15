"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuditSchema = exports.CreateAuditSchema = exports.AuditSchema = exports.AuditTypeSchema = exports.AuditStatusSchema = void 0;
const zod_1 = require("zod");
exports.AuditStatusSchema = zod_1.z.enum(['planning', 'execution', 'review', 'completed']);
exports.AuditTypeSchema = zod_1.z.enum([
    'iso_9001',
    'iso_14001',
    'iso_45001',
    'iso_27001',
    'iso_22000',
    'custom'
]);
exports.AuditSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    client_id: zod_1.z.string().uuid(),
    audit_type: exports.AuditTypeSchema,
    status: exports.AuditStatusSchema,
    start_date: zod_1.z.string().datetime(),
    end_date: zod_1.z.string().datetime().optional(),
    created_by: zod_1.z.string().uuid(),
    created_at: zod_1.z.string().datetime().optional(),
    updated_at: zod_1.z.string().datetime().optional()
});
exports.CreateAuditSchema = exports.AuditSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});
exports.UpdateAuditSchema = exports.AuditSchema.partial().omit({
    id: true,
    created_by: true,
    created_at: true
});
//# sourceMappingURL=audit.js.map