import { z } from 'zod';

const createPricingrulesValidation = z.object({
    body: z.object({
        margin_price: z.number({ required_error: "Margin price is required" }),
        tax_percent: z.number({ required_error: "Tax percent is required" }),
        type: z.enum(["country", "region", "global"], { required_error: "Type is required" }),
        name: z.string({ required_error: "Name is required" })
    })
})


const updatePricingrulesValidation = z.object({
    body: z.object({
        margin_price: z.number().optional(),
        tax_percent: z.number().optional(),
        type: z.enum(["country", "region", "global"]).optional(),
        name: z.string().optional()
    })
})


export const PricingrulesValidations = { createPricingrulesValidation, updatePricingrulesValidation };
