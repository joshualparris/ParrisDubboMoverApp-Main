import { Router } from 'express';
import { listProviders, getProviderById, createProvider, updateProvider, deleteProvider } from '../db/queries';

const router = Router();

// GET /api/providers
router.get('/', async (req, res) => {
  try {
    const items = await listProviders();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// GET /api/providers/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  const item = await getProviderById(id);
  if (!item) return res.status(404).json({ error: 'Provider not found' });
  res.json(item);
});

// POST /api/providers
router.post('/', async (req, res) => {
  try {
    const item = await createProvider(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create provider' });
  }
});

// PUT /api/providers/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await updateProvider(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update provider' });
  }
});

// DELETE /api/providers/:id
router.delete('/:id', async (req, res) => {
  try {
    await deleteProvider(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete provider' });
  }
});

export default router;
