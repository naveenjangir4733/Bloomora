import type { AsyncData, NuxtError } from '#app';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiErrorBody {
  message: string;
  code: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
  timestamp: string;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

/** Result of a write request: the payload plus the server's human-readable message. */
export interface MutationResult<T> {
  data: T;
  message: string | null;
}

export type QueryValue = string | number | boolean | undefined;
export type QueryParams = Record<string, QueryValue>;

/** Field path (e.g. `customer.phone`) → validation message returned by the API. */
export type FieldErrors = Record<string, string>;

export type ApiAsyncData<T> = AsyncData<T, NuxtError<unknown> | null>;
