import * as React from 'react';
const { useState } = React;

interface DocumentUploadFormProps {
  onUpload: (file: File, title?: string) => void;
}

export function DocumentUploadForm({ onUpload }: DocumentUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (file) onUpload(file, title);
  }

  return (
    <form className="doc-upload-form" onSubmit={handleSubmit}>
      <label>
        Title (optional)
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </label>
      <label>
        File
        <input type="file" accept=".pdf,.docx,.txt" onChange={e => setFile(e.target.files?.[0] || null)} required />
      </label>
      <button type="submit" disabled={!file}>Upload</button>
    </form>
  );
}
