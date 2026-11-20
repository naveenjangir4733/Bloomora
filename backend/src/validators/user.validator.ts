import { z } from 'zod';
import { USER_ROLES } from '@/types/user.types';
import { booleanQuerySchema, limitSchema, pageSchema } from '@/validators/common.validator';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email address format').max(150),
  role: z.enum(USER_ROLES).default('customer'),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().toLowerCase().email().max(150),
    role: z.enum(USER_ROLES),
    isActive: z.boolean(),
  })
  .partial()
  .refine((changes): boolean => Object.keys(changes).length > 0, { message: 'Provide at least one field to update' });

export const userQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value): string | undefined => value || undefined),
  role: z.enum(USER_ROLES).optional(),
  isActive: booleanQuerySchema.optional(),
  page: pageSchema,
  limit: limitSchema(100, 10),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserQueryDto = z.infer<typeof userQuerySchema>;
