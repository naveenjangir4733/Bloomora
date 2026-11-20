import type { PaginationMeta, PaginationParams } from '@/types/common.types';

export const toOffset = ({ page, limit }: PaginationParams): number => (page - 1) * limit;

export const buildPaginationMeta = (total: number, { page, limit }: PaginationParams): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};
