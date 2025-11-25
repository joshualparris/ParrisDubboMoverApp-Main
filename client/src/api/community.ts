import { apiRequest } from './client';

export async function fetchPlaces(): Promise<any[]> {
  return apiRequest('/api/community/places');
}

export async function fetchVisits(placeId: number): Promise<any[]> {
  return apiRequest(`/api/community/places/${placeId}/visits`);
}

export async function createPlace(payload: any) {
  return apiRequest('/api/community/places', { method: 'POST', body: JSON.stringify(payload) });
}

export async function logVisit(placeId: number, payload: any) {
  return apiRequest(`/api/community/places/${placeId}/visits`, { method: 'POST', body: JSON.stringify(payload) });
}
