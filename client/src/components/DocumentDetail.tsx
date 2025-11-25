import * as React from 'react';
import type { Document } from '../types/documents';

interface DocumentDetailProps {
  document: Document | null;
  onClose: () => void;
}

export function DocumentDetail({ document, onClose }: DocumentDetailProps) {
  if (!document) return null;
  return (
    <div className="doc-detail-modal">
      <div className="doc-detail">
        <h3>{document.title}</h3>
        <p><strong>Filename:</strong> {document.original_filename}</p>
        {document.source_path && (
          <p>
            <a href={`/api/documents/download/${document.source_path.split(/[/\\]/).pop()}`} target="_blank" rel="noopener noreferrer">
              Download original file
            </a>
          </p>
        )}
        <p><strong>Uploaded:</strong> {new Date(document.uploaded_at).toLocaleString()}</p>
        <p><strong>Preview:</strong></p>
        <pre style={{ maxHeight: 200, overflow: 'auto', background: '#f7f7f7', padding: 8 }}>
          {document.content_text?.slice(0, 1000) || '(No text extracted)'}
        </pre>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
