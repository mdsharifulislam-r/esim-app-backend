import { z } from 'zod';

const getPackagesOfEsimZodSchema = z.object({
    body: z.object({
        type: z.string({ required_error: 'Type is required' }),
        country: z.string({ required_error: 'Country is required' }).optional(),
        page: z.number({ required_error: 'Page is required' }).optional(),
        limit: z.number({ required_error: 'Limit is required' }).optional(),
        sort_order: z.enum(["price_low_to_high", "price_high_to_low", "validity_less_to_more", "validity_more_to_less"]).optional(),
    }),
});

const makeOrderForPackageZodSchema = z.object({
    body: z.object({
        coupon: z.string().optional(),
    }),
})


const getRegionalEsimPackagesZodSchema = z.object({
    query: z.object({
        sort_order: z.enum(["price_low_to_high", "price_high_to_low", "validity_less_to_more", "validity_more_to_less"]).optional(),
    }),
})


export const EsimValidations = {
    getPackagesOfEsimZodSchema,
    makeOrderForPackageZodSchema,
    getRegionalEsimPackagesZodSchema
};
