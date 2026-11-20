import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpStatus, type HttpStatusCode } from '@/constants/http-status.constant';
import { AppError } from '@/utils/app-error.util';
import type { ApiErrorResponse } from '@/types/common.types';
import { config } from '@/config/env.config';

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction,
): void => {
  let statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    details = err.details;
  } else if (err.name === 'SyntaxError') {
    statusCode = HttpStatus.BAD_REQUEST;
    errorCode = 'INVALID_JSON';
    message = 'Malformed JSON in request body';
  } else {
    // Log unexpected exceptions
    console.error('💥 Unhandled Exception:', err);
  }

  const response: ApiErrorResponse = {
    success: false,
    statusCode,
    errorCode,
    message,
    details: config.isDevelopment ? (details ?? err.stack) : details,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};
