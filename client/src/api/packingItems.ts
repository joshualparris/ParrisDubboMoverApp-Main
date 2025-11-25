import { apiRequest } from './client';
import type { PackingItem } from '../types/api';

export interface ListPackingItemsParams {
  boxId?: number;
  limit?: number;
}

export async function fetchPackingItems(
  params: ListPackingItemsParams = {}
): Promise<PackingItem[]> {
  const query = new URLSearchParams();
  if (params.boxId) query.append('boxId', String(params.boxId));
  if (params.limit) query.append('limit', String(params.limit));
  const url = '/api/packing-items' + (query.toString() ? `?${query}` : '');
  return apiRequest<PackingItem[]>(url);
}

export async function createPackingItem(payload: {
  box_id: number;
  name: string;
  quantity?: number;
  notes?: string | null;
}): Promise<PackingItem> {
  return apiRequest<PackingItem>('/api/packing-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updatePackingItem(
  id: number,
  payload: Partial<{ box_id: number; name: string; quantity: number; notes: string | null }>
): Promise<PackingItem> {
  return apiRequest<PackingItem>(`/api/packing-items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deletePackingItem(id: number): Promise<void> {
  return apiRequest<void>(`/api/packing-items/${id}`, { method: 'DELETE' });
}
