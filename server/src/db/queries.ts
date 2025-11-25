import { execAll, execGet, insertAndReturn, sqliteRun, isPostgres, pgQuery } from './index';
import type { Domain, Task, TaskStatus, Trip, TripAssignment, Provider, Appointment, PackingArea, PackingBox, PackingItem, CommunityPlace, CommunityVisit, Property, JobOption, ChildcareOption } from '../types/entities';

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
  return execAll('SELECT * FROM compliance_items WHERE user_id = ? ORDER BY due_date ASC, created_at DESC', [userId]);
}

export async function getComplianceItemById(id: number): Promise<any | null> {
  return execGet('SELECT * FROM compliance_items WHERE id = ?', [id]);
}

export async function createComplianceItem(input: ComplianceItemInput): Promise<any> {
  const now = new Date().toISOString();
  const sql = `
    INSERT INTO compliance_items (user_id, subject_type, subject_name, category, status, due_date, completed_date, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [input.user_id, input.subject_type, input.subject_name, input.category, input.status, input.due_date ?? null, input.completed_date ?? null, input.notes ?? null, now, now];
  return insertAndReturn('compliance_items', sql, params);
}

export async function updateComplianceItem(id: number, input: Partial<ComplianceItemInput>): Promise<any | null> {
  const now = new Date().toISOString();
  const editable = ['subject_type', 'subject_name', 'category', 'status', 'due_date', 'completed_date', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getComplianceItemById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE compliance_items SET ${setClause} WHERE id = ?`, [...values, id]);
    return getComplianceItemById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE compliance_items SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery(sql, params as any[]);
  return (rows as any[])[0] ?? null;
}

export async function deleteComplianceItem(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM compliance_items WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM compliance_items WHERE id = $1', [id]);
}
export async function updateTrip(id: number, input: Partial<Trip>): Promise<Trip | null> {
  const now = new Date().toISOString();
  const editable = ['date', 'origin', 'destination', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getTripById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE trips SET ${setClause} WHERE id = ?`, [...values, id]);
    return getTripById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE trips SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<Trip[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function updateTripAssignment(id: number, input: Partial<TripAssignment>): Promise<TripAssignment | null> {
  const now = new Date().toISOString();
  const editable = ['vehicle', 'driver_name', 'passengers', 'cargo_notes', 'misc_notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return execGet('SELECT * FROM trip_assignments WHERE id = ?', [id]) as Promise<TripAssignment | null>;
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE trip_assignments SET ${setClause} WHERE id = ?`, [...values, id]);
    return execGet('SELECT * FROM trip_assignments WHERE id = ?', [id]) as Promise<TripAssignment | null>;
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE trip_assignments SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<TripAssignment[]>(sql, params as any[]);
  return rows[0] ?? null;
}
import type { Domain, Task, TaskStatus, Trip, TripAssignment, Provider, Appointment, PackingArea, PackingBox, PackingItem, CommunityPlace, CommunityVisit } from '../types/entities';

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
  return execAll('SELECT * FROM domains ORDER BY id ASC');
}

export async function createTask(input: NewTaskInput): Promise<Task> {
  const now = new Date().toISOString();
  const sql = `INSERT INTO tasks (
      user_id, domain_id, title, description, status, priority, due_date, origin_doc_id,
      related_property_id, related_job_id, related_provider_id, related_childcare_id, related_trip_id, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
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
    now,
  ];
  return insertAndReturn('tasks', sql, params);
}

export async function getTaskById(id: number): Promise<Task | null> {
  return execGet('SELECT * FROM tasks WHERE id = ?', [id]);
}

export async function getTasksByDomain(domainSlugOrId: string | number): Promise<Task[]> {
  if (typeof domainSlugOrId === 'string') {
    return execAll(`
      SELECT t.* FROM tasks t
      JOIN domains d ON t.domain_id = d.id
      WHERE d.slug = ?
      ORDER BY t.due_date ASC, t.priority DESC, t.created_at ASC
    `, [domainSlugOrId]);
  } else {
    return execAll(`
      SELECT * FROM tasks
      WHERE domain_id = ?
      ORDER BY due_date ASC, priority DESC, created_at ASC
    `, [domainSlugOrId]);
  }
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const now = new Date().toISOString();
  if (!isPostgres) {
    sqliteRun('UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?', [status, now, id]);
    return execGet('SELECT * FROM tasks WHERE id = ?', [id]) as Promise<Task>;
  }
  const rows = await pgQuery<Task[]>(`UPDATE tasks SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *`, [status, now, id]);
  return rows[0];
}

export async function deleteTask(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM tasks WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM tasks WHERE id = $1', [id]);
}

// --- CT6: Trips & Assignments ---

// --- CT7: Properties ---
import type { Property, JobOption, ChildcareOption } from '../types/entities';

export async function listProperties(): Promise<Property[]> {
  return execAll('SELECT * FROM properties ORDER BY created_at DESC');
}

export async function getPropertyById(id: number): Promise<Property | null> {
  return execGet('SELECT * FROM properties WHERE id = ?', [id]);
}

export async function createProperty(input: Omit<Property, "id" | "created_at" | "updated_at">): Promise<Property> {
  const now = new Date().toISOString();
  const sql = `INSERT INTO properties (user_id, address, type, rent_weekly, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [input.user_id ?? 1, input.address, input.type, input.rent_weekly ?? null, input.status ?? null, input.notes ?? null, now, now];
  return insertAndReturn('properties', sql, params);
}

export async function updateProperty(id: number, input: Partial<Property>): Promise<Property | null> {
  const now = new Date().toISOString();
  const editable = ['address', 'type', 'rent_weekly', 'status', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getPropertyById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE properties SET ${setClause} WHERE id = ?`, [...values, id]);
    return getPropertyById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE properties SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<Property[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deleteProperty(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM properties WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM properties WHERE id = $1', [id]);
}

// --- CT7: Job Options ---
export async function listJobOptions(): Promise<JobOption[]> {
  return execAll('SELECT * FROM job_options ORDER BY created_at DESC');
}

export async function getJobOptionById(id: number): Promise<JobOption | null> {
  return execGet('SELECT * FROM job_options WHERE id = ?', [id]);
}

export async function createJobOption(input: Omit<JobOption, "id" | "created_at" | "updated_at">): Promise<JobOption> {
  const now = new Date().toISOString();
  const sql = `INSERT INTO job_options (user_id, employer, role, hours_per_week, pay_rate_hourly, status, pros, cons, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [input.user_id ?? 1, input.employer, input.role ?? null, input.hours_per_week ?? null, input.pay_rate_hourly ?? null, input.status ?? null, input.pros ?? null, input.cons ?? null, input.notes ?? null, now, now];
  return insertAndReturn('job_options', sql, params);
}

export async function updateJobOption(id: number, input: Partial<JobOption>): Promise<JobOption | null> {
  const now = new Date().toISOString();
  const editable = ['employer', 'role', 'hours_per_week', 'pay_rate_hourly', 'status', 'pros', 'cons', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getJobOptionById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE job_options SET ${setClause} WHERE id = ?`, [...values, id]);
    return getJobOptionById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE job_options SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<JobOption[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deleteJobOption(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM job_options WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM job_options WHERE id = $1', [id]);
}

// --- CT7: Childcare Options ---
export async function listChildcareOptions(): Promise<ChildcareOption[]> {
  return execAll('SELECT * FROM childcare_options ORDER BY created_at DESC');
}

export async function getChildcareOptionById(id: number): Promise<ChildcareOption | null> {
  return execGet('SELECT * FROM childcare_options WHERE id = ?', [id]);
}

export async function createChildcareOption(input: Omit<ChildcareOption, "id" | "created_at" | "updated_at">): Promise<ChildcareOption> {
  const now = new Date().toISOString();
  const sql = `INSERT INTO childcare_options (user_id, name, type, location, min_age_months, max_age_months, daily_fee, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [input.user_id ?? 1, input.name, input.type, input.location ?? null, input.min_age_months ?? null, input.max_age_months ?? null, input.daily_fee ?? null, input.status ?? null, input.notes ?? null, now, now];
  return insertAndReturn('childcare_options', sql, params);
}

export async function updateChildcareOption(id: number, input: Partial<ChildcareOption>): Promise<ChildcareOption | null> {
  const now = new Date().toISOString();
  const editable = ['name', 'type', 'location', 'min_age_months', 'max_age_months', 'daily_fee', 'status', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getChildcareOptionById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE childcare_options SET ${setClause} WHERE id = ?`, [...values, id]);
    return getChildcareOptionById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE childcare_options SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<ChildcareOption[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deleteChildcareOption(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM childcare_options WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM childcare_options WHERE id = $1', [id]);
}

// --- CT8: Providers & Appointments ---

export async function listProviders(): Promise<Provider[]> {
  return execAll('SELECT * FROM providers ORDER BY created_at DESC');
}

export async function getProviderById(id: number): Promise<Provider | null> {
  return execGet('SELECT * FROM providers WHERE id = ?', [id]);
}

export async function createProvider(input: Omit<Provider, 'id' | 'created_at' | 'updated_at'>): Promise<Provider> {
  const now = new Date().toISOString();
  const sql = `INSERT INTO providers (user_id, name, type, phone, email, address, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [input.user_id ?? 1, input.name, input.type, input.phone ?? null, input.email ?? null, input.address ?? null, input.notes ?? null, now, now];
  return insertAndReturn('providers', sql, params);
}

export async function updateProvider(id: number, input: Partial<Provider>): Promise<Provider | null> {
  const now = new Date().toISOString();
  const editable = ['name', 'type', 'phone', 'email', 'address', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getProviderById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE providers SET ${setClause} WHERE id = ?`, [...values, id]);
    return getProviderById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE providers SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<Provider[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deleteProvider(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM providers WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM providers WHERE id = $1', [id]);
}

// Appointments
export async function listAppointments(): Promise<Appointment[]> {
  return execAll('SELECT * FROM appointments ORDER BY start_datetime ASC');
}

export async function getAppointmentById(id: number): Promise<Appointment | null> {
  return execGet('SELECT * FROM appointments WHERE id = ?', [id]);
}

export async function createAppointment(input: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
  const now = new Date().toISOString();
  const sql = `INSERT INTO appointments (user_id, provider_id, title, description, location, start_datetime, end_datetime, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [input.user_id ?? 1, input.provider_id ?? null, input.title, input.description ?? null, input.location ?? null, input.start_datetime, input.end_datetime ?? null, input.notes ?? null, now, now];
  return insertAndReturn('appointments', sql, params);
}

export async function updateAppointment(id: number, input: Partial<Appointment>): Promise<Appointment | null> {
  const now = new Date().toISOString();
  const editable = ['provider_id', 'title', 'description', 'location', 'start_datetime', 'end_datetime', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getAppointmentById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE appointments SET ${setClause} WHERE id = ?`, [...values, id]);
    return getAppointmentById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE appointments SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<Appointment[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deleteAppointment(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM appointments WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM appointments WHERE id = $1', [id]);
}
export async function getAllTrips(): Promise<Trip[]> {
  return execAll('SELECT * FROM trips ORDER BY date ASC, created_at ASC');
}

export async function getTripById(id: number): Promise<Trip | null> {
  return execGet('SELECT * FROM trips WHERE id = ?', [id]);
}

export interface NewTripInput {
  user_id: number;
  date: string;
  origin: string;
  destination: string;
  notes?: string;
}

export async function createTrip(input: NewTripInput): Promise<Trip> {
  const now = new Date().toISOString();
  const sql = `INSERT INTO trips (user_id, date, origin, destination, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [input.user_id, input.date, input.origin, input.destination, input.notes ?? null, now, now];
  return insertAndReturn('trips', sql, params);
}

export async function deleteTrip(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM trips WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM trips WHERE id = $1', [id]);
}

export async function getTripAssignments(trip_id: number): Promise<TripAssignment[]> {
  return execAll('SELECT * FROM trip_assignments WHERE trip_id = ? ORDER BY id ASC', [trip_id]);
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
  const now = new Date().toISOString();
  const sql = `INSERT INTO trip_assignments (trip_id, vehicle, driver_name, passengers, cargo_notes, misc_notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [input.trip_id, input.vehicle, input.driver_name, input.passengers ?? null, input.cargo_notes ?? null, input.misc_notes ?? null, now, now];
  return insertAndReturn('trip_assignments', sql, params);
}

export async function deleteTripAssignment(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM trip_assignments WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM trip_assignments WHERE id = $1', [id]);
}

// --- Packing module ---
export async function listPackingAreas(): Promise<PackingArea[]> {
  return execAll('SELECT * FROM packing_areas WHERE user_id = ? ORDER BY name ASC', [1]);
}

export async function getPackingAreaById(id: number): Promise<PackingArea | null> {
  return execGet('SELECT * FROM packing_areas WHERE id = ?', [id]);
}

export async function createPackingArea(input: Omit<PackingArea, 'id' | 'created_at' | 'updated_at'>): Promise<PackingArea> {
  const now = new Date().toISOString();
  const sql = 'INSERT INTO packing_areas (user_id, name, location_description, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
  const params = [input.user_id ?? 1, input.name, input.location_description ?? null, input.notes ?? null, now, now];
  return insertAndReturn('packing_areas', sql, params) as Promise<PackingArea>;
}

export async function updatePackingArea(id: number, input: Partial<PackingArea>): Promise<PackingArea | null> {
  const now = new Date().toISOString();
  const editable = ['name', 'location_description', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getPackingAreaById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE packing_areas SET ${setClause} WHERE id = ?`, [...values, id]);
    return getPackingAreaById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE packing_areas SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<PackingArea[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deletePackingArea(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM packing_areas WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM packing_areas WHERE id = $1', [id]);
}

// Boxes
export async function listPackingBoxesByArea(areaId: number): Promise<PackingBox[]> {
  return execAll('SELECT * FROM packing_boxes WHERE area_id = ? ORDER BY id ASC', [areaId]);
}

export async function getPackingBoxById(id: number): Promise<PackingBox | null> {
  return execGet('SELECT * FROM packing_boxes WHERE id = ?', [id]);
}

export async function createPackingBox(input: Omit<PackingBox, 'id' | 'created_at' | 'updated_at'>): Promise<PackingBox> {
  const now = new Date().toISOString();
  const sql = 'INSERT INTO packing_boxes (area_id, label, box_type, weight_kg, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [input.area_id, input.label, input.box_type ?? null, input.weight_kg ?? null, input.status ?? null, input.notes ?? null, now, now];
  return insertAndReturn('packing_boxes', sql, params) as Promise<PackingBox>;
}

export async function updatePackingBox(id: number, input: Partial<PackingBox>): Promise<PackingBox | null> {
  const now = new Date().toISOString();
  const editable = ['label', 'box_type', 'weight_kg', 'status', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getPackingBoxById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE packing_boxes SET ${setClause} WHERE id = ?`, [...values, id]);
    return getPackingBoxById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE packing_boxes SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<PackingBox[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deletePackingBox(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM packing_boxes WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM packing_boxes WHERE id = $1', [id]);
}

// Items
export async function listPackingItemsByBox(boxId: number): Promise<PackingItem[]> {
  return execAll('SELECT * FROM packing_items WHERE box_id = ? ORDER BY id ASC', [boxId]);
}

export async function createPackingItem(input: Omit<PackingItem, 'id' | 'created_at' | 'updated_at'>): Promise<PackingItem> {
  const now = new Date().toISOString();
  const sql = 'INSERT INTO packing_items (box_id, name, quantity, fragile, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const params = [input.box_id, input.name, input.quantity ?? 1, input.fragile ?? 0, input.notes ?? null, now, now];
  return insertAndReturn('packing_items', sql, params) as Promise<PackingItem>;
}

export async function updatePackingItem(id: number, input: Partial<PackingItem>): Promise<PackingItem | null> {
  const now = new Date().toISOString();
  const editable = ['name', 'quantity', 'fragile', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return execGet('SELECT * FROM packing_items WHERE id = ?', [id]) as Promise<PackingItem | null>;
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE packing_items SET ${setClause} WHERE id = ?`, [...values, id]);
    return execGet('SELECT * FROM packing_items WHERE id = ?', [id]) as Promise<PackingItem | null>;
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE packing_items SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<PackingItem[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deletePackingItem(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM packing_items WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM packing_items WHERE id = $1', [id]);
}

// --- Community module ---
// --- Community module ---
export async function listCommunityPlaces(): Promise<CommunityPlace[]> {
  return execAll('SELECT * FROM community_places WHERE user_id = ? ORDER BY name ASC', [1]);
}

export async function getCommunityPlaceById(id: number): Promise<CommunityPlace | null> {
  return execGet('SELECT * FROM community_places WHERE id = ?', [id]);
}

export async function createCommunityPlace(input: Omit<CommunityPlace, 'id' | 'created_at' | 'updated_at'>): Promise<CommunityPlace> {
  const now = new Date().toISOString();
  const sql = 'INSERT INTO community_places (user_id, name, address, category, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const params = [input.user_id ?? 1, input.name, input.address ?? null, input.category ?? null, input.notes ?? null, now, now];
  return insertAndReturn('community_places', sql, params) as Promise<CommunityPlace>;
}

export async function updateCommunityPlace(id: number, input: Partial<CommunityPlace>): Promise<CommunityPlace | null> {
  const now = new Date().toISOString();
  const editable = ['name', 'address', 'category', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getCommunityPlaceById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE community_places SET ${setClause} WHERE id = ?`, [...values, id]);
    return getCommunityPlaceById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE community_places SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<CommunityPlace[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deleteCommunityPlace(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM community_places WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM community_places WHERE id = $1', [id]);
}

export async function listCommunityVisitsByPlace(placeId: number): Promise<CommunityVisit[]> {
  return execAll('SELECT * FROM community_visits WHERE place_id = ? ORDER BY visited_at DESC', [placeId]);
}

export async function createCommunityVisit(input: { place_id: number; visited_at: string; notes?: string | null }): Promise<CommunityVisit> {
  const now = new Date().toISOString();
  const sql = 'INSERT INTO community_visits (place_id, visited_at, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
  const params = [input.place_id, input.visited_at, input.notes ?? null, now, now];
  return insertAndReturn('community_visits', sql, params) as Promise<CommunityVisit>;
}

export async function deleteCommunityVisit(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM community_visits WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM community_visits WHERE id = $1', [id]);
}

// --- CT9: Next Actions / What Next engine ---
// Return top pending tasks ordered by priority, due date and creation date
export async function listPendingTasks(limit: number = 3): Promise<Array<Task & { domain_slug?: string }>> {
  return execAll(
    `
    SELECT t.*, d.slug as domain_slug
    FROM tasks t
    JOIN domains d ON t.domain_id = d.id
    WHERE t.status = 'pending'
    ORDER BY t.priority DESC, (t.due_date IS NULL), t.due_date ASC, t.created_at ASC
    LIMIT ?
  `,
    [limit]
  ) as Promise<Array<Task & { domain_slug?: string }>>;
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
  return execAll('SELECT * FROM work_links WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

export async function getWorkLinkById(id: number): Promise<any | null> {
  return execGet('SELECT * FROM work_links WHERE id = ?', [id]);
}

export async function createWorkLink(input: WorkLinkInput): Promise<any> {
  const now = new Date().toISOString();
  const sql = `
    INSERT INTO work_links (user_id, title, url, description, category, icon_emoji, related_task_id, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    input.user_id,
    input.title,
    input.url,
    input.description ?? null,
    input.category ?? null,
    input.icon_emoji ?? null,
    input.related_task_id ?? null,
    input.notes ?? null,
    now,
    now,
  ];
  return insertAndReturn('work_links', sql, params);
}

export async function updateWorkLink(id: number, input: Partial<WorkLinkInput>): Promise<any | null> {
  const now = new Date().toISOString();
  const editable = ['title', 'url', 'description', 'category', 'icon_emoji', 'related_task_id', 'notes'] as const;
  const updates = editable.filter(f => input[f as keyof typeof input] !== undefined);
  if (updates.length === 0) return getWorkLinkById(id);
  const values = updates.map(f => input[f as keyof typeof input]);
  values.push(now);
  if (!isPostgres) {
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    sqliteRun(`UPDATE work_links SET ${setClause} WHERE id = ?`, [...values, id]);
    return getWorkLinkById(id);
  }
  const setClausePg = updates.map((f, i) => `"${String(f)}" = $${i + 1}`).join(', ') + `, updated_at = $${updates.length + 1}`;
  const params = values.concat([id]);
  const sql = `UPDATE work_links SET ${setClausePg} WHERE id = $${params.length} RETURNING *`;
  const rows = await pgQuery<any[]>(sql, params as any[]);
  return rows[0] ?? null;
}

export async function deleteWorkLink(id: number): Promise<void> {
  if (!isPostgres) sqliteRun('DELETE FROM work_links WHERE id = ?', [id]);
  else await pgQuery('DELETE FROM work_links WHERE id = $1', [id]);
}

