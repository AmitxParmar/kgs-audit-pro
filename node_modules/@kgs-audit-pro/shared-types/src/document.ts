import { z } from 'zod'

export const DocumentTypeSchema = z.enum([
  'audit_report',
  'certificate',
  'evidence',
  'procedure',
  'form',
  'photo',
  'other'
])
export type DocumentType = z.infer<typeof DocumentTypeSchema>

export const DocumentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  type: DocumentTypeSchema,
  file_path: z.string(),
  file_size: z.number().positive(),
  mime_type: z.string(),
  audit_id: z.string().uuid().optional(),
  uploaded_by: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
})
export type Document = z.infer<typeof DocumentSchema>

export const CreateDocumentSchema = DocumentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
})
export type CreateDocument = z.infer<typeof CreateDocumentSchema>

export const UpdateDocumentSchema = DocumentSchema.partial().omit({
  id: true,
  uploaded_by: true,
  created_at: true
})
export type UpdateDocument = z.infer<typeof UpdateDocumentSchema>
