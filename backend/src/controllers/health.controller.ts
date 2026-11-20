import type { Request, Response } from 'express';
import { ApiResponseUtil } from '@/utils/api-response.util';
import { config } from '@/config/env.config';

export class HealthController {
  public static getHealth(_req: Request, res: Response): void {
    const healthData = {
      status: 'UP',
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };

    res.json(ApiResponseUtil.success(healthData, 'Service is healthy and operational'));
  }
}
