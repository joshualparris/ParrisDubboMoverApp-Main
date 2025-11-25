import React, { useEffect, useState } from 'react';
import { fetchPackingAreas, fetchBoxesForArea, fetchItemsForBox, createArea, createBox, createItem } from '../api/packing';

export default function PackingPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [boxes, setBoxes] = useState<any[]>([]);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => { loadAreas(); }, []);

  async function loadAreas() {
    const res = await fetchPackingAreas();
    setAreas(res || []);
  }

  async function openArea(id: number) {
    setSelectedArea(id);
    const res = await fetchBoxesForArea(id);
    setBoxes(res || []);
    setSelectedBox(null);
    setItems([]);
  }

  async function openBox(id: number) {
    setSelectedBox(id);
    const res = await fetchItemsForBox(id);
    setItems(res || []);
  }

  return (
    <div>
      <h2>Packing</h2>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ minWidth: 240 }}>
          <h3>Areas</h3>
          <ul>
            {areas.map(a => (
              <li key={a.id} onClick={() => openArea(a.id)} style={{ cursor: 'pointer' }}>{a.name}</li>
            ))}
          </ul>
        </div>
        <div style={{ minWidth: 320 }}>
          <h3>Boxes</h3>
          {selectedArea ? (
            <ul>
              {boxes.map(b => (
                <li key={b.id} onClick={() => openBox(b.id)} style={{ cursor: 'pointer' }}>{b.label}</li>
              ))}
            </ul>
          ) : <p>Select an area</p>}
        </div>
        <div style={{ flex: 1 }}>
          <h3>Items</h3>
          {selectedBox ? (
            <ul>
              {items.map(i => (<li key={i.id}>{i.name} x{i.quantity}</li>))}
            </ul>
          ) : <p>Select a box</p>}
        </div>
      </div>
    </div>
  );
}
