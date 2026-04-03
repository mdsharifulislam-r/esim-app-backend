import { z } from 'zod';

const getPackagesOfEsimZodSchema = z.object({
    body: z.object({
        type: z.string({required_error: 'Type is required'}),
        country: z.string({required_error: 'Country is required'}).optional(),
        page: z.number({required_error: 'Page is required'}).optional(),
        limit: z.number({required_error: 'Limit is required'}).optional(),
    }),
});

const makeOrderForPackageZodSchema = z.object({
    body: z.object({
        package_id: z.string({required_error: 'Package id is required'}),
        type: z.string({required_error: 'Type is required'}),
        country: z.string({required_error: 'Country is required'}).optional(),
        supported_countries: z.any(),
        net_price: z.number({required_error: 'Net price is required'}).optional(),
    }),
})


export const EsimValidations = {
    getPackagesOfEsimZodSchema,
    makeOrderForPackageZodSchema
};
