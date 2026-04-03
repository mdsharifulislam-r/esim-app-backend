import { z } from 'zod';

const createSupportZodSchema = z.object({
    body: z.object({
        name: z.string({required_error:"Name is required"}).min(1),
        email: z.string({required_error:"Email is required"}).min(1),
        contact: z.string({required_error:"Contact is required"}).min(1),
        subject: z.string({required_error:"Subject is required"}).min(1),
        message: z.string({required_error:"Message is required"}).min(1),
    })
})

const replySupportMessageZodSchema = z.object({
    body: z.object({
        message: z.string({required_error:"Message is required"}).min(1),
    })
})
export const SupportValidations = {
    createSupportZodSchema,
    replySupportMessageZodSchema
};
