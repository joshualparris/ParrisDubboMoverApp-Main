import React, { useEffect, useState } from 'react';
import type { Property } from '../types/api';
import { fetchProperties, createProperty, updateProperty, deleteProperty } from '../api/properties';

export const PropertiesPage: React.FC = () => {
  const [propsList, setPropsList] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProperties();
      setPropsList(data);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    const address = prompt('Address') || '';
    const type = prompt('Type (bendigo_home, dubbo_rental_candidate, dubbo_rental_confirmed)') || '';
    if (!address || !type) return;
    const created = await createProperty({ address, type, status: 'interested' as any });
    setPropsList(prev => [created, ...prev]);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete property?')) return;
    await deleteProperty(id);
    setPropsList(prev => prev.filter(p => p.id !== id));
  }

  async function handleToggleStatus(p: Property) {
    const newStatus = p.status === 'interested' ? 'applied' : p.status === 'applied' ? 'secured' : 'interested';
    const updated = await updateProperty(p.id, { status: newStatus } as any);
    setPropsList(prev => prev.map(x => x.id === p.id ? updated : x));
  }

  return (
    <div>
      <h2>Properties</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleAdd}>Add Property</button>
        <button onClick={load} style={{ marginLeft: 8 }}>Reload</button>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Address</th>
            <th>Type</th>
            <th>Status</th>
            <th>Rent</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {propsList.map(p => (
            <tr key={p.id}>
              <td>{p.address}</td>
              <td>{p.type}</td>
              <td>{p.status}</td>
              <td>{p.rent_weekly ?? ''}</td>
              <td>
                <button onClick={() => handleToggleStatus(p)}>Toggle Status</button>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesPage;
