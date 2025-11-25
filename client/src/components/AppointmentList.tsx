import * as React from 'react';
import type { Appointment } from '../types/api';

interface Props {
  appointments: Appointment[];
  onEdit: (a: Appointment) => void;
  onDelete: (id: number) => void;
}

export default function AppointmentList({ appointments, onEdit, onDelete }: Props) {
  return (
    <div className="appointment-list">
      <h3>Appointments</h3>
      <ul>
        {appointments.map(a => (
          <li key={a.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <strong>{a.title}</strong>
              <div style={{ fontSize: 12, color: '#555' }}>{a.start_datetime} {a.location ? `· ${a.location}` : ''}</div>
              <div style={{ fontSize: 12, color: '#333' }}>{a.description ?? ''}</div>
            </div>
            <div>
              <button onClick={() => onEdit(a)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => onDelete(a.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
