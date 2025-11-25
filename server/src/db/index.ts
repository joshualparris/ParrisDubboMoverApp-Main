import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: InstanceType<typeof Database> | null = null;

export function getDb(): InstanceType<typeof Database> {
  if (!db) {
    const dataDir = path.resolve(__dirname, '../../data');
    fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = path.join(dataDir, 'pdm.db');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initDb() {
  // For compatibility, just call runMigrations
  const { runMigrations } = require('./migrate');
  runMigrations();
}
