import { apiRequest } from './client';
import type { ComplianceItem } from '../types/api';

export interface ListComplianceItemsParams {
  subjectType?: string;
  subjectName?: string;
  category?: string;
  status?: string;
  activeOnly?: boolean;
  limit?: number;
}

export async function fetchComplianceItems(
  params: ListComplianceItemsParams = {}
): Promise<ComplianceItem[]> {
  const query = new URLSearchParams();
  if (params.subjectType) query.append('subjectType', params.subjectType);
  if (params.subjectName) query.append('subjectName', params.subjectName);
  if (params.category) query.append('category', params.category);
  if (params.status) query.append('status', params.status);
  if (params.activeOnly) query.append('activeOnly', '1');
  if (params.limit) query.append('limit', String(params.limit));
  const url = '/api/compliance-items' + (query.toString() ? `?${query}` : '');
  return apiRequest<ComplianceItem[]>(url);
}

export interface CreateComplianceItemPayload {
  subject_type: string;
  subject_name: string;
  category: string;
  label: string;
  status: string;
  due_date?: string | null;
  completed_date?: string | null;
  notes?: string | null;
}

export async function createComplianceItem(
  payload: CreateComplianceItemPayload
): Promise<ComplianceItem> {
  return apiRequest<ComplianceItem>('/api/compliance-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export interface UpdateComplianceItemPayload {
  subject_type?: string;
  subject_name?: string;
  category?: string;
  label?: string;
  status?: string;
  due_date?: string | null;
  completed_date?: string | null;
  notes?: string | null;
}

export async function updateComplianceItem(
  id: number,
  payload: UpdateComplianceItemPayload
): Promise<ComplianceItem> {
  return apiRequest<ComplianceItem>(`/api/compliance-items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteComplianceItem(id: number): Promise<void> {
  return apiRequest<void>(`/api/compliance-items/${id}`, { method: 'DELETE' });
}
