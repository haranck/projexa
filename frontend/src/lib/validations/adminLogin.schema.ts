import { z } from "zod";

export const adminLoginSchema = z.object({
    email: z.string().trim().email("Invalid email"),
    password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginSchemaType = z.infer<typeof adminLoginSchema>;
