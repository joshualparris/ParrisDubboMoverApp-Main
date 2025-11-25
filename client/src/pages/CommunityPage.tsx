import React, { useEffect, useState } from 'react';
import { fetchPlaces, fetchVisits, logVisit } from '../api/community';

export default function CommunityPage() {
  const [places, setPlaces] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);

  useEffect(() => { loadPlaces(); }, []);

  async function loadPlaces() {
    const res = await fetchPlaces();
    setPlaces(res || []);
  }

  async function openPlace(id: number) {
    setSelectedPlace(id);
    const res = await fetchVisits(id);
    setVisits(res || []);
  }

  async function recordVisit() {
    if (!selectedPlace) return;
    await logVisit(selectedPlace, { visited_at: new Date().toISOString(), notes: 'Visited via app' });
    const res = await fetchVisits(selectedPlace);
    setVisits(res || []);
  }

  return (
    <div>
      <h2>Community</h2>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ minWidth: 280 }}>
          <h3>Places</h3>
          <ul>
            {places.map(p => (<li key={p.id} onClick={() => openPlace(p.id)} style={{ cursor: 'pointer' }}>{p.name}</li>))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Visits</h3>
          {selectedPlace ? (
            <div>
              <button onClick={recordVisit}>Log Visit</button>
              <ul>
                {visits.map(v => (<li key={v.id}>{v.visited_at} - {v.notes}</li>))}
              </ul>
            </div>
          ) : <p>Select a place</p>}
        </div>
      </div>
    </div>
  );
}
