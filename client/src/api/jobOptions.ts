import { apiRequest } from './client';
import type { JobOption } from '../types/api';

export async function fetchJobOptions(): Promise<JobOption[]> {
  return apiRequest('/api/job-options');
}

export async function fetchJobOption(id: number): Promise<JobOption> {
  return apiRequest(`/api/job-options/${id}`);
}

export async function createJobOption(payload: Partial<JobOption>): Promise<JobOption> {
  return apiRequest('/api/job-options', { method: 'POST', body: payload });
}

export async function updateJobOption(id: number, payload: Partial<JobOption>): Promise<JobOption> {
  return apiRequest(`/api/job-options/${id}`, { method: 'PATCH', body: payload });
}

export async function deleteJobOption(id: number): Promise<void> {
  await apiRequest(`/api/job-options/${id}`, { method: 'DELETE' });
}
