import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Pool, QueryResultRow } from 'pg';

let sqliteDb: InstanceType<typeof Database> | null = null;
let pgPool: Pool | null = null;

const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH || path.resolve(__dirname, '../../data/pdm.db');

export const isPostgres = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0);

export function getDb(): any {
  if (!sqliteDb) {
    const dataDir = path.resolve(__dirname, '../../data');
    fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = SQLITE_DB_PATH;
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('foreign_keys = ON');
    sqliteDb.pragma('journal_mode = WAL');
  }

  // Return a compatibility wrapper that provides prepare(sql).all/get/run
  // For SQLite we forward to better-sqlite3 methods.
  // For Postgres we emulate the same API using pgQuery.
  const wrapper = {
    prepare: (sql: string) => {
      if (!isPostgres) {
        const stmt = sqliteDb!.prepare(sql);
        return {
          all: (...p: any[]) => stmt.all(...p),
          get: (...p: any[]) => stmt.get(...p),
          run: (...p: any[]) => stmt.run(...p),
        };
      }

      // Postgres path: return an object with all/get/run that use pgQuery
      return {
        all: async (...p: any[]) => {
          const pgSql = sql.replace(/\?/g, (() => { let i = 0; return () => `$${++i}`; })() as any);
          return await pgQuery(pgSql, p as any[]);
        },
        get: async (...p: any[]) => {
          const pgSql = sql.replace(/\?/g, (() => { let i = 0; return () => `$${++i}`; })() as any);
          const rows = await pgQuery(pgSql, p as any[]);
          return rows && rows.length > 0 ? rows[0] : null;
        },
        run: async (...p: any[]) => {
          // For INSERT, append RETURNING id so callers can read lastInsertRowid
          const isInsert = /^\s*INSERT\s+/i.test(sql);
          if (isInsert) {
            const sqlWithReturning = /returning\s+/i.test(sql) ? sql : `${sql} RETURNING id`;
            const pgSql = sqlWithReturning.replace(/\?/g, (() => { let i = 0; return () => `$${++i}`; })() as any);
            const rows = await pgQuery(pgSql, p as any[]);
            return { lastInsertRowid: rows && rows[0] && (rows[0].id ?? rows[0].ID ?? rows[0].Id) };
          }
          // Non-insert: execute and return a minimal result
          const pgSql = sql.replace(/\?/g, (() => { let i = 0; return () => `$${++i}`; })() as any);
          await pgQuery(pgSql, p as any[]);
          return { changes: 1 };
        },
      };
    },
  };

  return wrapper;
}

export function getSqlitePath(): string {
  return SQLITE_DB_PATH;
}

export function getPgPool(): Pool {
  if (!pgPool) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
    pgPool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined });
  }
  return pgPool;
}

export async function pgQuery<T extends QueryResultRow = any>(text: string, params: any[] = []): Promise<T[]> {
  const pool = getPgPool();
  const res = await pool.query<T>(text, params);
  return (res.rows as unknown) as T[];
}

function toPg(text: string) {
  let i = 0;
  return text.replace(/\?/g, () => `$${++i}`);
}

export function sqliteAll<T = any>(sql: string, params: any[] = []): T[] {
  return getDb().prepare(sql).all(...params) as T[];
}
export function sqliteGet<T = any>(sql: string, params: any[] = []): T | null {
  return getDb().prepare(sql).get(...params) ?? null;
}
export function sqliteRun(sql: string, params: any[] = []) {
  return getDb().prepare(sql).run(...params);
}

export async function execAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!isPostgres) return sqliteAll<T>(sql, params);
  const pgSql = toPg(sql);
  return (await pgQuery<T[]>(pgSql, params)) as T[];
}

export async function execGet<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  if (!isPostgres) return sqliteGet<T>(sql, params);
  const pgSql = toPg(sql);
  const rows = (await pgQuery<T[]>(pgSql, params)) as T[];
  return rows && rows.length > 0 ? rows[0] : null;
}

export async function insertAndReturn(table: string, insertSql: string, params: any[] = [], idSelectSql?: string): Promise<any> {
  if (!isPostgres) {
    const res = sqliteRun(insertSql, params);
    const id = (res as any).lastInsertRowid as number;
    const select = idSelectSql ?? `SELECT * FROM ${table} WHERE id = ?`;
    return sqliteGet(select, [id]);
  }

  // Postgres path: ensure RETURNING *
  const hasReturning = /returning\s+\*/i.test(insertSql);
  const sql = hasReturning ? insertSql : `${insertSql} RETURNING *`;
  const pgSql = toPg(sql);
  const rows = await pgQuery<any[]>(pgSql, params);
  return rows[0];
}

export function initDb() {
  // For compatibility, just call runMigrations
  const { runMigrations } = require('./migrate');
  runMigrations();
}
