import * as React from 'react';
import type { Document } from '../types/documents';

interface DocumentListProps {
  documents: Document[];
  onSelect: (doc: Document) => void;
}

export function DocumentList({ documents, onSelect }: DocumentListProps) {
  return (
    <div className="doc-list">
      <h3>Documents</h3>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            <button onClick={() => onSelect(doc)}>{doc.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
