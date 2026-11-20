import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '@/config/env.config';
import { loggerMiddleware } from '@/middlewares/logger.middleware';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { apiRouter } from '@/routes/api.router';
import { AppError } from '@/utils/app-error.util';

export const createApp = (): Application => {
  const app: Application = express();

  // Security and utility middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggerMiddleware);

  // Mount API Router
  app.use(config.apiPrefix, apiRouter);

  // Unhandled routes
  app.use((req: Request, _res: Response, next: NextFunction): void => {
    next(AppError.notFound(`Route '${req.originalUrl}' not found`));
  });

  // Global centralized error handling
  app.use(errorMiddleware);

  return app;
};
