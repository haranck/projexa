import {z} from 'zod'

const envSchema = z.object({
  PORT: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "PORT must be a number",
    }),

  MONGODB_URI: z.string().url(),

  JWT_ACCESS_SECRET: z.string().min(20),
  JWT_REFRESH_SECRET: z.string().min(20),

  GOOGLE_CLIENT_ID: z.string().min(10),

  EMAIL_HOST: z.string(),
  EMAIL_PORT: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val)),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string(),
  EMAIL_FROM: z.string(),

  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(6),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
