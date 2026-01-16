import {z} from 'zod'

export const resetPasswordSchema = z.object({
    password: z.string().trim().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().trim().min(6, "Confirm Password must be at least 6 characters long"),
})

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>

