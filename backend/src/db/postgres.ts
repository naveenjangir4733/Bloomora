import { Pool, type PoolClient, type PoolConfig, type QueryResult, type QueryResultRow } from 'pg';
import { config, type DatabaseConfig } from '@/config/env.config';

/** Values that may be bound to a parameterised SQL statement. */
export type QueryParam = string | number | boolean | Date | null | readonly string[] | readonly number[];

/** Anything that can run a parameterised query: the shared pool or a transaction client. */
export interface SqlExecutor {
  query<R extends QueryResultRow>(text: string, params?: readonly QueryParam[]): Promise<QueryResult<R>>;
}

export const buildPoolConfig = (dbConfig: DatabaseConfig, database: string = dbConfig.database): PoolConfig => ({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database,
  ssl: dbConfig.ssl ? { rejectUnauthorized: true } : false,
  max: dbConfig.poolMax,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

const createExecutor = (client: Pick<PoolClient, 'query'>): SqlExecutor => ({
  query: <R extends QueryResultRow>(text: string, params: readonly QueryParam[] = []): Promise<QueryResult<R>> =>
    client.query<R>(text, [...params]),
});

class Database implements SqlExecutor {
  private pool: Pool | null = null;

  constructor(private readonly dbConfig: DatabaseConfig) {}

  private getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool(buildPoolConfig(this.dbConfig));
      this.pool.on('error', (error: Error): void => {
        console.error('⚠️ [PostgreSQL]: Unexpected error on idle client:', error.message);
      });
    }
    return this.pool;
  }

  public query<R extends QueryResultRow>(text: string, params: readonly QueryParam[] = []): Promise<QueryResult<R>> {
    return this.getPool().query<R>(text, [...params]);
  }

  /** Runs `work` inside a single transaction; rolls back automatically on any thrown error. */
  public async transaction<T>(work: (tx: SqlExecutor) => Promise<T>): Promise<T> {
    const client = await this.getPool().connect();
    try {
      await client.query('BEGIN');
      const result = await work(createExecutor(client));
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async ping(): Promise<boolean> {
    try {
      await this.getPool().query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

export const db = new Database(config.db);
export type { Database };
