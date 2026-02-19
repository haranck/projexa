import { z } from 'zod'

const envSchema = z.object({
  PORT: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "PORT must be a number",
    }),

  MONGODB_URI: z.string().trim().url(),

  JWT_ACCESS_SECRET: z.string().trim().min(20),
  JWT_REFRESH_SECRET: z.string().trim().min(20),

  GOOGLE_CLIENT_ID: z.string().trim().min(10),

  EMAIL_HOST: z.string().trim(),
  EMAIL_PORT: z
    .string()
    .trim()
    .transform(Number)
    .refine((val) => !isNaN(val)),
  EMAIL_USER: z.string().trim().email(),
  EMAIL_PASS: z.string().trim(),
  EMAIL_FROM: z.string().trim(),

  ADMIN_EMAIL: z.string().trim().email(),
  ADMIN_PASSWORD: z.string().trim().min(6),
  NODE_ENV: z.enum(["development", "production"]),
  FRONTEND_URL: z.string().trim().url(),
  
  AUTH_API_PREFIX: z.string().trim().min(1),
  ADMIN_API_PREFIX: z.string().trim().min(1),
  USER_API_PREFIX: z.string().trim().min(1),
  WORKSPACE_API_PREFIX: z.string().trim().min(1),
  STRIPE_API_PREFIX: z.string().trim().min(1),
  PROJECT_API_PREFIX: z.string().trim().min(1),

  AWS_REGION: z.string().trim(),
  AWS_ACCESS_KEY: z.string().trim(),
  AWS_SECRET_KEY: z.string().trim(),
  AWS_BUCKET_NAME: z.string().trim(),
  CLOUDFRONT_URL: z.string().trim(),
  STRIPE_SECRET_KEY: z.string().trim(),
  STRIPE_WEBHOOK_SECRET: z.string().trim(),
  STRIPE_PUBLIC_KEY: z.string().trim(),
  STRIPE_DEFAULT_PRICE_ID: z.string().trim().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsedEnv.error.format());
  process.exit(1);
}


export const env = parsedEnv.data;
