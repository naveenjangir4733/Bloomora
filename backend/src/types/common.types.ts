export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export const ERROR_CODES = [
  'BAD_REQUEST',
  'VALIDATION_ERROR',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'UNPROCESSABLE_ENTITY',
  'INVALID_JSON',
  'SERVICE_UNAVAILABLE',
  'INTERNAL_SERVER_ERROR',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiErrorBody {
  message: string;
  code: ErrorCode;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
  timestamp: string;
}
