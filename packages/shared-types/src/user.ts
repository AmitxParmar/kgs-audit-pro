import { z } from 'zod'

export const UserRoleSchema = z.enum([
  'admin',
  'auditor',
  'audit_manager',
  'client',
  'viewer'
])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: UserRoleSchema,
  is_active: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
})
export type User = z.infer<typeof UserSchema>

export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
})
export type CreateUser = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  created_at: true
})
export type UpdateUser = z.infer<typeof UpdateUserSchema>
