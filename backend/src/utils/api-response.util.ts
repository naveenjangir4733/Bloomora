import type {
  ApiErrorBody,
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginatedResult,
} from '@/types/common.types';

const now = (): string => new Date().toISOString();

/** Builders for the standard `{ success, data | error, timestamp }` envelopes. */
export const ApiResponse = {
  success<T>(data: T, message?: string): ApiSuccessResponse<T> {
    return { success: true, data, ...(message ? { message } : {}), timestamp: now() };
  },

  paginated<T>(result: PaginatedResult<T>, message?: string): ApiSuccessResponse<T[]> {
    return {
      success: true,
      data: result.items,
      meta: result.meta,
      ...(message ? { message } : {}),
      timestamp: now(),
    };
  },

  error(error: ApiErrorBody): ApiErrorResponse {
    return { success: false, error, timestamp: now() };
  },
} as const;
