import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import { config } from '@/config/env.config';
import { createControllers } from '@/container';
import { errorMiddleware, notFoundMiddleware } from '@/middlewares/error.middleware';
import { loggerMiddleware } from '@/middlewares/logger.middleware';
import { createApiRouter } from '@/routes/api.router';

const JSON_BODY_LIMIT = '100kb';

export const createApp = (): Application => {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );
  app.use(express.json({ limit: JSON_BODY_LIMIT }));
  app.use(loggerMiddleware);

  app.use(config.apiPrefix, createApiRouter(createControllers()));

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
