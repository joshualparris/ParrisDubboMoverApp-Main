import { Router } from 'express';
import { getAllDomains } from '../db/queries';

const router = Router();

// GET /api/domains - list all domains
router.get('/', async (req, res) => {
  try {
    const domains = await getAllDomains();
    res.json(domains);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

export default router;
