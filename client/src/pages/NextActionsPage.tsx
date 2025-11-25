import * as React from 'react';
const { useState, useEffect } = React;
import { fetchNextActions, type NextAction } from '../api/next-actions';
import { updateTask } from '../api/tasks';
import type { TaskStatus } from '../types/api';

export default function NextActionsPage() {
  const [actions, setActions] = useState<NextAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeWhy, setIncludeWhy] = useState(false);
  const [selectedLimit, setSelectedLimit] = useState(3);

  useEffect(() => {
    loadActions();
  }, [selectedLimit, includeWhy]);

  async function loadActions() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNextActions(selectedLimit, includeWhy);
      setActions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load next actions');
    } finally {
      setLoading(false);
    }
  }

  async function markDone(taskId: number) {
    try {
      await updateTask(taskId, { status: 'done' as TaskStatus });
      setActions(actions.filter(a => a.id !== taskId));
    } catch (err) {
      alert('Failed to mark task done: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2>What Should I Do Next?</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Here are your top priorities to focus on right now. Check one off when done!
      </p>

      <div style={{ marginBottom: 20, display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={includeWhy}
            onChange={(e) => setIncludeWhy(e.target.checked)}
          />
          {' '}Show explanations
        </label>
        <label>
          Show top:
          {' '}
          <select value={selectedLimit} onChange={(e) => setSelectedLimit(parseInt(e.target.value))}>
            <option value={1}>1 task</option>
            <option value={3}>3 tasks</option>
            <option value={5}>5 tasks</option>
          </select>
        </label>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 16 }}>Error: {error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : actions.length === 0 ? (
        <p style={{ color: '#999' }}>No pending tasks. Great job! 🎉</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {actions.map((action, idx) => (
            <div
              key={action.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 16,
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <input
                  type="checkbox"
                  onChange={() => markDone(action.id)}
                  style={{ marginTop: 4, cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>
                    {idx + 1}. {action.title}
                  </h3>
                  {action.description && (
                    <p style={{ margin: '0 0 8px 0', color: '#555', fontSize: 14 }}>
                      {action.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: '#888' }}>
                    <span>📍 {action.domain_slug || 'general'}</span>
                    {action.priority && (
                      <span>⭐ Priority: {action.priority}</span>
                    )}
                    {action.due_date && (
                      <span>📅 {new Date(action.due_date).toLocaleDateString()}</span>
                    )}
                  </div>
                  {includeWhy && action.why && (
                    <p style={{ margin: '12px 0 0 0', padding: '8px 12px', backgroundColor: '#e8f4f8', borderRadius: 4, fontSize: 13 }}>
                      <strong>Why:</strong> {action.why}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
