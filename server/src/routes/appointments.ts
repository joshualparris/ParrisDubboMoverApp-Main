import { Router } from 'express';
import { listAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment } from '../db/queries';

const router = Router();

// GET /api/appointments
router.get('/', async (req, res) => {
  try {
    const items = await listAppointments();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// GET /api/appointments/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  const item = await getAppointmentById(id);
  if (!item) return res.status(404).json({ error: 'Appointment not found' });
  res.json(item);
});

// POST /api/appointments
router.post('/', async (req, res) => {
  try {
    const item = await createAppointment(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create appointment' });
  }
});

// PUT /api/appointments/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await updateAppointment(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update appointment' });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', async (req, res) => {
  try {
    await deleteAppointment(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
