import { Router } from 'express';
import {
  createTask,
  getTaskById,
  getTasksByDomain,
  updateTaskStatus,
  deleteTask
} from '../db/queries';
import type { TaskStatus } from '../types/entities';

const router = Router();

// GET /api/tasks/:id - get task by id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid task id' });
  const task = await getTaskById(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// GET /api/tasks/domain/:domain - get tasks by domain slug or id
router.get('/domain/:domain', async (req, res) => {
  const domain = req.params.domain;
  const tasks = await getTasksByDomain(isNaN(Number(domain)) ? domain : Number(domain));
  res.json(tasks);
});

// POST /api/tasks - create new task
router.post('/', async (req, res) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});


// PATCH /api/tasks/:id/status - update task status
router.patch('/:id/status', async (req, res) => {
  const id = Number(req.params.id);
  const status = req.body.status as TaskStatus;
  if (!id || !status) return res.status(400).json({ error: 'Invalid input' });
  try {
    const updated = await updateTaskStatus(id, status);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update status' });
  }
});

// PATCH /api/tasks/:id - update task fields (edit)
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid task id' });
  try {
    // Only allow updating editable fields
    const fields = req.body;
    const db = require('../db/index').getDb();
    const now = new Date().toISOString();
    const editable = [
      'title', 'description', 'priority', 'due_date', 'origin_doc_id',
      'related_property_id', 'related_job_id', 'related_provider_id',
      'related_childcare_id', 'related_trip_id', 'notes'
    ];
    const updates = editable.filter(f => fields[f] !== undefined);
    if (updates.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
    const setClause = updates.map(f => `${f} = ?`).join(', ') + ', updated_at = ?';
    const values = updates.map(f => fields[f]);
    values.push(now);
    db.prepare(`UPDATE tasks SET ${setClause} WHERE id = ?`).run(...values, id);
    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - delete task
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid task id' });
  try {
    await deleteTask(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete task' });
  }
});

export default router;
