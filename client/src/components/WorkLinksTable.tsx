import * as React from 'react';
import type { WorkLink } from '../types/api';

interface WorkLinksTableProps {
  links: WorkLink[];
  loading: boolean;
  onEdit: (link: WorkLink) => void;
  onDelete: (id: number) => void;
}

export const WorkLinksTable: React.FC<WorkLinksTableProps> = ({ links, loading, onEdit, onDelete }) => (
  <table className="work-links-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th>Title</th>
        <th>URL</th>
        <th>Category</th>
        <th>Icon</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr><td colSpan={5}>Loading...</td></tr>
      ) : links.length === 0 ? (
        <tr><td colSpan={5}>No work links yet.</td></tr>
      ) : (
        links.map(link => (
          <tr key={link.id}>
            <td>{link.title}</td>
            <td><a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></td>
            <td>{link.category || ''}</td>
            <td>{link.icon_emoji || ''}</td>
            <td>
              <button onClick={() => onEdit(link)}>Edit</button>
              <button onClick={() => onDelete(link.id)} style={{ marginLeft: 8 }}>Delete</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);
