import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  DATABASE_URL_NEON: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  APP_URL: z.string().url('APP_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),

  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_STORAGE_BUCKET: z.string().min(1, 'SUPABASE_STORAGE_BUCKET is required'),

  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email'),

  TERMII_API_KEY: z.string().min(1, 'TERMII_API_KEY is required'),
  TERMII_SENDER_ID: z.string().min(1, 'TERMII_SENDER_ID is required'),

  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  NEXT_PUBLIC_GEMINI_API_KEY: z.string().min(1, 'NEXT_PUBLIC_GEMINI_API_KEY is required'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 2));
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
