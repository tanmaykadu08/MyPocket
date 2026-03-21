const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/autopay
router.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM auto_payments WHERE user_id = ? ORDER BY due_day ASC'
  ).all(req.userId);
  // Convert active 0/1 to boolean
  res.json(rows.map(r => ({ ...r, active: r.active === 1 })));
});

// POST /api/autopay
router.post('/', (req, res) => {
  const { name, amount, due_day, payment } = req.body;
  if (!name || !amount || !due_day)
    return res.status(400).json({ error: 'name, amount, due_day are required' });

  const result = db.prepare(
    'INSERT INTO auto_payments (user_id, name, amount, due_day, payment, active) VALUES (?, ?, ?, ?, ?, 1)'
  ).run(req.userId, name, parseFloat(amount), parseInt(due_day), payment || 'Auto debit');

  const row = db.prepare('SELECT * FROM auto_payments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...row, active: row.active === 1 });
});

// PATCH /api/autopay/:id/toggle
router.patch('/:id/toggle', (req, res) => {
  const row = db.prepare('SELECT * FROM auto_payments WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const newActive = row.active === 1 ? 0 : 1;
  db.prepare('UPDATE auto_payments SET active = ? WHERE id = ?').run(newActive, req.params.id);
  res.json({ ...row, active: newActive === 1 });
});

// DELETE /api/autopay/:id
router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT id FROM auto_payments WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!row) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM auto_payments WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
