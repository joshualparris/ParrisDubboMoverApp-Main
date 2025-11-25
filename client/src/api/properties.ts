import { apiRequest } from './client';
import type { Property } from '../types/api';

export async function fetchProperties(): Promise<Property[]> {
  return apiRequest('/api/properties');
}

export async function fetchProperty(id: number): Promise<Property> {
  return apiRequest(`/api/properties/${id}`);
}

export async function createProperty(payload: {
  address: string;
  type: string;
  rent_weekly?: number | null;
  status?: string | null;
  notes?: string | null;
}): Promise<Property> {
  return apiRequest('/api/properties', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateProperty(id: number, payload: Partial<Property>): Promise<Property> {
  return apiRequest(`/api/properties/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function deleteProperty(id: number): Promise<void> {
  await apiRequest(`/api/properties/${id}`, { method: 'DELETE' });
}
