import * as React from 'react';
import type { Task } from '../types/api';

interface TaskImportExportProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export default function TaskImportExport({ tasks, onImport }: TaskImportExportProps) {
  function handleExport() {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string);
        if (Array.isArray(imported)) {
          onImport(imported);
        } else {
          alert('Invalid file format');
        }
      } catch {
        alert('Failed to parse file');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ margin: '16px 0' }}>
      <button onClick={handleExport}>Export Tasks</button>
      <label style={{ marginLeft: 16 }}>
        Import Tasks
        <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
      </label>
    </div>
  );
}
