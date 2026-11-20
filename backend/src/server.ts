import { createApp } from '@/app';
import { config } from '@/config/env.config';

const app = createApp();

const server = app.listen(config.port, () => {
  console.info(`⚡ [Server]: Server is running at http://localhost:${config.port}${config.apiPrefix}`);
  console.info(`🌱 [Environment]: ${config.nodeEnv}`);
});

const gracefulShutdown = (signal: string): void => {
  console.info(`\n🛑 Received ${signal}. Gracefully shutting down...`);
  server.close(() => {
    console.info('🔌 HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️ Forcefully terminating process after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
