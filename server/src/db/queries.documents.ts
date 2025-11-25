import type { Document } from '../types/entities';
import { getDb } from './index';

export interface NewDocumentInput {
  user_id: number;
  title: string;
  original_filename: string;
  source_path: string;
  content_text: string;
  uploaded_at: string;
  updated_at: string;
}

export async function createDocument(input: NewDocumentInput): Promise<Document> {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO documents (user_id, title, original_filename, source_path, content_text, uploaded_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id,
    input.title,
    input.original_filename,
    input.source_path,
    input.content_text,
    input.uploaded_at,
    input.updated_at
  );
  return db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid);
}

export async function getDocumentById(id: number): Promise<Document | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM documents WHERE id = ?').get(id) ?? null;
}

export async function listDocuments(params: { search?: string } = {}): Promise<Document[]> {
  const db = getDb();
  if (params.search) {
    return db.prepare(`SELECT * FROM documents WHERE title LIKE ? OR content_text LIKE ? ORDER BY uploaded_at DESC`)
      .all(`%${params.search}%`, `%${params.search}%`);
  }
  return db.prepare('SELECT * FROM documents ORDER BY uploaded_at DESC').all();
}
