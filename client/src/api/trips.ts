export async function updateTrip(id: number, data: Partial<Trip>): Promise<Trip> {
  return apiRequest<Trip>(`/api/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function updateTripAssignment(id: number, data: Partial<TripAssignment>): Promise<TripAssignment> {
  return apiRequest<TripAssignment>(`/api/assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}
import { apiRequest } from './client';
import type { Trip, TripAssignment } from '../types/trips';

export async function listTrips(): Promise<Trip[]> {
  return apiRequest<Trip[]>('/api/trips');
}

export async function getTrip(id: number): Promise<Trip> {
  return apiRequest<Trip>(`/api/trips/${id}`);
}

export async function createTrip(data: Partial<Trip>): Promise<Trip> {
  return apiRequest<Trip>('/api/trips', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteTrip(id: number): Promise<void> {
  await apiRequest<void>(`/api/trips/${id}`, { method: 'DELETE' });
}

export async function listTripAssignments(trip_id: number): Promise<TripAssignment[]> {
  return apiRequest<TripAssignment[]>(`/api/trips/${trip_id}/assignments`);
}

export async function createTripAssignment(trip_id: number, data: Partial<TripAssignment>): Promise<TripAssignment> {
  return apiRequest<TripAssignment>(`/api/trips/${trip_id}/assignments`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteTripAssignment(id: number): Promise<void> {
  await apiRequest<void>(`/api/assignments/${id}`, { method: 'DELETE' });
}
