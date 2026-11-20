import { config } from '@/config/env.config';
import { HttpStatus } from '@/constants/http-status.constant';
import type { Database } from '@/db/postgres';
import { ApiResponse } from '@/utils/api-response.util';
import { asyncHandler } from '@/utils/async-handler.util';

export interface HealthStatus {
  status: 'UP' | 'DEGRADED';
  database: 'connected' | 'unreachable';
  uptimeSeconds: number;
  environment: string;
}

export class HealthController {
  constructor(private readonly database: Database) {}

  public readonly check = asyncHandler(async (_req, res): Promise<void> => {
    const isDatabaseUp = await this.database.ping();
    const health: HealthStatus = {
      status: isDatabaseUp ? 'UP' : 'DEGRADED',
      database: isDatabaseUp ? 'connected' : 'unreachable',
      uptimeSeconds: Math.round(process.uptime()),
      environment: config.nodeEnv,
    };
    res
      .status(isDatabaseUp ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
      .json(ApiResponse.success(health, isDatabaseUp ? 'Service is healthy' : 'Database is unreachable'));
  });
}
