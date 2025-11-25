import { apiRequest } from './client';
import type { PackingBox, PackingBoxStatus } from '../types/api';

export interface ListPackingBoxesParams {
  areaId?: number;
  status?: PackingBoxStatus;
  limit?: number;
}

export async function fetchPackingBoxes(
  params: ListPackingBoxesParams = {}
): Promise<PackingBox[]> {
  const query = new URLSearchParams();
  if (params.areaId) query.append('areaId', String(params.areaId));
  if (params.status) query.append('status', params.status);
  if (params.limit) query.append('limit', String(params.limit));
  const url = '/api/packing-boxes' + (query.toString() ? `?${query}` : '');
  return apiRequest<PackingBox[]>(url);
}

export async function createPackingBox(payload: {
  area_id: number;
  label: string;
  status?: PackingBoxStatus;
  fragile?: boolean;
  priority?: boolean;
  notes?: string | null;
}): Promise<PackingBox> {
  return apiRequest<PackingBox>('/api/packing-boxes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updatePackingBox(
  id: number,
  payload: Partial<{
    area_id: number;
    label: string;
    status: PackingBoxStatus;
    fragile: boolean;
    priority: boolean;
    notes: string | null;
  }>
): Promise<PackingBox> {
  return apiRequest<PackingBox>(`/api/packing-boxes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deletePackingBox(id: number): Promise<void> {
  return apiRequest<void>(`/api/packing-boxes/${id}`, { method: 'DELETE' });
}
