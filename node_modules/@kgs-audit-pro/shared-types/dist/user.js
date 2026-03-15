"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = exports.CreateUserSchema = exports.UserSchema = exports.UserRoleSchema = void 0;
const zod_1 = require("zod");
exports.UserRoleSchema = zod_1.z.enum([
    'admin',
    'auditor',
    'audit_manager',
    'client',
    'viewer'
]);
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1).max(100),
    role: exports.UserRoleSchema,
    is_active: zod_1.z.boolean().default(true),
    created_at: zod_1.z.string().datetime().optional(),
    updated_at: zod_1.z.string().datetime().optional()
});
exports.CreateUserSchema = exports.UserSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});
exports.UpdateUserSchema = exports.UserSchema.partial().omit({
    id: true,
    created_at: true
});
//# sourceMappingURL=user.js.map