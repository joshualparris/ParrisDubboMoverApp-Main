// --- CT11: Compliance Items ---
export interface ComplianceItemInput {
  user_id: number;
  subject_type: string;
  subject_name: string;
  category: string;
  status: string;
  due_date?: string | null;
  completed_date?: string | null;
  notes?: string | null;
}

export async function listComplianceItems(userId: number = 1): Promise<any[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM compliance_items WHERE user_id = ? ORDER BY due_date ASC, created_at DESC').all(userId);
}

export async function getComplianceItemById(id: number): Promise<any | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM compliance_items WHERE id = ?').get(id) ?? null;
}

export async function createComplianceItem(input: ComplianceItemInput): Promise<any> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO compliance_items (user_id, subject_type, subject_name, category, status, due_date, completed_date, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id,
    input.subject_type,
    input.subject_name,
    input.category,
    input.status,
    input.due_date ?? null,
    input.completed_date ?? null,
    input.notes ?? null,
    now,
    now
  );
  return getComplianceItemById(result.lastInsertRowid);
}

export async function updateComplianceItem(id: number, input: Partial<ComplianceItemInput>): Promise<any | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['subject_type', 'subject_name', 'category', 'status', 'due_date', 'completed_date', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getComplianceItemById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  db.prepare(`UPDATE compliance_items SET ${setClause} WHERE id = ?`).run(...values, id);
  return getComplianceItemById(id);
}

export async function deleteComplianceItem(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM compliance_items WHERE id = ?').run(id);
}
export async function updateTrip(id: number, input: Partial<Trip>): Promise<Trip | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['date', 'origin', 'destination', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getTripById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  db.prepare(`UPDATE trips SET ${setClause} WHERE id = ?`).run(...values, id);
  return getTripById(id);
}

export async function updateTripAssignment(id: number, input: Partial<TripAssignment>): Promise<TripAssignment | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['vehicle', 'driver_name', 'passengers', 'cargo_notes', 'misc_notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return db.prepare('SELECT * FROM trip_assignments WHERE id = ?').get(id) ?? null;
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  db.prepare(`UPDATE trip_assignments SET ${setClause} WHERE id = ?`).run(...values, id);
  return db.prepare('SELECT * FROM trip_assignments WHERE id = ?').get(id) ?? null;
}
import { getDb } from './index';
import type { Domain, Task, TaskStatus, Trip, TripAssignment, Provider, Appointment } from '../types/entities';

export interface NewTaskInput {
  user_id: number;
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

export async function getAllDomains(): Promise<Domain[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM domains ORDER BY id ASC').all();
}

export async function createTask(input: NewTaskInput): Promise<Task> {
  const db = getDb();
  const now = new Date().toISOString();
  const status = 'pending';
  const priority = input.priority ?? 2;
  const stmt = db.prepare(`
    INSERT INTO tasks (
      user_id, domain_id, title, description, status, priority, due_date, origin_doc_id,
      related_property_id, related_job_id, related_provider_id, related_childcare_id, related_trip_id, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id,
    input.domain_id,
    input.title,
    input.description ?? null,
    status,
    priority,
    input.due_date ?? null,
    input.origin_doc_id ?? null,
    input.related_property_id ?? null,
    input.related_job_id ?? null,
    input.related_provider_id ?? null,
    input.related_childcare_id ?? null,
    input.related_trip_id ?? null,
    input.notes ?? null,
    now,
    now
  );
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
}

export async function getTaskById(id: number): Promise<Task | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) ?? null;
}

export async function getTasksByDomain(domainSlugOrId: string | number): Promise<Task[]> {
  const db = getDb();
  if (typeof domainSlugOrId === 'string') {
    return db.prepare(`
      SELECT t.* FROM tasks t
      JOIN domains d ON t.domain_id = d.id
      WHERE d.slug = ?
      ORDER BY t.due_date ASC, t.priority DESC, t.created_at ASC
    `).all(domainSlugOrId);
  } else {
    return db.prepare(`
      SELECT * FROM tasks
      WHERE domain_id = ?
      ORDER BY due_date ASC, priority DESC, created_at ASC
    `).all(domainSlugOrId);
  }
}

// --- CT9: What Next? (Next Actions)
export async function listPendingTasks(limit: number = 3): Promise<Array<Task & { domain_slug?: string }>> {
  const db = getDb();
  // Select pending tasks and include domain slug for context
  return db.prepare(`
    SELECT t.*, d.slug as domain_slug
    FROM tasks t
    JOIN domains d ON t.domain_id = d.id
    WHERE t.status = 'pending'
    ORDER BY t.priority DESC, (t.due_date IS NULL), t.due_date ASC, t.created_at ASC
    LIMIT ?
  `).all(limit) as Array<Task & { domain_slug?: string }>;
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare('UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

export async function deleteTask(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}

// --- CT6: Trips & Assignments ---

// --- CT7: Properties ---
import type { Property, JobOption, ChildcareOption } from '../types/entities';

export async function listProperties(): Promise<Property[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM properties ORDER BY created_at DESC').all();
}

export async function getPropertyById(id: number): Promise<Property | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM properties WHERE id = ?').get(id) ?? null;
}

export async function createProperty(input: Omit<Property, "id" | "created_at" | "updated_at">): Promise<Property> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO properties (user_id, address, type, rent_weekly, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id ?? 1,
    input.address,
    input.type,
    input.rent_weekly ?? null,
    input.status ?? null,
    input.notes ?? null,
    now,
    now
  );
  return db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid);
}

export async function updateProperty(id: number, input: Partial<Property>): Promise<Property | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['address', 'type', 'rent_weekly', 'status', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getPropertyById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  db.prepare(`UPDATE properties SET ${setClause} WHERE id = ?`).run(...values, id);
  return getPropertyById(id);
}

export async function deleteProperty(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM properties WHERE id = ?').run(id);
}

// --- CT7: Job Options ---
export async function listJobOptions(): Promise<JobOption[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM job_options ORDER BY created_at DESC').all();
}

export async function getJobOptionById(id: number): Promise<JobOption | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM job_options WHERE id = ?').get(id) ?? null;
}

export async function createJobOption(input: Omit<JobOption, "id" | "created_at" | "updated_at">): Promise<JobOption> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO job_options (user_id, employer, role, hours_per_week, pay_rate_hourly, status, pros, cons, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id ?? 1,
    input.employer,
    input.role ?? null,
    input.hours_per_week ?? null,
    input.pay_rate_hourly ?? null,
    input.status ?? null,
    input.pros ?? null,
    input.cons ?? null,
    input.notes ?? null,
    now,
    now
  );
  return db.prepare('SELECT * FROM job_options WHERE id = ?').get(result.lastInsertRowid);
}

export async function updateJobOption(id: number, input: Partial<JobOption>): Promise<JobOption | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['employer', 'role', 'hours_per_week', 'pay_rate_hourly', 'status', 'pros', 'cons', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getJobOptionById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  db.prepare(`UPDATE job_options SET ${setClause} WHERE id = ?`).run(...values, id);
  return getJobOptionById(id);
}

export async function deleteJobOption(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM job_options WHERE id = ?').run(id);
}

// --- CT7: Childcare Options ---
export async function listChildcareOptions(): Promise<ChildcareOption[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM childcare_options ORDER BY created_at DESC').all();
}

export async function getChildcareOptionById(id: number): Promise<ChildcareOption | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM childcare_options WHERE id = ?').get(id) ?? null;
}

export async function createChildcareOption(input: Omit<ChildcareOption, "id" | "created_at" | "updated_at">): Promise<ChildcareOption> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO childcare_options (user_id, name, type, location, min_age_months, max_age_months, daily_fee, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id ?? 1,
    input.name,
    input.type,
    input.location ?? null,
    input.min_age_months ?? null,
    input.max_age_months ?? null,
    input.daily_fee ?? null,
    input.status ?? null,
    input.notes ?? null,
    now,
    now
  );
  return db.prepare('SELECT * FROM childcare_options WHERE id = ?').get(result.lastInsertRowid);
}

export async function updateChildcareOption(id: number, input: Partial<ChildcareOption>): Promise<ChildcareOption | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['name', 'type', 'location', 'min_age_months', 'max_age_months', 'daily_fee', 'status', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getChildcareOptionById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  db.prepare(`UPDATE childcare_options SET ${setClause} WHERE id = ?`).run(...values, id);
  return getChildcareOptionById(id);
}

export async function deleteChildcareOption(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM childcare_options WHERE id = ?').run(id);
}

// --- CT8: Providers & Appointments ---

export async function listProviders(): Promise<Provider[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM providers ORDER BY created_at DESC').all();
}

export async function getProviderById(id: number): Promise<Provider | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM providers WHERE id = ?').get(id) ?? null;
}

export async function createProvider(input: Omit<Provider, 'id' | 'created_at' | 'updated_at'>): Promise<Provider> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO providers (user_id, name, type, phone, email, address, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id ?? 1,
    input.name,
    input.type,
    input.phone ?? null,
    input.email ?? null,
    input.address ?? null,
    input.notes ?? null,
    now,
    now
  );
  return db.prepare('SELECT * FROM providers WHERE id = ?').get(result.lastInsertRowid);
}

export async function updateProvider(id: number, input: Partial<Provider>): Promise<Provider | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['name', 'type', 'phone', 'email', 'address', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getProviderById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  db.prepare(`UPDATE providers SET ${setClause} WHERE id = ?`).run(...values, id);
  return getProviderById(id);
}

export async function deleteProvider(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM providers WHERE id = ?').run(id);
}

// Appointments
export async function listAppointments(): Promise<Appointment[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM appointments ORDER BY start_datetime ASC').all();
}

export async function getAppointmentById(id: number): Promise<Appointment | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) ?? null;
}

export async function createAppointment(input: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO appointments (user_id, provider_id, title, description, location, start_datetime, end_datetime, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id ?? 1,
    input.provider_id ?? null,
    input.title,
    input.description ?? null,
    input.location ?? null,
    input.start_datetime,
    input.end_datetime ?? null,
    input.notes ?? null,
    now,
    now
  );
  return db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid);
}

export async function updateAppointment(id: number, input: Partial<Appointment>): Promise<Appointment | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['provider_id', 'title', 'description', 'location', 'start_datetime', 'end_datetime', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getAppointmentById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  db.prepare(`UPDATE appointments SET ${setClause} WHERE id = ?`).run(...values, id);
  return getAppointmentById(id);
}

export async function deleteAppointment(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
}
export async function getAllTrips(): Promise<Trip[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM trips ORDER BY date ASC, created_at ASC').all();
}

export async function getTripById(id: number): Promise<Trip | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM trips WHERE id = ?').get(id) ?? null;
}

export interface NewTripInput {
  user_id: number;
  date: string;
  origin: string;
  destination: string;
  notes?: string;
}

export async function createTrip(input: NewTripInput): Promise<Trip> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO trips (user_id, date, origin, destination, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id,
    input.date,
    input.origin,
    input.destination,
    input.notes ?? null,
    now,
    now
  );
  return db.prepare('SELECT * FROM trips WHERE id = ?').get(result.lastInsertRowid);
}

export async function deleteTrip(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM trips WHERE id = ?').run(id);
}

export async function getTripAssignments(trip_id: number): Promise<TripAssignment[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM trip_assignments WHERE trip_id = ? ORDER BY id ASC').all(trip_id);
}

export interface NewTripAssignmentInput {
  trip_id: number;
  vehicle: string;
  driver_name: string;
  passengers?: string;
  cargo_notes?: string;
  misc_notes?: string;
}

export async function createTripAssignment(input: NewTripAssignmentInput): Promise<TripAssignment> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO trip_assignments (trip_id, vehicle, driver_name, passengers, cargo_notes, misc_notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.trip_id,
    input.vehicle,
    input.driver_name,
    input.passengers ?? null,
    input.cargo_notes ?? null,
    input.misc_notes ?? null,
    now,
    now
  );
  return db.prepare('SELECT * FROM trip_assignments WHERE id = ?').get(result.lastInsertRowid);
}

export async function deleteTripAssignment(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM trip_assignments WHERE id = ?').run(id);
}

// --- CT9: Next Actions / What Next engine ---
// Return top pending tasks ordered by priority, due date and creation date
export async function listPendingTasks(limit: number = 3): Promise<Array<Task & { domain_slug?: string }>> {
  const db = getDb();
  return db.prepare(`
    SELECT t.*, d.slug as domain_slug
    FROM tasks t
    JOIN domains d ON t.domain_id = d.id
    WHERE t.status = 'pending'
    ORDER BY t.priority DESC, (t.due_date IS NULL), t.due_date ASC, t.created_at ASC
    LIMIT ?
  `).all(limit) as Array<Task & { domain_slug?: string }>;
}

// --- CT10: Work Links ---
export interface WorkLinkInput {
  user_id: number;
  title: string;
  url: string;
  description?: string;
  category?: string;
  icon_emoji?: string;
  related_task_id?: number | null;
  notes?: string;
}

export async function listWorkLinks(userId: number): Promise<any[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM work_links WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}

export async function getWorkLinkById(id: number): Promise<any | null> {
  const db = getDb();
  return db.prepare('SELECT * FROM work_links WHERE id = ?').get(id) ?? null;
}

export async function createWorkLink(input: WorkLinkInput): Promise<any> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO work_links (user_id, title, url, description, category, icon_emoji, related_task_id, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.user_id,
    input.title,
    input.url,
    input.description ?? null,
    input.category ?? null,
    input.icon_emoji ?? null,
    input.related_task_id ?? null,
    input.notes ?? null,
    now,
    now
  );
  return getWorkLinkById(result.lastInsertRowid);
}

export async function updateWorkLink(id: number, input: Partial<WorkLinkInput>): Promise<any | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['title', 'url', 'description', 'category', 'icon_emoji', 'related_task_id', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getWorkLinkById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  db.prepare(`UPDATE work_links SET ${setClause} WHERE id = ?`).run(...values, id);
  return getWorkLinkById(id);
}

export async function deleteWorkLink(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM work_links WHERE id = ?').run(id);
}

