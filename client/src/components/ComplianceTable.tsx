import * as React from 'react';
import type { ComplianceItem } from '../types/api';

interface ComplianceTableProps {
  items: ComplianceItem[];
  loading?: boolean;
  onEdit: (item: ComplianceItem) => void;
  onDelete: (item: ComplianceItem) => void;
}

function statusLabel(status: string): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'done': return 'Done';
    case 'overdue': return 'Overdue';
    default: return status;
  }
}

function isExpiringSoon(item: ComplianceItem, days = 60): boolean {
  if (!item.due_date || item.status === 'done') return false;
  const due = new Date(item.due_date).getTime();
  const now = Date.now();
  const soon = now + days * 24 * 60 * 60 * 1000;
  return due > now && due < soon;
}

function isOverdue(item: ComplianceItem): boolean {
  if (!item.due_date || item.status === 'done') return false;
  return new Date(item.due_date).getTime() < Date.now();
}

export const ComplianceTable: React.FC<ComplianceTableProps> = ({ items, loading, onEdit, onDelete }) => {
  if (loading) return <div>Loading...</div>;
  if (!items.length) return <div>No compliance items found.</div>;
  return (
    <table className="compliance-table">
      <thead>
        <tr>
          <th>Label</th>
          <th>Subject</th>
          <th>Category</th>
          <th>Status</th>
          <th>Due</th>
          <th>Notes</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr
            key={item.id}
            className={
              isOverdue(item)
                ? 'compliance-row-overdue'
                : isExpiringSoon(item)
                ? 'compliance-row-soon'
                : ''
            }
          >
            <td>{item.label}</td>
            <td>{item.subject_name}</td>
            <td>{item.category}</td>
            <td>{statusLabel(item.status)}</td>
            <td>{item.due_date ? item.due_date.slice(0, 10) : ''}</td>
            <td>{item.notes}</td>
            <td>
              <button onClick={() => onEdit(item)}>Edit</button>
              <button onClick={() => onDelete(item)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
