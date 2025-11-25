import api from './base';
import type { Provider } from '../types/api';

export async function listProviders(): Promise<Provider[]> {
  return api.get('/providers');
}

export async function getProvider(id: number): Promise<Provider> {
  return api.get(`/providers/${id}`);
}

export async function createProvider(data: Partial<Provider>): Promise<Provider> {
  return api.post('/providers', data);
}

export async function updateProvider(id: number, data: Partial<Provider>): Promise<Provider> {
  return api.put(`/providers/${id}`, data);
}

export async function deleteProvider(id: number): Promise<void> {
  return api.delete(`/providers/${id}`);
}
