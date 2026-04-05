import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    phone: z.string().trim().min(10, "Phone number is required").regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().trim()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string().trim().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;