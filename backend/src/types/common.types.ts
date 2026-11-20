import type { HttpStatusCode } from '@/constants/http-status.constant';

export interface ApiResponse<T> {
  success: true;
  statusCode: HttpStatusCode;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: HttpStatusCode;
  message: string;
  errorCode: string;
  details?: unknown;
  timestamp: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
