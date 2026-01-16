import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().email("Invalid email"),
    password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
