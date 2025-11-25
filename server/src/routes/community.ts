import { Router } from 'express';
import {
  listCommunityPlaces,
  getCommunityPlaceById,
  createCommunityPlace,
  updateCommunityPlace,
  deleteCommunityPlace,
  listCommunityVisits,
  createCommunityVisit,
  deleteCommunityVisit,
} from '../db/queries';

const router = Router();

router.get('/places', async (req, res, next) => {
  try { res.json(await listCommunityPlaces()); } catch (err) { next(err); }
});

router.post('/places', async (req, res, next) => {
  try {
    const { name, address, category, notes } = req.body ?? {};
    if (!name) return res.status(400).json({ error: 'Missing name' });
    const created = await createCommunityPlace({ user_id: 1, name, address, category, notes } as any);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.patch('/places/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateCommunityPlace(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/places/:id', async (req, res, next) => {
  try { await deleteCommunityPlace(Number(req.params.id)); res.status(204).end(); } catch (err) { next(err); }
});

router.get('/places/:placeId/visits', async (req, res, next) => {
  try {
    const placeId = Number(req.params.placeId);
    const visits = await listCommunityVisits({ placeId });
    res.json(visits);
  } catch (err) {
    next(err);
  }
});

router.post('/places/:placeId/visits', async (req, res, next) => {
  try {
    const placeId = Number(req.params.placeId);
    const { visit_date, notes } = req.body ?? {};
    const created = await createCommunityVisit({ place_id: placeId, visit_date: visit_date ?? new Date().toISOString(), notes } as any);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.delete('/visits/:id', async (req, res, next) => {
  try { await deleteCommunityVisit(Number(req.params.id)); res.status(204).end(); } catch (err) { next(err); }
});

export default router;
