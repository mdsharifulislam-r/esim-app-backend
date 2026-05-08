import { z } from 'zod';

const createCartValidationZodSchema = z.object({
    body: z.any({ required_error: "body is required" })
})


const updateCartValidationZodSchema = z.object({
    body: z.object({
        quantity: z.number({ required_error: "quantity is required" })
    })
})

export const CartValidations = { createCartValidationZodSchema, updateCartValidationZodSchema };
