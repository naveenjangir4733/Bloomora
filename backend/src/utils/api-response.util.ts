import { HttpStatus, type HttpStatusCode } from '@/constants/http-status.constant';
import type { ApiResponse, PaginatedResponse, PaginationMeta } from '@/types/common.types';

export class ApiResponseUtil {
  public static success<T>(
    data: T,
    message = 'Success',
    statusCode: HttpStatusCode = HttpStatus.OK,
  ): ApiResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  public static paginated<T>(
    data: T[],
    meta: PaginationMeta,
    message = 'Data retrieved successfully',
  ): PaginatedResponse<T> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }
}
