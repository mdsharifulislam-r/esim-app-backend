import { z } from 'zod';

const createBannerZodSchema = z.object({
    body: z.object({
        text: z.string({
            required_error: 'Text is required',
        }),
    }),
})

const updateBannerZodSchema = z.object({
    body: z.object({
        text: z.string().optional(),
        status: z.enum(["active", "inactive"]).optional(),
    }),
    params: z.object({
        id: z.string({
            required_error: 'ID is required',
        }),
    }),
})

export const BannerValidations = { createBannerZodSchema, updateBannerZodSchema };



