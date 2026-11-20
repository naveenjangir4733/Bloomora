import { HttpStatus, type HttpStatusCode } from '@/constants/http-status.constant';
import type { ErrorCode } from '@/types/common.types';

/** Operational error that the global error middleware converts into a typed API response. */
export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(message: string, statusCode: HttpStatusCode, code: ErrorCode, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public static badRequest(message: string, details?: unknown): AppError {
    return new AppError(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', details);
  }

  public static validation(details: unknown): AppError {
    return new AppError('Validation failed', HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }

  public static notFound(message: string): AppError {
    return new AppError(message, HttpStatus.NOT_FOUND, 'NOT_FOUND');
  }

  public static conflict(message: string): AppError {
    return new AppError(message, HttpStatus.CONFLICT, 'CONFLICT');
  }

  public static unprocessable(message: string, details?: unknown): AppError {
    return new AppError(message, HttpStatus.UNPROCESSABLE_ENTITY, 'UNPROCESSABLE_ENTITY', details);
  }

  public static unavailable(message: string): AppError {
    return new AppError(message, HttpStatus.SERVICE_UNAVAILABLE, 'SERVICE_UNAVAILABLE');
  }
}
