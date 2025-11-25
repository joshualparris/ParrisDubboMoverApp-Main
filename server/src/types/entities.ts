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

export interface WorkLink {
  id: number;
  user_id: number;
  title: string;
  url: string;
  description?: string | null;
  category?: string | null;
  icon_emoji?: string | null;
  related_task_id?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplianceItem {
  id: number;
  user_id: number;
  subject_type: string;
  subject_name: string;
  category: string;
  status: string;
  due_date?: string | null;
  completed_date?: string | null;
  notes?: string | null;
  created_at: string;
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

export interface PackingArea {
  id: number;
  user_id: number;
  name: string;
  location_description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PackingBox {
  id: number;
  area_id: number;
  label: string;
  box_type: string | null;
  weight_kg: number | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PackingItem {
  id: number;
  box_id: number;
  name: string;
  quantity: number;
  fragile: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CommunityPlaceType = 'church' | 'parachurch' | 'school' | 'group' | 'other';

export interface CommunityPlace {
  id: number;
  user_id: number;
  name: string;
  type: CommunityPlaceType;
  address?: string | null;
  suburb?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  phone?: string | null;
  website?: string | null;
  kids_suitability_note?: string | null;
  ms_friendly_note?: string | null;
  overall_rating?: number | null;
  is_current_home?: boolean | number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunityVisit {
  id: number;
  user_id?: number;
  place_id: number;
  visit_date: string; // ISO date string
  service_type?: string | null;
  who_attended?: string | null;
  vibe_summary?: string | null;
  kids_experience?: string | null;
  teaching_style?: string | null;
  hospitality_note?: string | null;
  rating?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
