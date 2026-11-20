import { z } from 'zod';
import { PRODUCT_BADGES, PRODUCT_SORTS } from '@/types/product.types';
import { booleanQuerySchema, limitSchema, pageSchema, slugSchema } from '@/validators/common.validator';

const priceSchema = z.coerce.number().min(0).max(1_000_000);

export const productQuerySchema = z
  .object({
    search: z
      .string()
      .trim()
      .max(100)
      .optional()
      .transform((value): string | undefined => value || undefined),
    category: slugSchema.optional(),
    featured: booleanQuerySchema.optional(),
    badge: z.enum(PRODUCT_BADGES).optional(),
    minPrice: priceSchema.optional(),
    maxPrice: priceSchema.optional(),
    inStock: booleanQuerySchema.optional(),
    sort: z.enum(PRODUCT_SORTS).default('featured'),
    page: pageSchema,
    limit: limitSchema(48, 12),
  })
  .refine(
    ({ minPrice, maxPrice }): boolean => minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice,
    { message: 'minPrice must be less than or equal to maxPrice', path: ['minPrice'] },
  );

export type ProductQueryDto = z.infer<typeof productQuerySchema>;
