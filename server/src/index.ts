
import app from './app';
import { initDb } from './db';

const port = process.env.PORT ? Number(process.env.PORT) : 5100;

try {
  initDb();
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
} catch (err) {
  console.error('Failed to initialize database:', err);
  process.exit(1);
}
