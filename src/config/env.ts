import 'dotenv/config';
import { z } from 'zod';

// Treat empty strings in .env (KEY=) as "not set"
const optionalString = (schema: z.ZodString) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional());

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    DATABASE_URL: z.string().min(1),
    CLIENT_URL: z.string().min(1),
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),

    RESEND_API_KEY: z.string().min(1),
    MAIL_FROM: z.string().min(1).default('Portfolio Contact <onboarding@resend.dev>'),
    CONTACT_RECEIVER_EMAIL: z.string().email(),

    UPSTASH_REDIS_REST_URL: optionalString(z.string().url()),
    UPSTASH_REDIS_REST_TOKEN: optionalString(z.string().min(1)),

    PORTFOLIO_CACHE_TTL: z.coerce.number().int().min(0).default(300),
  })
  .superRefine((value, ctx) => {
    if (
      value.NODE_ENV === 'production' &&
      (!value.UPSTASH_REDIS_REST_URL || !value.UPSTASH_REDIS_REST_TOKEN)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['UPSTASH_REDIS_REST_URL'],
        message: 'Upstash credentials are required in production (contact rate limiting).',
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  // Throw instead of process.exit so serverless logs show the reason clearly
  throw new Error(`Invalid environment variables:\n${details}`);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';

export const allowedOrigins = env.CLIENT_URL.split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);