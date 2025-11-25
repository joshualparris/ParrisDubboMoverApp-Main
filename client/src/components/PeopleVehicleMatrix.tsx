import * as React from 'react';
const { useEffect, useState } = React;
import { listTripAssignments, createTripAssignment, deleteTripAssignment } from '../api/trips';
import type { TripAssignment } from '../types/trips';

interface Props {
  tripId: number;
}

export function PeopleVehicleMatrix({ tripId }: Props) {
  const [assignments, setAssignments] = useState<TripAssignment[]>([]);
  const [form, setForm] = useState({ vehicle: '', driver_name: '', passengers: '', cargo_notes: '', misc_notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    listTripAssignments(tripId)
      .then(setAssignments)
      .catch(() => setError('Failed to load assignments'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, [tripId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    createTripAssignment(tripId, form)
      .then(() => { setForm({ vehicle: '', driver_name: '', passengers: '', cargo_notes: '', misc_notes: '' }); refresh(); })
      .catch(() => setError('Failed to create assignment'))
      .finally(() => setLoading(false));
  }

  function handleDelete(id: number) {
    setLoading(true);
    deleteTripAssignment(id)
      .then(refresh)
      .catch(() => setError('Failed to delete assignment'))
      .finally(() => setLoading(false));
  }

  return (
    <div className="matrix">
      <h3>People/Vehicle Matrix</h3>
      <form onSubmit={handleSubmit} className="matrix-form">
        <input name="vehicle" placeholder="Vehicle" value={form.vehicle} onChange={handleChange} required />
        <input name="driver_name" placeholder="Driver" value={form.driver_name} onChange={handleChange} required />
        <input name="passengers" placeholder="Passengers" value={form.passengers} onChange={handleChange} />
        <input name="cargo_notes" placeholder="Cargo Notes" value={form.cargo_notes} onChange={handleChange} />
        <input name="misc_notes" placeholder="Misc Notes" value={form.misc_notes} onChange={handleChange} />
        <button type="submit">Add Assignment</button>
      </form>
      {loading ? <div>Loading...</div> : (
        <ul className="assignment-list">
          {assignments.map(a => (
            <li key={a.id}>
              <strong>{a.vehicle}</strong> - {a.driver_name}
              {a.passengers && <span> | Passengers: {a.passengers}</span>}
              {a.cargo_notes && <span> | Cargo: {a.cargo_notes}</span>}
              {a.misc_notes && <span> | Notes: {a.misc_notes}</span>}
              <button onClick={() => handleDelete(a.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
