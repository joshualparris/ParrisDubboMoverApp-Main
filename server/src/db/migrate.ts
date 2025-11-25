import { getDb } from './index';
import { createTables, seedBaseData } from './schema';

export function runMigrations() {
  const db = getDb();
  db.transaction(() => {
    createTables(db);
    seedBaseData(db);
      // --- CT7: Properties ---
      db.prepare(`CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        address TEXT NOT NULL,
        type TEXT,
        rent_weekly REAL,
        status TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`).run();

      // --- CT7: Job Options ---
      db.prepare(`CREATE TABLE IF NOT EXISTS job_options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        employer TEXT NOT NULL,
        role TEXT,
        hours_per_week REAL,
        pay_rate_hourly REAL,
        status TEXT,
        pros TEXT,
        cons TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`).run();

      // --- CT7: Childcare Options ---
      db.prepare(`CREATE TABLE IF NOT EXISTS childcare_options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        type TEXT,
        location TEXT,
        min_age_months INTEGER,
        max_age_months INTEGER,
        daily_fee REAL,
        status TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`).run();
  })();
  // Optionally log success
  console.log('Database migrations and seed complete');
}
