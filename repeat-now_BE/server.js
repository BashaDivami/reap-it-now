const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', require('./routes'));

// 404 fallback — RFC 7807
app.use((req, res) => {
  res.status(404).json({
    type: 'https://api.reap.cloud/problems/not-found',
    title: 'Not Found',
    status: 404,
    detail: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler — RFC 7807
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    type: 'https://api.reap.cloud/problems/internal-error',
    title: 'Internal Server Error',
    status: 500,
    detail: err.message || 'An unexpected error occurred',
  });
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}/api`);
  console.log('  v1 → /api/v1  (client-provided APIs)');
  console.log('  v2 → /api/v2  (tweaked / removed endpoints)');
  console.log('  v3 → /api/v3  (new screen APIs)');
});
