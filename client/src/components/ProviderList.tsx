import * as React from 'react';
import type { Provider } from '../types/api';

interface Props {
  providers: Provider[];
  onEdit: (p: Provider) => void;
  onDelete: (id: number) => void;
}

export default function ProviderList({ providers, onEdit, onDelete }: Props) {
  return (
    <div className="provider-list">
      <h3>Providers</h3>
      <ul>
        {providers.map(p => (
          <li key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <strong>{p.name}</strong> • <span>{p.type}</span>
              <div style={{ fontSize: 12, color: '#555' }}>{p.phone || ''} {p.email ? `· ${p.email}` : ''}</div>
            </div>
            <div>
              <button onClick={() => onEdit(p)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => onDelete(p.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
