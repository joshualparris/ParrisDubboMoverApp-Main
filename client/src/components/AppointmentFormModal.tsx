import * as React from 'react';
const { useState, useEffect } = React;
import type { Appointment } from '../types/api';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: Partial<Appointment>;
  onCancel: () => void;
  onSubmit: (data: Partial<Appointment>) => void;
}

export default function AppointmentFormModal({ open, mode, initial, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<Appointment>>(initial || {});

  useEffect(() => setForm(initial || {}), [initial, open]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: 16, width: 600, maxWidth: '95%' }}>
        <h3>{mode === 'create' ? 'Add Appointment' : 'Edit Appointment'}</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <input placeholder="Provider ID (optional)" value={form.provider_id ?? ''} onChange={e => setForm(f => ({ ...f, provider_id: e.target.value ? Number(e.target.value) : null }))} />
          <input placeholder="Start datetime (ISO)" value={form.start_datetime ?? ''} onChange={e => setForm(f => ({ ...f, start_datetime: e.target.value }))} />
          <input placeholder="End datetime (ISO)" value={form.end_datetime ?? ''} onChange={e => setForm(f => ({ ...f, end_datetime: e.target.value }))} />
          <input placeholder="Location" value={form.location ?? ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <textarea placeholder="Description / Notes" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={onCancel}>Cancel</button>
            <button onClick={() => onSubmit(form)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
