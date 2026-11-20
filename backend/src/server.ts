import { createApp } from '@/app';
import { config } from '@/config/env.config';
import { db } from '@/db/postgres';

const SHUTDOWN_TIMEOUT_MS = 10_000;

const app = createApp();

const server = app.listen(config.port, (): void => {
  console.info(`⚡ [Server]: http://localhost:${config.port}${config.apiPrefix} (${config.nodeEnv})`);
  db.ping()
    .then((isUp: boolean): void => {
      if (isUp) {
        console.info(`🐘 [PostgreSQL]: Connected to "${config.db.database}" on ${config.db.host}:${config.db.port}`);
      } else {
        console.warn('⚠️ [PostgreSQL]: Unreachable — check backend/.env, then run `pnpm db:setup`.');
      }
    })
    .catch((): void => undefined);
});

const shutdown = (signal: NodeJS.Signals): void => {
  console.info(`\n🛑 Received ${signal}, shutting down gracefully...`);
  const forceExit = setTimeout((): void => {
    console.error('⚠️ Forcing shutdown after timeout.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  server.close((): void => {
    db.close()
      .catch((): void => undefined)
      .finally((): void => {
        process.exit(0);
      });
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
