import { z } from 'zod'

export const forgotSchema = z.object({
    email:z.string().trim().email('Invalid email')
})

export type ForgotSchemaType = z.infer<typeof forgotSchema>
