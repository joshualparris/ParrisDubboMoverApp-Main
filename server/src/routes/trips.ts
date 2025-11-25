import { Router } from 'express';
import { getAllTrips, getTripById, createTrip, deleteTrip, getTripAssignments, createTripAssignment, deleteTripAssignment, updateTrip, updateTripAssignment } from '../db/queries';

const router = Router();

// Update trip
router.put('/:id', async (req, res) => {
  const updated = await updateTrip(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});


// GET /api/trips
router.get('/', async (req, res) => {
  try {
    const trips = await getAllTrips();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// GET /api/trips/:id
router.get('/:id', async (req, res) => {
  try {
    const trip = await getTripById(Number(req.params.id));
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// POST /api/trips
router.post('/', async (req, res) => {
  try {
    const trip = await createTrip(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  try {
    await deleteTrip(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// GET /api/trips/:id/assignments
router.get('/:id/assignments', async (req, res) => {
  try {
    const assignments = await getTripAssignments(Number(req.params.id));
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// POST /api/trips/:id/assignments
router.post('/:id/assignments', async (req, res) => {
  try {
    const assignment = await createTripAssignment({ ...req.body, trip_id: Number(req.params.id) });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// DELETE /api/assignments/:id
router.delete('/assignments/:id', async (req, res) => {
  try {
    await deleteTripAssignment(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

// PUT /api/assignments/:id
router.put('/assignments/:id', async (req, res) => {
  const updated = await updateTripAssignment(Number(req.params.id), req.body);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

export default router;
