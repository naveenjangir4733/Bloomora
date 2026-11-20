import morgan from 'morgan';
import type { RequestHandler } from 'express';
import { config } from '@/config/env.config';

export const loggerMiddleware: RequestHandler = morgan(
  config.isProduction
    ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'
    : ':method :url :status :response-time ms - :res[content-length]',
);
