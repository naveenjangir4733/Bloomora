import { db } from '@/db/postgres';

/** Runs a CLI database task, always closing the pool and setting the exit code. */
export const runAsScript = (task: () => Promise<void>): void => {
  task()
    .then((): void => {
      process.exitCode = 0;
    })
    .catch((error: unknown): void => {
      console.error('❌ [DB Script]:', error instanceof Error ? error.message : error);
      process.exitCode = 1;
    })
    .finally((): void => {
      void db.close();
    });
};
