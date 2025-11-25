import * as React from 'react';
const { useEffect, useState } = React;
import { listTrips } from '../api/trips';
import type { Trip } from '../types/trips';

export function TimelinePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listTrips()
      .then(setTrips)
      .catch(() => setError('Failed to load trips'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="timeline-page">
      <h2>Trip Timeline</h2>
      {loading ? <div>Loading...</div> : (
        <ul className="timeline-list">
          {trips.map(trip => (
            <li key={trip.id}>
              <strong>{trip.date}</strong>: {trip.origin} → {trip.destination}
              {trip.notes && <span> ({trip.notes})</span>}
            </li>
          ))}
        </ul>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
