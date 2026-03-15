"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentSchema = exports.CreateDocumentSchema = exports.DocumentSchema = exports.DocumentTypeSchema = void 0;
const zod_1 = require("zod");
exports.DocumentTypeSchema = zod_1.z.enum([
    'audit_report',
    'certificate',
    'evidence',
    'procedure',
    'form',
    'photo',
    'other'
]);
exports.DocumentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().min(1).max(255),
    type: exports.DocumentTypeSchema,
    file_path: zod_1.z.string(),
    file_size: zod_1.z.number().positive(),
    mime_type: zod_1.z.string(),
    audit_id: zod_1.z.string().uuid().optional(),
    uploaded_by: zod_1.z.string().uuid(),
    created_at: zod_1.z.string().datetime().optional(),
    updated_at: zod_1.z.string().datetime().optional()
});
exports.CreateDocumentSchema = exports.DocumentSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});
exports.UpdateDocumentSchema = exports.DocumentSchema.partial().omit({
    id: true,
    uploaded_by: true,
    created_at: true
});
//# sourceMappingURL=document.js.map