import { z } from 'zod';

const createBlogZodSchema = z.object({
    body: z.object({
        title: z.string({required_error:"Title is required"}).min(1),
        content: z.string({required_error:"Content is required"}).min(1),
        image:z.any({required_error:"Image is required"})
    })
})

const updateBlogZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        image:z.any().optional()
    })
}
)


export const BlogValidations = {
    createBlogZodSchema,
    updateBlogZodSchema
};
