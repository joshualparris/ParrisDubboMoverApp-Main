import Database from 'better-sqlite3';
import { getSqlitePath, isPostgres } from './index';
import { createTables, seedBaseData } from './schema';

export function runMigrations() {
  if (isPostgres) {
    console.warn('Postgres selected via DATABASE_URL — automatic SQLite migrations are skipped. Run Postgres migrations manually or use a migration tool.');
    return;
  }

  const sqlitePath = getSqlitePath();
  const db = new Database(sqlitePath);
  // Use exec to run schema and seeds in a transaction-like block
  db.transaction(() => {
    createTables(db as any);
    seedBaseData(db as any);
  })();

  console.log('SQLite migrations and seed complete');
}
