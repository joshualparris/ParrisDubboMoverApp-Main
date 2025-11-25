import { apiRequest } from './client';

const api = {
  get: <T>(path: string) => apiRequest<T>(`/api${path.startsWith('/') ? path : '/' + path}`),
  post: <T>(path: string, data: any) => apiRequest<T>(`/api${path.startsWith('/') ? path : '/' + path}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: <T>(path: string, data: any) => apiRequest<T>(`/api${path.startsWith('/') ? path : '/' + path}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: <T>(path: string) => apiRequest<T>(`/api${path.startsWith('/') ? path : '/' + path}`, {
    method: 'DELETE',
  }),
};

export default api;
