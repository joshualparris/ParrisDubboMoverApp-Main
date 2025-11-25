// --- CT12: Packing Board ---
export type PackingBoxStatus =
  | 'not_started'
  | 'packing'
  | 'packed'
  | 'loaded'
  | 'unpacked';

export interface PackingArea {
  id: number;
  user_id: number;
  name: string;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PackingBox {
  id: number;
  area_id: number;
  user_id: number;
  label: string;
  status: PackingBoxStatus;
  fragile: boolean;
  priority: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PackingItem {
  id: number;
  box_id: number;
  user_id: number;
  name: string;
  quantity: number;
  notes: string | null;
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

export interface NewTaskPayload {
  domain_id: number;
  title: string;
  description?: string;
  priority?: number;
  due_date?: string | null;
  origin_doc_id?: number | null;
  related_property_id?: number | null;
  related_job_id?: number | null;
  related_provider_id?: number | null;
  related_childcare_id?: number | null;
  related_trip_id?: number | null;
  notes?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: number;
  due_date?: string | null;
  origin_doc_id?: number | null;
  related_property_id?: number | null;
  related_job_id?: number | null;
  related_provider_id?: number | null;
  related_childcare_id?: number | null;
  related_trip_id?: number | null;
  notes?: string | null;
}

// CT13: Task Explanations
export interface TaskExplanation {
  task_id: number;
  explanation: string;
}
 
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

// --- CT10: DCS Work Hub ---
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
  subject_type: string; // e.g. 'person', 'vehicle', 'other'
  subject_name: string; // e.g. 'Josh', 'Kristy', 'RAV4', etc.
  category: string; // e.g. 'driver_licence', 'rego', 'wwcc', 'ndis_review', etc.
  label: string; // Human label, e.g. 'Josh VIC → NSW Licence'
  status: string; // 'pending', 'in_progress', 'done', 'overdue', etc.
  due_date: string | null;
  completed_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
