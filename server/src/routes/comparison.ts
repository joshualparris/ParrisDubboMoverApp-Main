import { Router } from 'express';
import {
  listProperties, getPropertyById, createProperty, updateProperty, deleteProperty,
  listJobOptions, getJobOptionById, createJobOption, updateJobOption, deleteJobOption,
  listChildcareOptions, getChildcareOptionById, createChildcareOption, updateChildcareOption, deleteChildcareOption
} from '../db/queries';

const router = Router();

// --- Properties ---
router.get('/properties', async (req, res) => {
  res.json(await listProperties());
});

router.get('/properties/:id', async (req, res) => {
  const item = await getPropertyById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/properties', async (req, res) => {
  const item = await createProperty(req.body);
  res.status(201).json(item);
});

router.put('/properties/:id', async (req, res) => {
  const item = await updateProperty(Number(req.params.id), req.body);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.delete('/properties/:id', async (req, res) => {
  await deleteProperty(Number(req.params.id));
  res.status(204).end();
});

// --- Job Options ---
router.get('/job-options', async (req, res) => {
  res.json(await listJobOptions());
});

router.get('/job-options/:id', async (req, res) => {
  const item = await getJobOptionById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/job-options', async (req, res) => {
  const item = await createJobOption(req.body);
  res.status(201).json(item);
});

router.put('/job-options/:id', async (req, res) => {
  const item = await updateJobOption(Number(req.params.id), req.body);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.delete('/job-options/:id', async (req, res) => {
  await deleteJobOption(Number(req.params.id));
  res.status(204).end();
});

// --- Childcare Options ---
router.get('/childcare-options', async (req, res) => {
  res.json(await listChildcareOptions());
});

router.get('/childcare-options/:id', async (req, res) => {
  const item = await getChildcareOptionById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/childcare-options', async (req, res) => {
  const item = await createChildcareOption(req.body);
  res.status(201).json(item);
});

router.put('/childcare-options/:id', async (req, res) => {
  const item = await updateChildcareOption(Number(req.params.id), req.body);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.delete('/childcare-options/:id', async (req, res) => {
  await deleteChildcareOption(Number(req.params.id));
  res.status(204).end();
});

export default router;
