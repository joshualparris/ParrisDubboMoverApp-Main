import * as React from 'react';
const { useState, useEffect } = React;
import type { Provider } from '../types/api';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: Partial<Provider>;
  onCancel: () => void;
  onSubmit: (data: Partial<Provider>) => void;
}

export default function ProviderFormModal({ open, mode, initial, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<Provider>>(initial || {});

  useEffect(() => setForm(initial || {}), [initial, open]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: 16, width: 600, maxWidth: '95%' }}>
        <h3>{mode === 'create' ? 'Add Provider' : 'Edit Provider'}</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Name" value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input placeholder="Type (neurologist, gp, ot...)" value={form.type ?? ''} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
          <input placeholder="Phone" value={form.phone ?? ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <input placeholder="Email" value={form.email ?? ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <input placeholder="Address" value={form.address ?? ''} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          <textarea placeholder="Notes" value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={onCancel}>Cancel</button>
            <button onClick={() => onSubmit(form)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
