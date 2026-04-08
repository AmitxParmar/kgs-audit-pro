import { z } from 'zod'

export const AuditStatusSchema = z.enum([
  'client_onboarded',
  'audit_planned',
  'audit_in_progress',
  'nc_raised',
  'report_under_review',
  'cert_decision',
  'cert_granted',
  'cert_uploaded',
  'active',
  'denied',
  'suspended'
])
export type AuditStatus = z.infer<typeof AuditStatusSchema>

// Removing AuditType as it's not present in the audits database table

export const AuditSchema = z.object({
  id: z.string().uuid().optional(),
  cb_id: z.string().uuid(),
  client_id: z.string().uuid(),
  standard_id: z.string().uuid(),
  lead_auditor_id: z.string().uuid().nullable(),
  status: AuditStatusSchema.default('report_under_review'),
  planned_date: z.string().optional(),
  scope: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
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
  created_at: true,
  updated_at: true
})
export type UpdateAudit = z.infer<typeof UpdateAuditSchema>
