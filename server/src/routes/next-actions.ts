import express, { Request, Response } from 'express';
import { listPendingTasks } from '../db/queries';

const router = express.Router();

/**
 * GET /api/next-actions
 * Returns the top 1-3 recommended pending tasks.
 * Query params:
 *   - limit (default 3): max tasks to return
 *   - includeWhy (default false): include explanation field (stub for now)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 3, 5);
    const includeWhy = req.query.includeWhy === 'true';

    const tasks = await listPendingTasks(limit);

    if (includeWhy) {
      // Stub: add a simple explanation based on priority and domain
      const withExplanations = tasks.map(t => ({
        ...t,
        why: generateExplanation(t),
      }));
      res.json(withExplanations);
    } else {
      res.json(tasks);
    }
  } catch (error) {
    console.error('Error fetching next actions:', error);
    res.status(500).json({ error: 'Failed to fetch next actions' });
  }
});

/**
 * Simple explanation generator based on task priority, domain, and due date.
 * This will be enhanced in CT13 with proper explanations table.
 */
function generateExplanation(task: any): string {
  const now = new Date();
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const daysUntilDue = dueDate ? Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  if (task.priority >= 3) {
    return `High-priority task in ${task.domain_slug || 'this domain'}${daysUntilDue !== null ? ` due in ${daysUntilDue} days` : ''}.`;
  } else if (daysUntilDue !== null && daysUntilDue <= 7) {
    return `Due soon (${daysUntilDue} days) in ${task.domain_slug || 'this domain'}.`;
  } else {
    return `Next task in ${task.domain_slug || 'this domain'}.`;
  }
}

export default router;
