import api from './base';
import type { Appointment } from '../types/api';

export async function listAppointments(): Promise<Appointment[]> {
  return api.get('/appointments');
}

export async function getAppointment(id: number): Promise<Appointment> {
  return api.get(`/appointments/${id}`);
}

export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  return api.post('/appointments', data);
}

export async function updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
  return api.put(`/appointments/${id}`, data);
}

export async function deleteAppointment(id: number): Promise<void> {
  return api.delete(`/appointments/${id}`);
}
