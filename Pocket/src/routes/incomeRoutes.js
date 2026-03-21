const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/income?month=2025-03
router.get('/', (req, res) => {
  const { month } = req.query;
  if (!month || !/^\d{4}-\d{2}$/.test(month))
    return res.status(400).json({ error: 'month query param required (YYYY-MM)' });

  const rows = db.prepare(
    'SELECT * FROM income WHERE user_id = ? AND month_key = ? ORDER BY date DESC'
  ).all(req.userId, month);
  res.json(rows);
});

// POST /api/income
router.post('/', (req, res) => {
  const { month_key, label, amount, date, notes } = req.body;
  if (!month_key || !label || !amount || !date)
    return res.status(400).json({ error: 'month_key, label, amount, date are required' });

  const result = db.prepare(
    'INSERT INTO income (user_id, month_key, label, amount, date, notes) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(req.userId, month_key, label, parseFloat(amount), date, notes || '');

  const row = db.prepare('SELECT * FROM income WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

// DELETE /api/income/:id
router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT id FROM income WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!row) return res.status(404).json({ error: 'Not found' });
  db.prepare('DELETE FROM income WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
