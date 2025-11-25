import { Router } from 'express';
import {
  listChildcareOptions,
  getChildcareOptionById,
  createChildcareOption,
  updateChildcareOption,
  deleteChildcareOption,
} from '../db/queries';

const router = Router();

function isNonEmptyString(v: any): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

// GET /api/childcare-options
router.get('/', async (req, res, next) => {
  try {
    const rows = await listChildcareOptions();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/childcare-options/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const row = await getChildcareOptionById(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// POST /api/childcare-options
router.post('/', async (req, res, next) => {
  try {
    const { name, type } = req.body ?? {};
    if (!isNonEmptyString(name) || !isNonEmptyString(type)) return res.status(400).json({ error: 'Missing name or type' });
    const created = await createChildcareOption({
      user_id: 1,
      name: name.trim(),
      type: type.trim(),
      location: req.body.location ?? null,
      min_age_months: req.body.min_age_months ?? null,
      max_age_months: req.body.max_age_months ?? null,
      daily_fee: req.body.daily_fee ?? null,
      status: req.body.status ?? null,
      notes: req.body.notes ?? null,
    } as any);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/childcare-options/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const updated = await updateChildcareOption(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/childcare-options/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    await deleteChildcareOption(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
