import express from 'express';
import { pool } from './db.js';
import todosRouter from './routes/todos.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/api/health', async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
});

app.use('/api/todos', todosRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route introuvable.' });
});

app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON invalide.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

const server = app.listen(port, () => {
  console.log(`API démarrée sur le port ${port}`);
});

const shutdown = () => {
  server.close(() => pool.end().then(() => process.exit(0)));
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
