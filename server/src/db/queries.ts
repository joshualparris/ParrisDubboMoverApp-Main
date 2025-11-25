import { getDb } from './index';
import type {
  Domain,
  Task,
  TaskStatus,
  Trip,
  TripAssignment,
  Property,
  JobOption,
  ChildcareOption,
  Provider,
  Appointment,
  WorkLink,
  ComplianceItem,
  PackingArea,
  PackingBox,
  PackingItem,
  Document,
  CommunityPlace,
  CommunityVisit,
} from '../types/entities';

/**
 * Single, clean queries.ts
 * - One import section only.
 * - All helpers use getDb() (better-sqlite3) and follow the same pattern:
 *   insert -> run -> SELECT by lastInsertRowid
 * - No duplicate code or duplicate imports.
 */

/* ---------------- Domains ---------------- */
export async function getAllDomains(): Promise<Domain[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM domains ORDER BY id ASC').all() as Domain[];
}

/* ---------------- Tasks ---------------- */
export interface NewTaskInput {
  user_id: number;
  domain_id: number;
  title: string;
  description?: string | null;
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

export async function createTask(input: NewTaskInput): Promise<Task> {
  const db = getDb();
  const now = new Date().toISOString();
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
    'pending',
    input.priority ?? 2,
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
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as Task;
}

export async function getTaskById(id: number): Promise<Task | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task) ?? null;
}

export async function getTasksByDomain(domainSlugOrId: string | number): Promise<Task[]> {
  const db = getDb();
  if (typeof domainSlugOrId === 'string') {
    return db.prepare(`
      SELECT t.* FROM tasks t
      JOIN domains d ON t.domain_id = d.id
      WHERE d.slug = ?
      ORDER BY t.due_date ASC, t.priority DESC, t.created_at ASC
    `).all(domainSlugOrId) as Task[];
  } else {
    return db.prepare(`
      SELECT * FROM tasks
      WHERE domain_id = ?
      ORDER BY due_date ASC, priority DESC, created_at ASC
    `).all(domainSlugOrId) as Task[];
  }
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare('UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task;
}

export async function deleteTask(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}

/* ---------------- Next Actions ---------------- */
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

/* ---------------- Trips & Assignments ---------------- */
export async function getAllTrips(): Promise<Trip[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM trips ORDER BY date ASC, created_at ASC').all() as Trip[];
}

export async function getTripById(id: number): Promise<Trip | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM trips WHERE id = ?').get(id) as Trip) ?? null;
}

export interface NewTripInput {
  user_id: number;
  date: string;
  origin: string;
  destination: string;
  notes?: string | null;
}
export async function createTrip(input: NewTripInput): Promise<Trip> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO trips (user_id, date, origin, destination, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(input.user_id, input.date, input.origin, input.destination, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM trips WHERE id = ?').get(result.lastInsertRowid) as Trip;
}

export async function updateTrip(id: number, input: Partial<Trip>): Promise<Trip | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['date', 'origin', 'destination', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getTripById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE trips SET ${setClause} WHERE id = ?`).run(...values, id);
  return getTripById(id);
}

export async function deleteTrip(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM trips WHERE id = ?').run(id);
}

/* Trip assignments */
export interface NewTripAssignmentInput {
  trip_id: number;
  vehicle: string;
  driver_name: string;
  passengers?: string | null;
  cargo_notes?: string | null;
  misc_notes?: string | null;
}
export async function getTripAssignments(trip_id: number): Promise<TripAssignment[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM trip_assignments WHERE trip_id = ? ORDER BY id ASC').all(trip_id) as TripAssignment[];
}
export async function createTripAssignment(input: NewTripAssignmentInput): Promise<TripAssignment> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO trip_assignments (trip_id, vehicle, driver_name, passengers, cargo_notes, misc_notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(input.trip_id, input.vehicle, input.driver_name, input.passengers ?? null, input.cargo_notes ?? null, input.misc_notes ?? null, now, now);
  return db.prepare('SELECT * FROM trip_assignments WHERE id = ?').get(result.lastInsertRowid) as TripAssignment;
}
export async function updateTripAssignment(id: number, input: Partial<TripAssignment>): Promise<TripAssignment | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['vehicle', 'driver_name', 'passengers', 'cargo_notes', 'misc_notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return db.prepare('SELECT * FROM trip_assignments WHERE id = ?').get(id) ?? null;
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE trip_assignments SET ${setClause} WHERE id = ?`).run(...values, id);
  return db.prepare('SELECT * FROM trip_assignments WHERE id = ?').get(id) ?? null;
}
export async function deleteTripAssignment(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM trip_assignments WHERE id = ?').run(id);
}

/* ---------------- Properties, JobOptions, Childcare ---------------- */
export async function listProperties(): Promise<Property[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM properties ORDER BY created_at DESC').all() as Property[];
}
export async function getPropertyById(id: number): Promise<Property | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as Property) ?? null;
}
export async function createProperty(input: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO properties (user_id, address, type, rent_weekly, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(input.user_id ?? 1, input.address, input.type, input.rent_weekly ?? null, input.status ?? null, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid) as Property;
}
export async function updateProperty(id: number, input: Partial<Property>): Promise<Property | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['address', 'type', 'rent_weekly', 'status', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getPropertyById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE properties SET ${setClause} WHERE id = ?`).run(...values, id);
  return getPropertyById(id);
}
export async function deleteProperty(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM properties WHERE id = ?').run(id);
}

/* Job options */
export async function listJobOptions(): Promise<JobOption[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM job_options ORDER BY created_at DESC').all() as JobOption[];
}
export async function getJobOptionById(id: number): Promise<JobOption | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM job_options WHERE id = ?').get(id) as JobOption) ?? null;
}
export async function createJobOption(input: Omit<JobOption, 'id' | 'created_at' | 'updated_at'>): Promise<JobOption> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO job_options (user_id, employer, role, hours_per_week, pay_rate_hourly, status, pros, cons, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(input.user_id ?? 1, input.employer, input.role ?? null, input.hours_per_week ?? null, input.pay_rate_hourly ?? null, input.status ?? null, input.pros ?? null, input.cons ?? null, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM job_options WHERE id = ?').get(result.lastInsertRowid) as JobOption;
}
export async function updateJobOption(id: number, input: Partial<JobOption>): Promise<JobOption | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['employer', 'role', 'hours_per_week', 'pay_rate_hourly', 'status', 'pros', 'cons', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getJobOptionById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE job_options SET ${setClause} WHERE id = ?`).run(...values, id);
  return getJobOptionById(id);
}
export async function deleteJobOption(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM job_options WHERE id = ?').run(id);
}

/* Childcare options */
export async function listChildcareOptions(): Promise<ChildcareOption[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM childcare_options ORDER BY created_at DESC').all() as ChildcareOption[];
}
export async function getChildcareOptionById(id: number): Promise<ChildcareOption | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM childcare_options WHERE id = ?').get(id) as ChildcareOption) ?? null;
}
export async function createChildcareOption(input: Omit<ChildcareOption, 'id' | 'created_at' | 'updated_at'>): Promise<ChildcareOption> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO childcare_options (user_id, name, type, location, min_age_months, max_age_months, daily_fee, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(input.user_id ?? 1, input.name, input.type, input.location ?? null, input.min_age_months ?? null, input.max_age_months ?? null, input.daily_fee ?? null, input.status ?? null, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM childcare_options WHERE id = ?').get(result.lastInsertRowid) as ChildcareOption;
}
export async function updateChildcareOption(id: number, input: Partial<ChildcareOption>): Promise<ChildcareOption | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['name', 'type', 'location', 'min_age_months', 'max_age_months', 'daily_fee', 'status', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getChildcareOptionById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE childcare_options SET ${setClause} WHERE id = ?`).run(...values, id);
  return getChildcareOptionById(id);
}
export async function deleteChildcareOption(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM childcare_options WHERE id = ?').run(id);
}

/* ---------------- Providers & Appointments ---------------- */
export async function listProviders(): Promise<Provider[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM providers ORDER BY created_at DESC').all() as Provider[];
}
export async function getProviderById(id: number): Promise<Provider | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM providers WHERE id = ?').get(id) as Provider) ?? null;
}
export async function createProvider(input: Omit<Provider, 'id' | 'created_at' | 'updated_at'>): Promise<Provider> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO providers (user_id, name, type, phone, email, address, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(input.user_id ?? 1, input.name, input.type, input.phone ?? null, input.email ?? null, input.address ?? null, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM providers WHERE id = ?').get(result.lastInsertRowid) as Provider;
}
export async function updateProvider(id: number, input: Partial<Provider>): Promise<Provider | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['name', 'type', 'phone', 'email', 'address', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getProviderById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE providers SET ${setClause} WHERE id = ?`).run(...values, id);
  return getProviderById(id);
}
export async function deleteProvider(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM providers WHERE id = ?').run(id);
}

/* Appointments */
export async function listAppointments(): Promise<Appointment[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM appointments ORDER BY start_datetime ASC').all() as Appointment[];
}
export async function getAppointmentById(id: number): Promise<Appointment | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as Appointment) ?? null;
}
export async function createAppointment(input: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO appointments (user_id, provider_id, title, description, location, start_datetime, end_datetime, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(input.user_id ?? 1, input.provider_id ?? null, input.title, input.description ?? null, input.location ?? null, input.start_datetime, input.end_datetime ?? null, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid) as Appointment;
}
export async function updateAppointment(id: number, input: Partial<Appointment>): Promise<Appointment | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['provider_id', 'title', 'description', 'location', 'start_datetime', 'end_datetime', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getAppointmentById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE appointments SET ${setClause} WHERE id = ?`).run(...values, id);
  return getAppointmentById(id);
}
export async function deleteAppointment(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
}

/* ---------------- Work Links ---------------- */
export interface WorkLinkInput {
  user_id?: number;
  title: string;
  url: string;
  description?: string | null;
  category?: string | null;
  icon_emoji?: string | null;
  related_task_id?: number | null;
  notes?: string | null;
}
export async function listWorkLinks(userId: number = 1): Promise<WorkLink[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM work_links WHERE user_id = ? ORDER BY created_at DESC').all(userId) as WorkLink[];
}
export async function getWorkLinkById(id: number): Promise<WorkLink | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM work_links WHERE id = ?').get(id) as WorkLink) ?? null;
}
export async function createWorkLink(input: WorkLinkInput): Promise<WorkLink> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO work_links (user_id, title, url, description, category, icon_emoji, related_task_id, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(input.user_id ?? 1, input.title, input.url, input.description ?? null, input.category ?? null, input.icon_emoji ?? null, input.related_task_id ?? null, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM work_links WHERE id = ?').get(result.lastInsertRowid) as WorkLink;
}
export async function updateWorkLink(id: number, input: Partial<WorkLinkInput>): Promise<WorkLink | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['title', 'url', 'description', 'category', 'icon_emoji', 'related_task_id', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getWorkLinkById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE work_links SET ${setClause} WHERE id = ?`).run(...values, id);
  return getWorkLinkById(id);
}
export async function deleteWorkLink(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM work_links WHERE id = ?').run(id);
}

/* ---------------- Compliance Items ---------------- */
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
export async function listComplianceItems(userId: number = 1): Promise<ComplianceItem[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM compliance_items WHERE user_id = ? ORDER BY due_date ASC, created_at DESC').all(userId) as ComplianceItem[];
}
export async function getComplianceItemById(id: number): Promise<ComplianceItem | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM compliance_items WHERE id = ?').get(id) as ComplianceItem) ?? null;
}
export async function createComplianceItem(input: ComplianceItemInput): Promise<ComplianceItem> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare('INSERT INTO compliance_items (user_id, subject_type, subject_name, category, status, due_date, completed_date, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(input.user_id, input.subject_type, input.subject_name, input.category, input.status, input.due_date ?? null, input.completed_date ?? null, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM compliance_items WHERE id = ?').get(result.lastInsertRowid) as ComplianceItem;
}
export async function updateComplianceItem(id: number, input: Partial<ComplianceItemInput>): Promise<ComplianceItem | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['subject_type', 'subject_name', 'category', 'status', 'due_date', 'completed_date', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getComplianceItemById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE compliance_items SET ${setClause} WHERE id = ?`).run(...values, id);
  return getComplianceItemById(id);
}
export async function deleteComplianceItem(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM compliance_items WHERE id = ?').run(id);
}

/* ---------------- Packing: areas / boxes / items ---------------- */
export async function listPackingAreas(): Promise<PackingArea[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM packing_areas WHERE user_id = 1 ORDER BY name ASC').all() as PackingArea[];
}
export async function getPackingAreaById(id: number): Promise<PackingArea | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM packing_areas WHERE id = ?').get(id) as PackingArea) ?? null;
}
export async function createPackingArea(input: { user_id?: number; name: string; location?: string | null; notes?: string | null }): Promise<PackingArea> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare('INSERT INTO packing_areas (user_id, name, location, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)');
  const result = stmt.run(input.user_id ?? 1, input.name, input.location ?? null, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM packing_areas WHERE id = ?').get(result.lastInsertRowid) as PackingArea;
}
export async function updatePackingArea(id: number, input: Partial<PackingArea>): Promise<PackingArea | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['name', 'location', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getPackingAreaById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE packing_areas SET ${setClause} WHERE id = ?`).run(...values, id);
  return getPackingAreaById(id);
}
export async function deletePackingArea(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM packing_items WHERE box_id IN (SELECT id FROM packing_boxes WHERE area_id = ? AND user_id = 1)').run(id);
  db.prepare('DELETE FROM packing_boxes WHERE area_id = ? AND user_id = 1').run(id);
  db.prepare('DELETE FROM packing_areas WHERE id = ? AND user_id = 1').run(id);
}

export async function listPackingBoxes(params: { areaId?: number; status?: string; fragileOnly?: boolean; limit?: number } = {}): Promise<PackingBox[]> {
  const db = getDb();
  const limit = params.limit && params.limit > 0 ? params.limit : 200;
  let sql = 'SELECT * FROM packing_boxes WHERE user_id = 1';
  const bindings: any[] = [];
  if (params.areaId != null) { sql += ' AND area_id = ?'; bindings.push(params.areaId); }
  if (params.status) { sql += ' AND status = ?'; bindings.push(params.status); }
  if (params.fragileOnly) { sql += ' AND fragile = 1'; }
  sql += ' ORDER BY label ASC LIMIT ?';
  bindings.push(limit);
  return db.prepare(sql).all(...bindings) as PackingBox[];
}
export async function getPackingBoxById(id: number): Promise<PackingBox | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM packing_boxes WHERE id = ?').get(id) as PackingBox) ?? null;
}
export async function createPackingBox(input: { area_id?: number | null; label: string; description?: string | null; status?: string | null; fragile?: boolean }): Promise<PackingBox> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare('INSERT INTO packing_boxes (user_id, area_id, label, description, status, fragile, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(1, input.area_id ?? null, input.label, input.description ?? null, input.status ?? 'not_started', input.fragile ? 1 : 0, now, now);
  return db.prepare('SELECT * FROM packing_boxes WHERE id = ?').get(result.lastInsertRowid) as PackingBox;
}
export async function updatePackingBox(id: number, input: Partial<PackingBox>): Promise<PackingBox | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['label', 'description', 'status', 'fragile'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getPackingBoxById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE packing_boxes SET ${setClause} WHERE id = ?`).run(...values, id);
  return getPackingBoxById(id);
}
export async function deletePackingBox(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM packing_items WHERE box_id = ? AND user_id = 1').run(id);
  db.prepare('DELETE FROM packing_boxes WHERE id = ? AND user_id = 1').run(id);
}

export async function listPackingItems(params: { boxId?: number; limit?: number } = {}): Promise<PackingItem[]> {
  const db = getDb();
  const limit = params.limit && params.limit > 0 ? params.limit : 500;
  let sql = 'SELECT * FROM packing_items WHERE user_id = 1';
  const bindings: any[] = [];
  if (params.boxId != null) { sql += ' AND box_id = ?'; bindings.push(params.boxId); }
  sql += ' ORDER BY name ASC LIMIT ?';
  bindings.push(limit);
  return db.prepare(sql).all(...bindings) as PackingItem[];
}
export async function getPackingItemById(id: number): Promise<PackingItem | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM packing_items WHERE id = ?').get(id) as PackingItem) ?? null;
}
export async function createPackingItem(input: { box_id: number; name: string; notes?: string | null; quantity?: number | null }): Promise<PackingItem> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare('INSERT INTO packing_items (user_id, box_id, name, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)');
  const result = stmt.run(1, input.box_id, input.name, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM packing_items WHERE id = ?').get(result.lastInsertRowid) as PackingItem;
}
export async function updatePackingItem(id: number, input: Partial<PackingItem>): Promise<PackingItem | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['name', 'notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getPackingItemById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE packing_items SET ${setClause} WHERE id = ?`).run(...values, id);
  return getPackingItemById(id);
}
export async function deletePackingItem(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM packing_items WHERE id = ? AND user_id = 1').run(id);
}

/* ---------------- Documents (if not in queries.documents.ts) ---------------- */
export interface NewDocumentInput {
  user_id: number;
  title: string;
  original_filename: string | null;
  source_path: string | null;
  content_text: string | null;
  uploaded_at: string;
  updated_at: string;
}
export async function createDocument(input: NewDocumentInput): Promise<Document> {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO documents (user_id, title, original_filename, source_path, content_text, uploaded_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(input.user_id, input.title, input.original_filename ?? null, input.source_path ?? null, input.content_text ?? null, input.uploaded_at, input.updated_at);
  return db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid) as Document;
}
export async function getDocumentById(id: number): Promise<Document | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM documents WHERE id = ?').get(id) as Document) ?? null;
}
export async function listDocuments(params: { search?: string } = {}): Promise<Document[]> {
  const db = getDb();
  if (params.search && params.search.trim().length > 0) {
    const q = `%${params.search}%`;
    return db.prepare('SELECT * FROM documents WHERE title LIKE ? OR content_text LIKE ? ORDER BY uploaded_at DESC').all(q, q) as Document[];
  }
  return db.prepare('SELECT * FROM documents ORDER BY uploaded_at DESC').all() as Document[];
}

/* ---------------- Community: places & visits ---------------- */
export interface ListCommunityVisitsParams {
  placeId: number;
  limit?: number;
}

export async function listCommunityPlaces(): Promise<CommunityPlace[]> {
  const db = getDb();
  return db.prepare('SELECT * FROM community_places WHERE user_id = 1 ORDER BY name ASC').all() as CommunityPlace[];
}
export async function getCommunityPlaceById(id: number): Promise<CommunityPlace | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM community_places WHERE id = ?').get(id) as CommunityPlace) ?? null;
}
export async function createCommunityPlace(input: Partial<CommunityPlace> & { name: string }): Promise<CommunityPlace> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO community_places (user_id, name, type, address, suburb, city, state, postcode, phone, website, kids_suitability_note, ms_friendly_note, overall_rating, is_current_home, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(1, input.name, input.type ?? null, input.address ?? null, input.suburb ?? null, input.city ?? null, input.state ?? null, input.postcode ?? null, input.phone ?? null, input.website ?? null, input.kids_suitability_note ?? null, input.ms_friendly_note ?? null, input.overall_rating ?? null, input.is_current_home ? 1 : 0, input.notes ?? null, now, now);
  return db.prepare('SELECT * FROM community_places WHERE id = ?').get(result.lastInsertRowid) as CommunityPlace;
}
export async function updateCommunityPlace(id: number, input: Partial<CommunityPlace>): Promise<CommunityPlace | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['name','type','address','suburb','city','state','postcode','phone','website','kids_suitability_note','ms_friendly_note','overall_rating','is_current_home','notes'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getCommunityPlaceById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE community_places SET ${setClause} WHERE id = ?`).run(...values, id);
  return getCommunityPlaceById(id);
}
export async function deleteCommunityPlace(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM community_places WHERE id = ? AND user_id = 1').run(id);
}

/* Visits */
export async function listCommunityVisits(params: ListCommunityVisitsParams): Promise<CommunityVisit[]> {
  const db = getDb();
  const limit = params.limit && params.limit > 0 ? params.limit : 50;
  const rows = db.prepare(`
    SELECT *
    FROM community_visits
    WHERE user_id = 1 AND place_id = ?
    ORDER BY visit_date DESC, id DESC
    LIMIT ?
  `).all(params.placeId, limit) as any[];
  return rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    place_id: row.place_id,
    visit_date: row.visit_date,
    service_type: row.service_type,
    who_attended: row.who_attended,
    vibe_summary: row.vibe_summary,
    kids_experience: row.kids_experience,
    teaching_style: row.teaching_style,
    hospitality_note: row.hospitality_note,
    rating: row.rating,
    created_at: row.created_at,
    updated_at: row.updated_at,
  })) as CommunityVisit[];
}
export async function getCommunityVisitById(id: number): Promise<CommunityVisit | null> {
  const db = getDb();
  return (db.prepare('SELECT * FROM community_visits WHERE id = ?').get(id) as CommunityVisit) ?? null;
}
export async function createCommunityVisit(input: Partial<CommunityVisit> & { place_id: number; visit_date: string }): Promise<CommunityVisit> {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO community_visits (user_id, place_id, visit_date, service_type, who_attended, vibe_summary, kids_experience, teaching_style, hospitality_note, rating, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(1, input.place_id, input.visit_date, input.service_type ?? null, input.who_attended ?? null, input.vibe_summary ?? null, input.kids_experience ?? null, input.teaching_style ?? null, input.hospitality_note ?? null, input.rating ?? null, now, now);
  return db.prepare('SELECT * FROM community_visits WHERE id = ?').get(result.lastInsertRowid) as CommunityVisit;
}
export async function updateCommunityVisit(id: number, input: Partial<CommunityVisit>): Promise<CommunityVisit | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const editable = ['visit_date','service_type','who_attended','vibe_summary','kids_experience','teaching_style','hospitality_note','rating'] as const;
  const updates = editable.filter(f => (input as any)[f] !== undefined);
  if (updates.length === 0) return getCommunityVisitById(id);
  const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
  const values = updates.map(f => (input as any)[f]);
  values.push(now);
  db.prepare(`UPDATE community_visits SET ${setClause} WHERE id = ?`).run(...values, id);
  return getCommunityVisitById(id);
}
export async function deleteCommunityVisit(id: number): Promise<void> {
  const db = getDb();
  db.prepare('DELETE FROM community_visits WHERE id = ? AND user_id = 1').run(id);
}

/* ---------------- Default export convenience ---------------- */
export default {
  getAllDomains,

  createTask,
  getTaskById,
  getTasksByDomain,
  updateTaskStatus,
  deleteTask,
  listPendingTasks,

  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripAssignments,
  createTripAssignment,
  updateTripAssignment,
  deleteTripAssignment,

  listProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,

  listJobOptions,
  getJobOptionById,
  createJobOption,
  updateJobOption,
  deleteJobOption,

  listChildcareOptions,
  getChildcareOptionById,
  createChildcareOption,
  updateChildcareOption,
  deleteChildcareOption,

  listProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,

  listAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,

  listWorkLinks,
  getWorkLinkById,
  createWorkLink,
  updateWorkLink,
  deleteWorkLink,

  listComplianceItems,
  getComplianceItemById,
  createComplianceItem,
  updateComplianceItem,
  deleteComplianceItem,

  listPackingAreas,
  getPackingAreaById,
  createPackingArea,
  updatePackingArea,
  deletePackingArea,
  listPackingBoxes,
  getPackingBoxById,
  createPackingBox,
  updatePackingBox,
  deletePackingBox,
  listPackingItems,
  getPackingItemById,
  createPackingItem,
  updatePackingItem,
  deletePackingItem,

  listDocuments,
  getDocumentById,
  createDocument,

  listCommunityPlaces,
  getCommunityPlaceById,
  createCommunityPlace,
  updateCommunityPlace,
  deleteCommunityPlace,

  listCommunityVisits,
  getCommunityVisitById,
  createCommunityVisit,
  updateCommunityVisit,
  deleteCommunityVisit,
};