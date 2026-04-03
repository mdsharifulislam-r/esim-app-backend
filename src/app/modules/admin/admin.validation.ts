import { z } from 'zod';

const createInfluencerZodSchema = z.object({
    body: z.object({
        name: z.string({required_error:"Name is required"}).min(1),
        email: z.string({required_error:"Email is required"}).min(1),
        password: z.string({required_error:"Password is required"}).min(1),
        contact: z.string({required_error:"Contact is required"}).optional(),
        image: z.string({required_error:"Profile is required"}).optional(),
    })
})

const updateInfluencerZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        password: z.string().optional(),
        contact: z.string().optional(),
        image: z.string().optional(),
    })
}
)

const setDiscountForUserZodSchema = z.object({
    body: z.object({
        amount: z.number({required_error:"Amount is required"})
    })
}
)

export const AdminValidations = { 
    createInfluencerZodSchema,
    updateInfluencerZodSchema,  
    setDiscountForUserZodSchema
 };
