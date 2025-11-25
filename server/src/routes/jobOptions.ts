import { Router } from 'express';
import {
  listJobOptions,
  getJobOptionById,
  createJobOption,
  updateJobOption,
  deleteJobOption,
} from '../db/queries';

const router = Router();

function isNonEmptyString(v: any): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

// GET /api/job-options
router.get('/', async (req, res, next) => {
  try {
    const rows = await listJobOptions();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/job-options/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const row = await getJobOptionById(id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    next(err);
  }
});

// POST /api/job-options
router.post('/', async (req, res, next) => {
  try {
    const { employer } = req.body ?? {};
    if (!isNonEmptyString(employer)) return res.status(400).json({ error: 'Missing employer' });
    const created = await createJobOption({
      user_id: 1,
      employer: employer.trim(),
      role: req.body.role ?? null,
      hours_per_week: req.body.hours_per_week ?? null,
      pay_rate_hourly: req.body.pay_rate_hourly ?? null,
      status: req.body.status ?? null,
      pros: req.body.pros ?? null,
      cons: req.body.cons ?? null,
      notes: req.body.notes ?? null,
    } as any);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/job-options/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const updated = await updateJobOption(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/job-options/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    await deleteJobOption(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
