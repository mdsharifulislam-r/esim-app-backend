import { z } from 'zod';

const createImagebannerSchema = z.object({
    body: z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  status: z.enum(['active', 'inactive'], { message: 'Status must be either "active" or "inactive"' }),
})
})

const updateImagebannerSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  })
});


export const ImagebannerValidations = { createImagebannerSchema, updateImagebannerSchema };
