import express, { Request, Response } from 'express';
import {
  listComplianceItems,
  getComplianceItemById,
  createComplianceItem,
  updateComplianceItem,
  deleteComplianceItem,
  ComplianceItemInput
} from '../db/queries';

const router = express.Router();

// GET /api/compliance-items?user_id=1
router.get('/', async (req: Request, res: Response) => {
  const userId = parseInt(req.query.user_id as string) || 1;
  try {
    const items = await listComplianceItems(userId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list compliance items' });
  }
});

// GET /api/compliance-items/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await getComplianceItemById(Number(req.params.id));
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get compliance item' });
  }
});

// POST /api/compliance-items
router.post('/', async (req: Request, res: Response) => {
  try {
    const input: ComplianceItemInput = { ...req.body, user_id: req.body.user_id ?? 1 };
    const item = await createComplianceItem(input);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create compliance item' });
  }
});

// PATCH /api/compliance-items/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const item = await updateComplianceItem(Number(req.params.id), req.body);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update compliance item' });
  }
});

// DELETE /api/compliance-items/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await deleteComplianceItem(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete compliance item' });
  }
});

export default router;
