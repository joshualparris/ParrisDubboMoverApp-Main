import * as React from 'react';
const { useEffect, useState } = React;
import { fetchWorkLinks, createWorkLink, updateWorkLink, deleteWorkLink } from '../api/workLinks';
import type { WorkLink } from '../types/api';
import { WorkLinksTable } from '../components/WorkLinksTable';
import { WorkLinkFormModal } from '../components/WorkLinkFormModal';

export const DcsWorkPage: React.FC = () => {
  const [links, setLinks] = useState<WorkLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editLink, setEditLink] = useState<WorkLink | null>(null);

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    setLoading(true);
    const data = await fetchWorkLinks(1);
    setLinks(data);
    setLoading(false);
  }

  function handleAdd() {
    setEditLink(null);
    setShowModal(true);
  }

  function handleEdit(link: WorkLink) {
    setEditLink(link);
    setShowModal(true);
  }

  async function handleSubmit(link: Partial<WorkLink>) {
    if (editLink) {
      await updateWorkLink(editLink.id, link);
    } else {
      await createWorkLink(link);
    }
    setShowModal(false);
    await loadLinks();
  }

  async function handleDelete(id: number) {
    await deleteWorkLink(id);
    await loadLinks();
  }

  return (
    <div className="dcs-page" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2>DCS Work Hub</h2>
      <p className="dcs-subtitle">Quick links, onboarding tasks, and key docs for Dubbo Christian School.</p>
      <button onClick={handleAdd} style={{ marginBottom: 16 }}>Add Work Link</button>
      <WorkLinksTable
        links={links}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {showModal && (
        <WorkLinkFormModal
          link={editLink}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
