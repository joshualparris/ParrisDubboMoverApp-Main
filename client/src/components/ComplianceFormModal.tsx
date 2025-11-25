import * as React from 'react';
const { useEffect, useState } = React;
import type { ComplianceItem } from '../types/api';

interface ComplianceFormModalProps {
  open: boolean;
  initial?: ComplianceItem;
  onClose: () => void;
  onSubmit: (payload: any) => void;
}

const defaultState = {
  subject_type: '',
  subject_name: '',
  category: '',
  label: '',
  status: 'pending',
  due_date: '',
  completed_date: '',
  notes: '',
};

export const ComplianceFormModal: React.FC<ComplianceFormModalProps> = ({ open, initial, onClose, onSubmit }) => {
  const [form, setForm] = useState<any>(defaultState);

  useEffect(() => {
    if (initial) {
      setForm({ ...defaultState, ...initial });
    } else {
      setForm(defaultState);
    }
  }, [initial]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <form className="compliance-form" onSubmit={handleSubmit}>
          <h2>{initial ? 'Edit Compliance Item' : 'Add Compliance Item'}</h2>
          <label>
            Subject Type
            <input name="subject_type" value={form.subject_type} onChange={handleChange} required />
          </label>
          <label>
            Subject Name
            <input name="subject_name" value={form.subject_name} onChange={handleChange} required />
          </label>
          <label>
            Category
            <input name="category" value={form.category} onChange={handleChange} required />
          </label>
          <label>
            Label
            <input name="label" value={form.label} onChange={handleChange} required />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange} required>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="overdue">Overdue</option>
            </select>
          </label>
          <label>
            Due Date
            <input name="due_date" type="date" value={form.due_date ? form.due_date.slice(0, 10) : ''} onChange={handleChange} />
          </label>
          <label>
            Completed Date
            <input name="completed_date" type="date" value={form.completed_date ? form.completed_date.slice(0, 10) : ''} onChange={handleChange} />
          </label>
          <label>
            Notes
            <textarea name="notes" value={form.notes} onChange={handleChange} />
          </label>
          <div className="modal-actions">
            <button type="submit">{initial ? 'Update' : 'Create'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
