import { z } from 'zod';

const createNewsletterSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  }),
});

const updateNewsletterSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }).optional(),
  }),   
});


export const NewsletterValidations = { createNewsletterSchema, updateNewsletterSchema };
