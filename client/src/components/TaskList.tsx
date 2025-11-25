import * as React from 'react';
import type { Task } from '../types/api';


interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
  onShowExplanation?: (task: Task) => void; // CT13
}

export function TaskList({ tasks, onEditTask, onDeleteTask, onToggleStatus, onShowExplanation }: TaskListProps) {
  return (
    <div className="task-list">
      <h3>Tasks</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
              <td>
                <button onClick={() => onEditTask(task)}>Edit</button>
                <button onClick={() => onDeleteTask(task)}>Delete</button>
                <button onClick={() => onToggleStatus(task)}>
                  {task.status === 'done' ? 'Mark Pending' : 'Mark Done'}
                </button>
                {onShowExplanation && (
                  <button onClick={() => onShowExplanation(task)} style={{ marginLeft: 4 }}>Why?</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
