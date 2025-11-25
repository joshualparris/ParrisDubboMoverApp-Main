import { apiRequest } from './client';
import type { WorkLink } from '../types/api';

export async function fetchWorkLinks(userId: number = 1): Promise<WorkLink[]> {
  return apiRequest<WorkLink[]>(`/api/work-links?user_id=${userId}`);
}

export async function createWorkLink(payload: Partial<WorkLink>): Promise<WorkLink> {
  return apiRequest<WorkLink>('/api/work-links', {
    method: 'POST',
    body: JSON.stringify({ ...payload, user_id: 1 }),
  });
}

export async function updateWorkLink(id: number, payload: Partial<WorkLink>): Promise<WorkLink> {
  return apiRequest<WorkLink>(`/api/work-links/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteWorkLink(id: number): Promise<void> {
  return apiRequest<void>(`/api/work-links/${id}`, {
    method: 'DELETE',
  });
}
