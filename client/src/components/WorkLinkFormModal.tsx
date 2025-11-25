import * as React from 'react';
const { useState } = React;
import type { WorkLink } from '../types/api';

interface WorkLinkFormModalProps {
  link: WorkLink | null;
  onSubmit: (data: Partial<WorkLink>) => void;
  onClose: () => void;
}

export const WorkLinkFormModal: React.FC<WorkLinkFormModalProps> = ({ link, onSubmit, onClose }) => {
  const [title, setTitle] = useState(link?.title || '');
  const [url, setUrl] = useState(link?.url || '');
  const [category, setCategory] = useState(link?.category || '');
  const [icon_emoji, setIconEmoji] = useState(link?.icon_emoji || '');
  const [description, setDescription] = useState(link?.description || '');
  const [notes, setNotes] = useState(link?.notes || '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, url, category, icon_emoji, description, notes });
  }

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#0008', zIndex: 1000 }}>
      <div className="modal" style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 400, margin: '80px auto', position: 'relative' }}>
        <h3>{link ? 'Edit Work Link' : 'Add Work Link'}</h3>
        <form className="work-link-form" onSubmit={handleSubmit}>
          <label>Title<br /><input value={title} onChange={e => setTitle(e.target.value)} required /></label>
          <label>URL<br /><input value={url} onChange={e => setUrl(e.target.value)} required /></label>
          <label>Category<br /><input value={category} onChange={e => setCategory(e.target.value)} /></label>
          <label>Icon Emoji<br /><input value={icon_emoji} onChange={e => setIconEmoji(e.target.value)} /></label>
          <label>Description<br /><textarea value={description} onChange={e => setDescription(e.target.value)} /></label>
          <label>Notes<br /><textarea value={notes} onChange={e => setNotes(e.target.value)} /></label>
          <div className="modal-actions" style={{ marginTop: 16 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
