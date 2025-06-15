import {z} from 'zod'

export const emailSchema = z.string().trim().email().min(3).max(255)
export const passwordSchema = z.string().trim().min(6).max(255)

export const registerSchema = z.object({
    username: z.string().trim().min(3).max(255),
    email: emailSchema,
    password: passwordSchema
})

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional()
})

export const resetPasswordSchema = z.object({
    password: passwordSchema
})