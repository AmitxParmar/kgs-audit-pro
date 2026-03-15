import { z } from 'zod'

export const AuditStatusSchema = z.enum(['planning', 'execution', 'review', 'completed'])
export type AuditStatus = z.infer<typeof AuditStatusSchema>

export const AuditTypeSchema = z.enum([
  'iso_9001',
  'iso_14001', 
  'iso_45001',
  'iso_27001',
  'iso_22000',
  'custom'
])
export type AuditType = z.infer<typeof AuditTypeSchema>

export const AuditSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  audit_type: AuditTypeSchema,
  status: AuditStatusSchema,
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional(),
  created_by: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
})
export type Audit = z.infer<typeof AuditSchema>

export const CreateAuditSchema = AuditSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
})
export type CreateAudit = z.infer<typeof CreateAuditSchema>

export const UpdateAuditSchema = AuditSchema.partial().omit({
  id: true,
  created_by: true,
  created_at: true
})
export type UpdateAudit = z.infer<typeof UpdateAuditSchema>
