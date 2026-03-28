import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()


const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  
  // Supabase
  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32).optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // File upload
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'),
  ALLOWED_FILE_TYPES: z.string().default('pdf,doc,docx,xls,xlsx,png,jpg,jpeg'),
  
  // CORS
  ALLOWED_ORIGINS: z.string().optional(),
})

export const env = envSchema.parse(process.env)