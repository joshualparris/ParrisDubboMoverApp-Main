import { apiRequest } from './client';
import type { PackingArea } from '../types/api';

export interface ListPackingAreasParams {
  location?: string;
  limit?: number;
}

export async function fetchPackingAreas(
  params: ListPackingAreasParams = {}
): Promise<PackingArea[]> {
  const query = new URLSearchParams();
  if (params.location) query.append('location', params.location);
  if (params.limit) query.append('limit', String(params.limit));
  const url = '/api/packing-areas' + (query.toString() ? `?${query}` : '');
  return apiRequest<PackingArea[]>(url);
}

export async function createPackingArea(payload: {
  name: string;
  location?: string | null;
  notes?: string | null;
}): Promise<PackingArea> {
  return apiRequest<PackingArea>('/api/packing-areas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updatePackingArea(
  id: number,
  payload: Partial<{ name: string; location: string | null; notes: string | null }>
): Promise<PackingArea> {
  return apiRequest<PackingArea>(`/api/packing-areas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deletePackingArea(id: number): Promise<void> {
  return apiRequest<void>(`/api/packing-areas/${id}`, { method: 'DELETE' });
}
