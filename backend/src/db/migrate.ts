import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';
import { config } from '@/config/env.config';
import { buildPoolConfig, db } from '@/db/postgres';
import { runAsScript } from '@/db/script-runner';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const MAINTENANCE_DATABASE = 'postgres';

/** Creates the target database on the local server if it does not exist yet. */
const ensureDatabaseExists = async (): Promise<void> => {
  const adminClient = new Client(buildPoolConfig(config.db, MAINTENANCE_DATABASE));
  await adminClient.connect();
  try {
    const result = await adminClient.query<{ exists: boolean }>(
      'SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = $1) AS "exists"',
      [config.db.database],
    );
    if (result.rows[0]?.exists !== true) {
      await adminClient.query(`CREATE DATABASE ${adminClient.escapeIdentifier(config.db.database)}`);
      console.info(`🆕 [Migrate]: Created database "${config.db.database}".`);
    }
  } finally {
    await adminClient.end();
  }
};

const getAppliedMigrations = async (): Promise<Set<string>> => {
  await db.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       name       VARCHAR(255) PRIMARY KEY,
       applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
     )`,
  );
  const result = await db.query<{ name: string }>('SELECT name FROM schema_migrations');
  return new Set(result.rows.map((row): string => row.name));
};

const applyMigration = async (file: string): Promise<void> => {
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
  await db.transaction(async (tx): Promise<void> => {
    await tx.query(sql);
    await tx.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
  });
  console.info(`✅ [Migrate]: Applied ${file}`);
};

export const runMigrations = async (): Promise<void> => {
  await ensureDatabaseExists();
  const applied = await getAppliedMigrations();
  const pending = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file: string): boolean => file.endsWith('.sql') && !applied.has(file))
    .sort((a: string, b: string): number => a.localeCompare(b));

  // Migrations must run strictly in order, so chain them instead of running in parallel.
  await pending.reduce(
    (previous: Promise<void>, file: string): Promise<void> => previous.then((): Promise<void> => applyMigration(file)),
    Promise.resolve(),
  );

  console.info(pending.length > 0 ? '🎉 [Migrate]: Database is up to date.' : '👌 [Migrate]: Nothing to migrate.');
};

/** Drops every object in the public schema. Development only. */
export const resetDatabase = async (): Promise<void> => {
  if (config.isProduction) {
    throw new Error('Refusing to reset the database in production.');
  }
  await ensureDatabaseExists();
  await db.query('DROP SCHEMA public CASCADE');
  await db.query('CREATE SCHEMA public');
  console.info('🧹 [Migrate]: Dropped and recreated the public schema.');
};

if (require.main === module) {
  const shouldReset = process.argv.includes('--reset');
  runAsScript(async (): Promise<void> => {
    if (shouldReset) {
      await resetDatabase();
    }
    await runMigrations();
  });
}
