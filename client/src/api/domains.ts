import { apiRequest } from './client';
import type { Domain } from '../types/api';

export async function fetchDomains(): Promise<Domain[]> {
  return apiRequest<Domain[]>('/api/domains');
}
