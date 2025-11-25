import { apiRequest } from './client';
import type { ChildcareOption } from '../types/api';

export async function fetchChildcareOptions(): Promise<ChildcareOption[]> {
  return apiRequest('/api/childcare-options');
}

export async function fetchChildcareOption(id: number): Promise<ChildcareOption> {
  return apiRequest(`/api/childcare-options/${id}`);
}

export async function createChildcareOption(payload: Partial<ChildcareOption>): Promise<ChildcareOption> {
  return apiRequest('/api/childcare-options', { method: 'POST', body: payload });
}

export async function updateChildcareOption(id: number, payload: Partial<ChildcareOption>): Promise<ChildcareOption> {
  return apiRequest(`/api/childcare-options/${id}`, { method: 'PATCH', body: payload });
}

export async function deleteChildcareOption(id: number): Promise<void> {
  await apiRequest(`/api/childcare-options/${id}`, { method: 'DELETE' });
}
