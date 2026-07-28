import { z } from 'zod';

const createPricingrulesValidation = z.object({
    body: z.object({
        margin_price: z.number({ required_error: "Margin price is required" }),
        tax_percent: z.number({ required_error: "Tax percent is required" })
    })
})


export const PricingrulesValidations = { createPricingrulesValidation };
