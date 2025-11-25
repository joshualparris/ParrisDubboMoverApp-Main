import * as React from 'react';
const { useEffect, useState } = React;
import { fetchDomains } from '../api/domains';
import { fetchTasks, createTask, updateTask, deleteTask, fetchTaskExplanation } from '../api/tasks';
import { DomainList } from '../components/DomainList';
import { TaskList } from '../components/TaskList';
import TaskImportExport from '../components/TaskImportExport';
import { TaskFormModal } from '../components/TaskFormModal';
import type { Domain, Task, TaskExplanation } from '../types/api';

export function TasksPage() {
  const [explanation, setExplanation] = useState<TaskExplanation | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  function handleShowExplanation(task: Task) {
    setExplanationLoading(true);
    fetchTaskExplanation(task.id)
      .then(setExplanation)
      .catch(() => setExplanation({ task_id: task.id, explanation: 'Failed to load explanation.' }))
      .finally(() => setExplanationLoading(false));
  }
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    setLoadingDomains(true);
    fetchDomains()
      .then(setDomains)
      .catch(() => setError('Failed to load domains'))
      .finally(() => setLoadingDomains(false));
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      setLoadingTasks(true);
      fetchTasks({ domainId: selectedDomain.id })
        .then(setTasks)
        .catch(() => setError('Failed to load tasks'))
        .finally(() => setLoadingTasks(false));
    } else {
      setTasks([]);
    }
  }, [selectedDomain]);

  function handleSelectDomain(domain: Domain) {
    setSelectedDomain(domain);
    setError(null);
  }

  function handleCreateTask(data: { title: string; description: string; priority: number; due_date: string | null; }) {
    if (!selectedDomain) return;
    createTask({ ...data, domain_id: selectedDomain.id })
      .then(() => {
        setIsFormOpen(false);
        setFormMode('create');
        setEditingTask(null);
        fetchTasks({ domainId: selectedDomain.id }).then(setTasks);
      })
      .catch(() => setError('Failed to create task'));
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
    setFormMode('edit');
    setIsFormOpen(true);
  }

  function handleUpdateTask(data: { title: string; description: string; priority: number; due_date: string | null; }) {
    if (!editingTask) return;
    updateTask(editingTask.id, data)
      .then(() => {
        setIsFormOpen(false);
        setFormMode('create');
        setEditingTask(null);
        fetchTasks({ domainId: selectedDomain?.id }).then(setTasks);
      })
      .catch(() => setError('Failed to update task'));
  }

  function handleDeleteTask(task: Task) {
    deleteTask(task.id)
      .then(() => fetchTasks({ domainId: selectedDomain?.id }).then(setTasks))
      .catch(() => setError('Failed to delete task'));
  }

  function handleToggleStatus(task: Task) {
    const newStatus = task.status === 'done' ? 'pending' : 'done';
    updateTask(task.id, { status: newStatus })
      .then(() => fetchTasks({ domainId: selectedDomain?.id }).then(setTasks))
      .catch(() => setError('Failed to update status'));
  }

  function handleImportTasks(imported: Task[]) {
    // Optionally filter by selectedDomain, or merge
    setTasks(imported);
    // Optionally, send to backend for persistence
  }

  return (
    <div className="tasks-page">
      <div className="tasks-layout">
        <div className="tasks-left">
          {loadingDomains ? <div>Loading domains...</div> : (
            <DomainList
              domains={domains}
              selectedDomainId={selectedDomain?.id || null}
              onSelectDomain={handleSelectDomain}
            />
          )}
          <button
            className="create-task-btn"
            disabled={!selectedDomain}
            onClick={() => { setFormMode('create'); setIsFormOpen(true); }}
          >
            + Create Task
          </button>
        </div>
        <div className="tasks-right">
          <TaskImportExport tasks={tasks} onImport={handleImportTasks} />
          {loadingTasks ? <div>Loading tasks...</div> : (
            <TaskList
              tasks={tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
              onShowExplanation={handleShowExplanation}
            />
          )}
          {/* CT13: Explanation Modal */}
          {explanation && (
            <div className="modal-overlay" onClick={() => setExplanation(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h4>Why this task?</h4>
                {explanationLoading ? <div>Loading...</div> : <div>{explanation.explanation}</div>}
                <button onClick={() => setExplanation(null)}>Close</button>
              </div>
            </div>
          )}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
      <TaskFormModal
        open={isFormOpen}
        mode={formMode}
        initialTask={formMode === 'edit' ? editingTask || undefined : undefined}
        domain={selectedDomain}
        onCancel={() => { setIsFormOpen(false); setEditingTask(null); setFormMode('create'); }}
        onSubmit={formMode === 'create' ? handleCreateTask : handleUpdateTask}
      />
    </div>
  );
}
