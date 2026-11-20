import { HttpStatus, type HttpStatusCode } from '@/constants/http-status.constant';

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode = 'INTERNAL_ERROR',
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string, details?: unknown): AppError {
    return new AppError(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', details);
  }

  public static notFound(message: string): AppError {
    return new AppError(message, HttpStatus.NOT_FOUND, 'NOT_FOUND');
  }

  public static conflict(message: string): AppError {
    return new AppError(message, HttpStatus.CONFLICT, 'CONFLICT');
  }

  public static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }

  public static forbidden(message = 'Forbidden'): AppError {
    return new AppError(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}
