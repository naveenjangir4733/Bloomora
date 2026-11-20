import { Router } from 'express';
import { healthRouter } from '@/routes/health.router';
import { userRouter } from '@/routes/user.router';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/users', userRouter);
