/**
 * PostgreSQL connection pool — única fuente de verdad para acceso a Neon.
 * Solo usar desde Server Components, API Routes y Server Actions.
 * Nunca importar desde Client Components.
 */
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 3_000,
  });
}

// Singleton: reusar pool en desarrollo (hot reload)
export const db: Pool =
  process.env.NODE_ENV === 'production'
    ? createPool()
    : (globalThis._pgPool ??= createPool());

/** Ejecuta un query con parámetros tipados. */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await db.query(sql, params);
  return result.rows as T[];
}

/** Ejecuta un query y retorna la primera fila o null. */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
