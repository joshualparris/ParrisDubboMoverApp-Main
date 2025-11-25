import { Router } from 'express';
import {
  listPackingAreas,
  getPackingAreaById,
  createPackingArea,
  updatePackingArea,
  deletePackingArea,
  listPackingBoxes,
  getPackingBoxById,
  createPackingBox,
  updatePackingBox,
  deletePackingBox,
  listPackingItems,
  createPackingItem,
  updatePackingItem,
  deletePackingItem,
} from '../db/queries';

const router = Router();

// Areas
router.get('/areas', async (req, res, next) => {
  try {
    const rows = await listPackingAreas();
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/areas', async (req, res, next) => {
  try {
    const { name, location_description, notes } = req.body ?? {};
    if (!name) return res.status(400).json({ error: 'Missing name' });
    const created = await createPackingArea({ user_id: 1, name, location_description, notes } as any);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.patch('/areas/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await updatePackingArea(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/areas/:id', async (req, res, next) => {
  try { await deletePackingArea(Number(req.params.id)); res.status(204).end(); } catch (err) { next(err); }
});

// Boxes
router.get('/areas/:areaId/boxes', async (req, res, next) => {
  try {
    const areaId = Number(req.params.areaId);
    const rows = await listPackingBoxes({ areaId });
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/areas/:areaId/boxes', async (req, res, next) => {
  try {
    const areaId = Number(req.params.areaId);
    const { label, box_type, weight_kg, status, notes } = req.body ?? {};
    if (!label) return res.status(400).json({ error: 'Missing label' });
    const created = await createPackingBox({ area_id: areaId, label, box_type, weight_kg, status, notes } as any);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.patch('/boxes/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await updatePackingBox(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/boxes/:id', async (req, res, next) => {
  try { await deletePackingBox(Number(req.params.id)); res.status(204).end(); } catch (err) { next(err); }
});

// Items
router.get('/boxes/:boxId/items', async (req, res, next) => {
  try {
    const boxId = Number(req.params.boxId);
    const rows = await listPackingItems({ boxId });
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/boxes/:boxId/items', async (req, res, next) => {
  try {
    const boxId = Number(req.params.boxId);
    const { name, quantity, fragile, notes } = req.body ?? {};
    if (!name) return res.status(400).json({ error: 'Missing name' });
    const created = await createPackingItem({ box_id: boxId, name, quantity: quantity ?? 1, fragile: fragile ? 1 : 0, notes } as any);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.patch('/items/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await updatePackingItem(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/items/:id', async (req, res, next) => {
  try { await deletePackingItem(Number(req.params.id)); res.status(204).end(); } catch (err) { next(err); }
});

export default router;
