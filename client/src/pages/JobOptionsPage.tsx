import React, { useEffect, useState } from 'react';
import type { JobOption } from '../types/api';
import { fetchJobOptions, createJobOption, updateJobOption, deleteJobOption } from '../api/jobOptions';

export const JobOptionsPage: React.FC = () => {
  const [items, setItems] = useState<JobOption[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchJobOptions();
      setItems(data);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    const employer = prompt('Employer name') || '';
    if (!employer) return;
    const created = await createJobOption({ employer });
    setItems(prev => [created, ...prev]);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete job option?')) return;
    await deleteJobOption(id);
    setItems(prev => prev.filter(p => p.id !== id));
  }

  return (
    <div>
      <h2>Kristy — Job Options</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleAdd}>Add Job Option</button>
        <button onClick={load} style={{ marginLeft: 8 }}>Reload</button>
      </div>
      {loading && <div>Loading…</div>}
      <ul>
        {items.map(i => (
          <li key={i.id}>
            <strong>{i.employer}</strong> — {i.role ?? ''} — {i.status ?? ''}
            <button onClick={() => handleDelete(i.id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobOptionsPage;
