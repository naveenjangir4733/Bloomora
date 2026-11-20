import type { ApiErrorResponse, FieldErrors } from '@/types/api.types';
import { isRecord } from '@/utils/guards';

const NETWORK_ERROR_MESSAGE = 'We could not reach the store. Please check your connection and try again.';

/** Normalised error thrown by the API client for every failed request. */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly fieldErrors: FieldErrors = {},
    public readonly statusCode: number | null = null,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse =>
  isRecord(value) &&
  value['success'] === false &&
  isRecord(value['error']) &&
  typeof value['error']['message'] === 'string' &&
  typeof value['error']['code'] === 'string';

const isFieldError = (value: unknown): value is { field: string; message: string } =>
  isRecord(value) && typeof value['field'] === 'string' && typeof value['message'] === 'string';

const toFieldErrors = (details: unknown): FieldErrors => {
  if (!Array.isArray(details)) {
    return {};
  }
  return details.filter(isFieldError).reduce<FieldErrors>((errors, { field, message }): FieldErrors => {
    errors[field] ??= message;
    return errors;
  }, {});
};

/** Converts whatever `$fetch` threw into an `ApiRequestError`. */
export const toApiRequestError = (error: unknown): ApiRequestError => {
  if (error instanceof ApiRequestError) {
    return error;
  }
  if (isRecord(error) && isApiErrorResponse(error['data'])) {
    const body = error['data'].error;
    const status = typeof error['statusCode'] === 'number' ? error['statusCode'] : null;
    return new ApiRequestError(body.message, body.code, toFieldErrors(body.details), status);
  }
  return new ApiRequestError(NETWORK_ERROR_MESSAGE, 'NETWORK_ERROR');
};
