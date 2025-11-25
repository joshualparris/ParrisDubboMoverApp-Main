import type { Document } from '../types/entities';
import { execAll, execGet, insertAndReturn } from './index';

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
  const sql = `
    INSERT INTO documents (user_id, title, original_filename, source_path, content_text, uploaded_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [input.user_id, input.title, input.original_filename, input.source_path, input.content_text, input.uploaded_at, input.updated_at];
  return insertAndReturn('documents', sql, params);
}

export async function getDocumentById(id: number): Promise<Document | null> {
  return execGet<Document>('SELECT * FROM documents WHERE id = ?', [id]);
}

export async function listDocuments(params: { search?: string } = {}): Promise<Document[]> {
  if (params.search) {
    const q = `SELECT * FROM documents WHERE title LIKE ? OR content_text LIKE ? ORDER BY uploaded_at DESC`;
    return execAll<Document>(q, [`%${params.search}%`, `%${params.search}%`]);
  }
  return execAll<Document>('SELECT * FROM documents ORDER BY uploaded_at DESC');
}
