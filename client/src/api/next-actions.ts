import { apiRequest } from './client';
import type { Task } from '../types/api';

export interface NextAction extends Task {
  domain_slug?: string;
  why?: string;
}

export async function fetchNextActions(limit: number = 3, includeWhy: boolean = false): Promise<NextAction[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', String(limit));
  if (includeWhy) params.append('includeWhy', 'true');
  const qs = params.toString();
  const path = qs ? `/api/next-actions?${qs}` : '/api/next-actions';
  return apiRequest<NextAction[]>(path);
}
