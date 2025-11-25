import React, { useEffect, useState } from 'react';
import type { ChildcareOption } from '../types/api';
import { fetchChildcareOptions, createChildcareOption, deleteChildcareOption } from '../api/childcareOptions';

export const ChildcareOptionsPage: React.FC = () => {
  const [items, setItems] = useState<ChildcareOption[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchChildcareOptions();
      setItems(data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    const name = prompt('Childcare name') || '';
    const type = prompt('Type (daycare/preschool)') || '';
    if (!name || !type) return;
    const created = await createChildcareOption({ name, type });
    setItems(prev => [created, ...prev]);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete childcare option?')) return;
    await deleteChildcareOption(id);
    setItems(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div>
      <h2>Childcare & Schooling — Options</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleAdd}>Add Childcare</button>
        <button onClick={load} style={{ marginLeft: 8 }}>Reload</button>
      </div>
      {loading && <div>Loading…</div>}
      <ul>
        {items.map(i => (
          <li key={i.id}>
            <strong>{i.name}</strong> — {i.type} — {i.status ?? ''}
            <button onClick={() => handleDelete(i.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChildcareOptionsPage;
