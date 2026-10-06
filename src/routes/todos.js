import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const parseTitle = (value) => {
  if (typeof value !== 'string') return null;
  const title = value.trim();
  return title.length > 0 && title.length <= 255 ? title : null;
};

router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM todos ORDER BY created_at DESC, id DESC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const title = parseTitle(req.body?.title);
  if (!title) {
    return res.status(400).json({ error: 'Le titre est requis (1 à 255 caractères).' });
  }

  const { rows } = await pool.query('INSERT INTO todos (title) VALUES ($1) RETURNING *', [title]);
  res.status(201).json(rows[0]);
});

router.patch('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Identifiant invalide.' });

  const { title, completed } = req.body ?? {};
  const fields = [];
  const values = [];

  if (title !== undefined) {
    const parsed = parseTitle(title);
    if (!parsed) {
      return res.status(400).json({ error: 'Le titre est requis (1 à 255 caractères).' });
    }
    values.push(parsed);
    fields.push(`title = $${values.length}`);
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Le champ "completed" doit être un booléen.' });
    }
    values.push(completed);
    fields.push(`completed = $${values.length}`);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'Aucun champ à mettre à jour.' });
  }

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE todos SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values,
  );

  if (rows.length === 0) return res.status(404).json({ error: 'Tâche introuvable.' });
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Identifiant invalide.' });

  const { rowCount } = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Tâche introuvable.' });
  res.status(204).end();
});

export default router;
