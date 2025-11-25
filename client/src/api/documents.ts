import { apiRequest } from './client';
import type { Document, ListDocumentsParams } from '../types/documents';

export async function listDocuments(params: ListDocumentsParams = {}): Promise<Document[]> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  const query = searchParams.toString();
  const path = query ? `/api/documents?${query}` : '/api/documents';
  return apiRequest<Document[]>(path);
}

export async function getDocument(id: number): Promise<Document> {
  return apiRequest<Document>(`/api/documents/${id}`);
}

export async function uploadDocument(file: File, title?: string): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  const res = await fetch('/api/documents/upload', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
