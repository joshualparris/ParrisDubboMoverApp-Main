import express, { Request, Response } from 'express';
import {
  listWorkLinks,
  getWorkLinkById,
  createWorkLink,
  updateWorkLink,
  deleteWorkLink,
  WorkLinkInput
} from '../db/queries';

const router = express.Router();

// GET /api/work-links?user_id=1
router.get('/', async (req: Request, res: Response) => {
  const userId = parseInt(req.query.user_id as string) || 1;
  try {
    const links = await listWorkLinks(userId);
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list work links' });
  }
});

// GET /api/work-links/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const link = await getWorkLinkById(Number(req.params.id));
    if (!link) return res.status(404).json({ error: 'Not found' });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get work link' });
  }
});

// POST /api/work-links
router.post('/', async (req: Request, res: Response) => {
  try {
    const input: WorkLinkInput = { ...req.body, user_id: req.body.user_id ?? 1 };
    const link = await createWorkLink(input);
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create work link' });
  }
});

// PATCH /api/work-links/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const link = await updateWorkLink(Number(req.params.id), req.body);
    if (!link) return res.status(404).json({ error: 'Not found' });
    res.json(link);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update work link' });
  }
});

// DELETE /api/work-links/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await deleteWorkLink(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete work link' });
  }
});

export default router;
