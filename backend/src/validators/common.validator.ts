import { z } from 'zod';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PAKISTAN_MOBILE_PATTERN = /^(?:\+92|0)3\d{9}$/;

export const slugSchema = z.string().trim().max(120).regex(SLUG_PATTERN, 'Invalid slug');

export const pageSchema = z.coerce.number().int().min(1).default(1);

export const limitSchema = (max: number, fallback: number): z.ZodDefault<z.ZodNumber> =>
  z.coerce.number().int().min(1).max(max).default(fallback);

/** Accepts the query-string literals `true` / `false`. */
export const booleanQuerySchema = z.enum(['true', 'false']).transform((value): boolean => value === 'true');

/** Optional free text: trims and turns blank input into `null`. */
export const optionalTextSchema = (max: number): z.ZodType<string | null, z.ZodTypeDef, unknown> =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value): string | null => (value ? value : null));

export const optionalEmailSchema = z
  .union([z.literal(''), z.string().trim().email('Enter a valid email address').max(150)])
  .optional()
  .transform((value): string | null => (value ? value : null));

/** Pakistani mobile number, normalised by removing spaces and dashes (e.g. 03001234567). */
export const phoneSchema = z
  .string()
  .trim()
  .transform((value): string => value.replaceAll(/[\s-]/g, ''))
  .pipe(z.string().regex(PAKISTAN_MOBILE_PATTERN, 'Enter a valid mobile number, e.g. 0300 1234567'));

export const slugParamsSchema = z.object({ slug: slugSchema });
export type SlugParams = z.infer<typeof slugParamsSchema>;

export const idParamsSchema = z.object({ id: z.string().uuid('Invalid id') });
export type IdParams = z.infer<typeof idParamsSchema>;
