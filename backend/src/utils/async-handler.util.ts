import type { NextFunction, Request, RequestHandler, Response } from 'express';

type ParamsDictionary = Record<string, string>;

type AsyncRouteHandler<TParams, TBody, TQuery> = (
  req: Request<TParams, unknown, TBody, TQuery>,
  res: Response,
) => Promise<void>;

/** Forwards rejected promises from async controllers to the global error middleware. */
export const asyncHandler = <TParams = ParamsDictionary, TBody = unknown, TQuery = unknown>(
  handler: AsyncRouteHandler<TParams, TBody, TQuery>,
): RequestHandler<TParams, unknown, TBody, TQuery> => {
  return (req: Request<TParams, unknown, TBody, TQuery>, res: Response, next: NextFunction): void => {
    handler(req, res).catch(next);
  };
};
