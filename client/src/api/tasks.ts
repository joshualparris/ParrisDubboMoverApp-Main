import { apiRequest } from './client';
import type { Task, NewTaskPayload, UpdateTaskPayload, TaskStatus, TaskExplanation } from '../types/api';

export interface TaskQueryParams {
  domainId?: number;
  status?: TaskStatus;
  dueBefore?: string;
  limit?: number;
}

export async function fetchTasks(params: TaskQueryParams = {}): Promise<Task[]> {
  // Only support fetch by domainId for now
  if (params.domainId != null) {
    return apiRequest<Task[]>(`/api/tasks/domain/${params.domainId}`);
  }
  throw new Error('fetchTasks: domainId is required');
}

export async function createTask(payload: NewTaskPayload): Promise<Task> {
  // Always include user_id: 1 for now
  return apiRequest<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ ...payload, user_id: 1 }),
  });
}

export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<Task> {
  // Use the correct backend route for status update
  if (payload.status !== undefined) {
    return apiRequest<Task>(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: payload.status }),
    });
  }
  // For other updates, fallback to PATCH /api/tasks/:id if implemented
  return apiRequest<Task>(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// CT13: Fetch explanation for a task
export async function fetchTaskExplanation(taskId: number): Promise<TaskExplanation> {
  return apiRequest<TaskExplanation>(`/api/tasks/${taskId}/why`);
}

export async function deleteTask(id: number): Promise<void> {
  return apiRequest<void>(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
}
