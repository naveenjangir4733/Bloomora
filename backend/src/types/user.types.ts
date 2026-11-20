import type { PaginationParams } from '@/types/common.types';

export const USER_ROLES = ['admin', 'editor', 'customer'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters extends PaginationParams {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface NewUser {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export type UserChanges = Partial<NewUser>;
