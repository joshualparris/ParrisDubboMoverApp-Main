import { Property, JobOption, ChildcareOption } from '../types/api';
import api from './base';

// --- Properties ---
export async function listProperties(): Promise<Property[]> {
  return api.get('/properties');
}
export async function getProperty(id: number): Promise<Property> {
  return api.get(`/properties/${id}`);
}
export async function createProperty(data: Partial<Property>): Promise<Property> {
  return api.post('/properties', data);
}
export async function updateProperty(id: number, data: Partial<Property>): Promise<Property> {
  return api.put(`/properties/${id}`, data);
}
export async function deleteProperty(id: number): Promise<void> {
  return api.delete(`/properties/${id}`);
}

// --- Job Options ---
export async function listJobOptions(): Promise<JobOption[]> {
  return api.get('/job-options');
}
export async function getJobOption(id: number): Promise<JobOption> {
  return api.get(`/job-options/${id}`);
}
export async function createJobOption(data: Partial<JobOption>): Promise<JobOption> {
  return api.post('/job-options', data);
}
export async function updateJobOption(id: number, data: Partial<JobOption>): Promise<JobOption> {
  return api.put(`/job-options/${id}`, data);
}
export async function deleteJobOption(id: number): Promise<void> {
  return api.delete(`/job-options/${id}`);
}

// --- Childcare Options ---
export async function listChildcareOptions(): Promise<ChildcareOption[]> {
  return api.get('/childcare-options');
}
export async function getChildcareOption(id: number): Promise<ChildcareOption> {
  return api.get(`/childcare-options/${id}`);
}
export async function createChildcareOption(data: Partial<ChildcareOption>): Promise<ChildcareOption> {
  return api.post('/childcare-options', data);
}
export async function updateChildcareOption(id: number, data: Partial<ChildcareOption>): Promise<ChildcareOption> {
  return api.put(`/childcare-options/${id}`, data);
}
export async function deleteChildcareOption(id: number): Promise<void> {
  return api.delete(`/childcare-options/${id}`);
}
