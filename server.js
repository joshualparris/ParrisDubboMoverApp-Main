const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive!' });
});

app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});

----------------