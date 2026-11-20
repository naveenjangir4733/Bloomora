import { z } from 'zod';
import { booleanQuerySchema, limitSchema } from '@/validators/common.validator';

export const reviewQuerySchema = z.object({
  featured: booleanQuerySchema.optional(),
  limit: limitSchema(50, 12),
});

export type ReviewQueryDto = z.infer<typeof reviewQuerySchema>;
