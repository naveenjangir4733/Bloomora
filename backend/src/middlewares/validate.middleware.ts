import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType, ZodTypeDef } from 'zod';

type ParamsDictionary = Record<string, string>;
type Schema<T> = ZodType<T, ZodTypeDef, unknown>;

interface ValidationSchemas<TParams, TBody, TQuery> {
  params?: Schema<TParams>;
  body?: Schema<TBody>;
  query?: Schema<TQuery>;
}

/**
 * Parses params/body/query with Zod and replaces them with the typed, transformed output.
 * The returned handler carries those types so the next controller in the chain receives them.
 * A ZodError is forwarded to the global error middleware (→ 400 VALIDATION_ERROR).
 */
export const validateRequest = <TParams = ParamsDictionary, TBody = unknown, TQuery = unknown>(
  schemas: ValidationSchemas<TParams, TBody, TQuery>,
): RequestHandler<TParams, unknown, TBody, TQuery> => {
  return (req: Request<TParams, unknown, TBody, TQuery>, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
