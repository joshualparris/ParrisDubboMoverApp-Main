import * as React from 'react';
const { useState, useEffect } = React;
import type { Task } from '../types/api';

interface TaskFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialTask?: Task;
  domain: { id: number; name: string } | null;
  onCancel: () => void;
  onSubmit: (data: { title: string; description: string; priority: number; due_date: string | null; }) => void;
}

export function TaskFormModal({ open, mode, initialTask, domain, onCancel, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState(initialTask?.priority || 2);
  const [dueDate, setDueDate] = useState(initialTask?.due_date || '');

  useEffect(() => {
    if (open) {
      setTitle(initialTask?.title || '');
      setDescription(initialTask?.description || '');
      setPriority(initialTask?.priority || 2);
      setDueDate(initialTask?.due_date || '');
    }
  }, [open, initialTask]);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{mode === 'create' ? 'Create Task' : 'Edit Task'} {domain ? `in ${domain.name}` : ''}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({ title, description, priority, due_date: dueDate || null });
          }}
        >
          <label>
            Title
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
          </label>
          <label>
            Priority
            <select value={priority} onChange={e => setPriority(Number(e.target.value))}>
              <option value={1}>Low</option>
              <option value={2}>Normal</option>
              <option value={3}>High</option>
            </select>
          </label>
          <label>
            Due Date
            <input type="date" value={dueDate || ''} onChange={e => setDueDate(e.target.value)} />
          </label>
          <div className="modal-actions">
            <button type="submit">{mode === 'create' ? 'Create' : 'Save'}</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
