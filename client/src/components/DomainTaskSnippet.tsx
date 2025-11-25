import * as React from 'react';
import type { Task } from '../types/api';

interface DomainTaskSnippetProps {
  task: Task;
  onToggleStatus: (id: number, status: Task['status']) => void;
}

export const DomainTaskSnippet: React.FC<DomainTaskSnippetProps> = ({ task, onToggleStatus }) => {
  return (
    <div className="domain-task-snippet">
      <div>
        <strong>{task.title}</strong> <span>({task.status})</span>
      </div>
      <div>{task.description}</div>
      <button
        onClick={() =>
          onToggleStatus(
            task.id,
            task.status === 'done' ? 'pending' : 'done'
          )
        }
      >
        Mark as {task.status === 'done' ? 'Pending' : 'Done'}
      </button>
    </div>
  );
};
