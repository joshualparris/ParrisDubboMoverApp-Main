import * as React from 'react';
const { useEffect, useState } = React;
import { listTrips, createTrip, deleteTrip } from '../api/trips';
import type { Trip } from '../types/trips';

export function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ date: '', origin: '', destination: '', notes: '' });

  function refresh() {
    setLoading(true);
    listTrips()
      .then(setTrips)
      .catch(() => setError('Failed to load trips'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    createTrip({ ...form, user_id: 1 })
      .then(() => { setForm({ date: '', origin: '', destination: '', notes: '' }); refresh(); })
      .catch(() => setError('Failed to create trip'))
      .finally(() => setLoading(false));
  }

  function handleDelete(id: number) {
    setLoading(true);
    deleteTrip(id)
      .then(refresh)
      .catch(() => setError('Failed to delete trip'))
      .finally(() => setLoading(false));
  }

  return (
    <div className="trips-page">
      <h2>Trips</h2>
      <form onSubmit={handleSubmit} className="trip-form">
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="origin" placeholder="Origin" value={form.origin} onChange={handleChange} required />
        <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required />
        <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        <button type="submit">Add Trip</button>
      </form>
      {loading ? <div>Loading...</div> : (
        <ul className="trip-list">
          {trips.map(trip => (
            <li key={trip.id}>
              <strong>{trip.date}</strong>: {trip.origin} → {trip.destination}
              {trip.notes && <span> ({trip.notes})</span>}
              <button onClick={() => handleDelete(trip.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
