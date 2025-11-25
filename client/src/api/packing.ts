import { apiRequest } from './client';

export async function fetchPackingAreas(): Promise<any[]> {
  return apiRequest('/api/packing/areas');
}

export async function fetchBoxesForArea(areaId: number): Promise<any[]> {
  return apiRequest(`/api/packing/areas/${areaId}/boxes`);
}

export async function fetchItemsForBox(boxId: number): Promise<any[]> {
  return apiRequest(`/api/packing/boxes/${boxId}/items`);
}

export async function createArea(payload: any) {
  return apiRequest('/api/packing/areas', { method: 'POST', body: JSON.stringify(payload) });
}

export async function createBox(areaId: number, payload: any) {
  return apiRequest(`/api/packing/areas/${areaId}/boxes`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function createItem(boxId: number, payload: any) {
  return apiRequest(`/api/packing/boxes/${boxId}/items`, { method: 'POST', body: JSON.stringify(payload) });
}
