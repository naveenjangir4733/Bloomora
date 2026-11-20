import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const portSchema = z.coerce.number().int().min(1).max(65535);
const booleanStringSchema = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value): boolean => value === 'true');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: portSchema.default(5000),
  API_PREFIX: z.string().startsWith('/').default('/api/v1'),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:3000'),

  // PostgreSQL — DATABASE_URL takes precedence over the individual DB_* values.
  DATABASE_URL: z.string().url().optional(),
  DB_HOST: z.string().min(1).default('localhost'),
  DB_PORT: portSchema.default(5432),
  DB_USER: z.string().min(1).default('postgres'),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().min(1).default('bloomora_db'),
  DB_SSL: booleanStringSchema,
  DB_POOL_MAX: z.coerce.number().int().positive().default(10),
});

type RawEnv = z.infer<typeof envSchema>;

export type NodeEnv = RawEnv['NODE_ENV'];

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
  poolMax: number;
}

export interface AppConfig {
  nodeEnv: NodeEnv;
  port: number;
  apiPrefix: string;
  corsOrigins: string[];
  isProduction: boolean;
  isDevelopment: boolean;
  db: DatabaseConfig;
}

const parseEnv = (): RawEnv => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
};

const resolveDatabaseConfig = (env: RawEnv): DatabaseConfig => {
  const base = { ssl: env.DB_SSL, poolMax: env.DB_POOL_MAX };

  if (env.DATABASE_URL) {
    const url = new URL(env.DATABASE_URL);
    return {
      ...base,
      host: url.hostname,
      port: url.port ? Number(url.port) : env.DB_PORT,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, '') || env.DB_NAME,
    };
  }

  if (!env.DB_PASSWORD) {
    console.error('❌ Set either DATABASE_URL or DB_PASSWORD in backend/.env');
    process.exit(1);
  }

  return {
    ...base,
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  };
};

const env = parseEnv();

export const config: AppConfig = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  corsOrigins: env.CORS_ORIGIN.split(',').map((origin: string): string => origin.trim()),
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  db: resolveDatabaseConfig(env),
};
