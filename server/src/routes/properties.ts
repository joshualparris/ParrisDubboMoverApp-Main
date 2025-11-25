import { Router } from 'express';
import {
  listProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../db/queries';

const router = Router();

function isNonEmptyString(v: any): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

// GET /api/properties
router.get('/', async (req, res, next) => {
  try {
    const rows = await listProperties();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/properties/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const row = await getPropertyById(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// POST /api/properties
router.post('/', async (req, res, next) => {
  try {
    const { address, type, rent_weekly, status, notes } = req.body ?? {};
    if (!isNonEmptyString(address) || !isNonEmptyString(type)) {
      return res.status(400).json({ error: 'Missing required fields: address, type' });
    }
    const created = await createProperty({
      user_id: 1,
      address: address.trim(),
      type: type.trim(),
      rent_weekly: rent_weekly ?? null,
      status: status ?? null,
      notes: notes ?? null,
    } as any);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/properties/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const payload = req.body ?? {};
    const updated = await updateProperty(id, payload);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/properties/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    await deleteProperty(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
