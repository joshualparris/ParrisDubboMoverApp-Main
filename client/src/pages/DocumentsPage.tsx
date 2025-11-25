import * as React from 'react';
const { useEffect, useState } = React;
import { listDocuments, uploadDocument, getDocument } from '../api/documents';
import { DocumentUploadForm } from '../components/DocumentUploadForm';
import { DocumentList } from '../components/DocumentList';
import { DocumentDetail } from '../components/DocumentDetail';
import type { Document } from '../types/documents';

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    listDocuments()
      .then(setDocuments)
      .catch(() => setError('Failed to load documents'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleUpload(file: File, title?: string) {
    setLoading(true);
    uploadDocument(file, title)
      .then(() => refresh())
      .catch(() => setError('Upload failed'))
      .finally(() => setLoading(false));
  }

  function handleSelect(doc: Document) {
    getDocument(doc.id)
      .then(setSelectedDoc)
      .catch(() => setError('Failed to load document details'));
  }

  function handleCloseDetail() {
    setSelectedDoc(null);
  }

  return (
    <div className="documents-page">
      <h2>Documents</h2>
      <DocumentUploadForm onUpload={handleUpload} />
      {loading ? <div>Loading...</div> : (
        <DocumentList documents={documents} onSelect={handleSelect} />
      )}
      {selectedDoc && (
        <DocumentDetail document={selectedDoc} onClose={handleCloseDetail} />
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
