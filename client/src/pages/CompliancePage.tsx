import * as React from 'react';
const { useEffect, useMemo, useState } = React;
import type { ComplianceItem, Task } from '../types/api';
import {
  fetchComplianceItems,
  createComplianceItem,
  updateComplianceItem,
  deleteComplianceItem,
} from '../api/complianceItems';
import { fetchTasks, updateTask } from '../api/tasks';
import { ComplianceTable } from '../components/ComplianceTable';
import { ComplianceFormModal } from '../components/ComplianceFormModal';
import { DomainTaskSnippet } from '../components/DomainTaskSnippet';

export const CompliancePage: React.FC = () => {
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ComplianceItem | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchComplianceItems({ activeOnly: false }),
      // Use domainId or fetch all tasks, filter as needed
      fetchTasks(),
    ])
      .then(([compliance, tasks]) => {
        setItems(compliance);
        setTasks(tasks);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || 'Failed to load compliance data');
        setLoading(false);
      });
  }, []);

  const handleCreate = async (payload: Parameters<typeof createComplianceItem>[0]) => {
    const item = await createComplianceItem(payload);
    setItems((prev) => [...prev, item]);
    setShowModal(false);
  };

  const handleEdit = (item: ComplianceItem) => setEditing(item);
  const handleUpdate = async (id: number, payload: Parameters<typeof updateComplianceItem>[1]) => {
    const updated = await updateComplianceItem(id, payload);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    setEditing(null);
  };
  const handleDelete = async (item: ComplianceItem) => {
    await deleteComplianceItem(item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="compliance-page">
      <h1>Compliance Hub</h1>
      <div className="compliance-subtitle">
        Track licences, rego, WWCC, and other compliance items for the move.
      </div>
      <div className="compliance-layout">
        <div className="compliance-table-wrapper">
          <div className="compliance-section-header">
            <span>Compliance Items</span>
            <button onClick={() => setShowModal(true)}>Add Item</button>
          </div>
          <ComplianceTable
            items={items}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="compliance-sidebar">
          <div className="compliance-tasks-help">
            <h3>Related Tasks</h3>
            {tasks.length === 0 ? (
              <div>No related tasks.</div>
            ) : (
              tasks.map((task) => (
                <DomainTaskSnippet
                  key={task.id}
                  task={task}
                  onToggleStatus={async (id: number, status: Task['status']) => {
                    const updated = await updateTask(id, { status });
                    setTasks((prev) =>
                      prev.map((t) => (t.id === id ? updated : t))
                    );
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <ComplianceFormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
      {editing && (
        <ComplianceFormModal
          open={!!editing}
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={(payload: Parameters<typeof updateComplianceItem>[1]) => handleUpdate(editing.id, payload)}
        />
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};
