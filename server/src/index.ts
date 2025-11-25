
import app from './app';
import { initDb } from './db';

const port = process.env.PORT ? Number(process.env.PORT) : 5100;

try {
  initDb();
  // Warn if admin credentials are not configured
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS) {
    console.warn('WARNING: ADMIN_USER or ADMIN_PASS not set. Admin routes and write-protected endpoints may be unsecured. Set these env vars before deploying to production.');
  }
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
} catch (err) {
  console.error('Failed to initialize database:', err);
  process.exit(1);
}
