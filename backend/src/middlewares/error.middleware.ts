import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { HttpStatus } from '@/constants/http-status.constant';
import type { ApiErrorResponse } from '@/types/common.types';
import { ApiResponse } from '@/utils/api-response.util';
import { AppError } from '@/utils/app-error.util';

interface FieldError {
  field: string;
  message: string;
}

const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';
const PG_INVALID_TEXT = '22P02';
const DB_UNAVAILABLE_CODES = new Set(['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', '28P01', '3D000', '57P03']);

const hasStringCode = (error: Error): error is Error & { code: string } =>
  'code' in error && typeof error.code === 'string';

const formatZodError = (error: ZodError): FieldError[] =>
  error.errors.map((issue): FieldError => ({ field: issue.path.join('.'), message: issue.message }));

const isJsonSyntaxError = (error: Error): boolean => error instanceof SyntaxError && 'body' in error;

/** Maps any thrown value onto a typed operational error. Unknown errors become a generic 500. */
const toAppError = (error: Error): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof ZodError) {
    return AppError.validation(formatZodError(error));
  }
  if (isJsonSyntaxError(error)) {
    return new AppError('Malformed JSON in request body', HttpStatus.BAD_REQUEST, 'INVALID_JSON');
  }
  if (hasStringCode(error)) {
    if (error.code === PG_UNIQUE_VIOLATION) {
      return AppError.conflict('A record with the same unique value already exists');
    }
    if (error.code === PG_FOREIGN_KEY_VIOLATION) {
      return AppError.unprocessable('A referenced record does not exist');
    }
    if (error.code === PG_INVALID_TEXT) {
      return AppError.badRequest('Invalid identifier format');
    }
    if (DB_UNAVAILABLE_CODES.has(error.code)) {
      return AppError.unavailable('The database is currently unavailable. Please try again shortly.');
    }
  }
  return new AppError('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
};

export const errorMiddleware: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction,
): void => {
  const appError = toAppError(error);

  if (appError.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
    // Full details stay in the server log — clients only receive the safe message.
    console.error(`💥 [${req.method} ${req.originalUrl}]`, error);
  }

  res.status(appError.statusCode).json(
    ApiResponse.error({
      message: appError.message,
      code: appError.code,
      ...(appError.details === undefined ? {} : { details: appError.details }),
    }),
  );
};

export const notFoundMiddleware: RequestHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(AppError.notFound(`Route '${req.method} ${req.originalUrl}' not found`));
};
