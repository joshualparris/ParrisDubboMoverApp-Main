// ...existing code...

export interface Property {
  id: number;
  user_id: number;
  address: string;
  type: string;
  rent_weekly: number | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobOption {
  id: number;
  user_id: number;
  employer: string;
  role: string | null;
  hours_per_week: number | null;
  pay_rate_hourly: number | null;
  status: string | null;
  pros: string | null;
  cons: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChildcareOption {
  id: number;
  user_id: number;
  name: string;
  type: string;
  location: string | null;
  min_age_months: number | null;
  max_age_months: number | null;
  daily_fee: number | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'blocked';

export interface Task {
  id: number;
  user_id: number;
  domain_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: number;
  due_date: string | null;
  origin_doc_id: number | null;
  related_property_id: number | null;
  related_job_id: number | null;
  related_provider_id: number | null;
  related_childcare_id: number | null;
  related_trip_id: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  user_id: number;
  title: string;
  original_filename: string | null;
  source_path: string | null;
  content_text: string | null;
  uploaded_at: string;
  updated_at: string;
}

export interface Provider {
  id: number;
  user_id: number;
  name: string;
  type: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  user_id: number;
  provider_id: number | null;
  title: string;
  description: string | null;
  location: string | null;
  start_datetime: string;
  end_datetime: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewProviderInput {
  user_id: number;
  name: string;
  type: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
}

export interface UpdateProviderInput {
  name?: string;
  type?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
}

export interface NewAppointmentInput {
  user_id: number;
  provider_id?: number | null;
  title: string;
  description?: string | null;
  location?: string | null;
  start_datetime: string;
  end_datetime?: string | null;
  notes?: string | null;
}

export interface UpdateAppointmentInput {
  provider_id?: number | null;
  title?: string;
  description?: string | null;
  location?: string | null;
  start_datetime?: string;
  end_datetime?: string | null;
  notes?: string | null;
}

export interface Trip {
  id: number;
  user_id: number;
  date: string;
  origin: string;
  destination: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripAssignment {
  id: number;
  trip_id: number;
  vehicle: string;
  driver_name: string;
  passengers: string | null;
  cargo_notes: string | null;
  misc_notes: string | null;
  created_at: string;
  updated_at: string;
}
