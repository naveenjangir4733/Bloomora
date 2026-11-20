import { z } from 'zod';

export type UserRole = 'admin' | 'user' | 'editor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
  email: z.string().email('Invalid email address format'),
  role: z.enum(['admin', 'user', 'editor']).default('user'),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = createUserSchema.partial();

export const userQuerySchema = z.object({
  search: z.string().optional(),
  role: z.enum(['admin', 'user', 'editor']).optional(),
  isActive: z
    .string()
    .transform((val: string): boolean => val === 'true')
    .optional(),
  page: z
    .string()
    .transform((val: string): number => Math.max(1, parseInt(val, 10) || 1))
    .default('1'),
  limit: z
    .string()
    .transform((val: string): number => Math.min(100, Math.max(1, parseInt(val, 10) || 10)))
    .default('10'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserQueryDto = z.infer<typeof userQuerySchema>;
