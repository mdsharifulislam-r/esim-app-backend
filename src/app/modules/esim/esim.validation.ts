import { z } from 'zod';

const getPackagesOfEsimZodSchema = z.object({
    body: z.object({
        type: z.string({ required_error: 'Type is required' }),
        country: z.string({ required_error: 'Country is required' }).optional(),
        page: z.number({ required_error: 'Page is required' }).optional(),
        limit: z.number({ required_error: 'Limit is required' }).optional(),
    }),
});

const makeOrderForPackageZodSchema = z.object({
    body: z.object({
        coupon: z.string().optional(),
    }),
})


export const EsimValidations = {
    getPackagesOfEsimZodSchema,
    makeOrderForPackageZodSchema
};
