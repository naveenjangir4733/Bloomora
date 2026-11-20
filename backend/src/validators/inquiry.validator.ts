import { z } from 'zod';
import {
  optionalEmailSchema,
  optionalTextSchema,
  phoneSchema,
  slugSchema,
} from '@/validators/common.validator';

export const customOrderSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  phone: phoneSchema,
  email: optionalEmailSchema,
  categorySlug: slugSchema.nullish().transform((value): string | null => value ?? null),
  budget: z
    .number()
    .positive()
    .max(1_000_000)
    .nullish()
    .transform((value): number | null => value ?? null),
  neededBy: z
    .string()
    .date('Use the format YYYY-MM-DD')
    .nullish()
    .transform((value): string | null => value ?? null),
  description: z.string().trim().min(20, 'Tell us a little more (at least 20 characters)').max(2000),
});

export type CustomOrderDto = z.infer<typeof customOrderSchema>;

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().email('Enter a valid email address').max(150),
  phone: optionalTextSchema(20),
  subject: z.string().trim().min(3, 'Please add a subject').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactMessageDto = z.infer<typeof contactMessageSchema>;
