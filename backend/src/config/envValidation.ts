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
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsedEnv.error.format());
  process.exit(1);
}


export const env = parsedEnv.data;
