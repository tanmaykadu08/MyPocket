const express = require('express');
const { db } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/income?month=2025-03
router.get('/', async (req, res) => {
  const { month } = req.query;
  if (!month || !/^\d{4}-\d{2}$/.test(month))
    return res.status(400).json({ error: 'month query param required (YYYY-MM)' });
  const result = await db.execute({
    sql: 'SELECT * FROM income WHERE user_id = ? AND month_key = ? ORDER BY date DESC',
    args: [req.userId, month]
  });
  res.json(result.rows);
});

// POST /api/income
router.post('/', async (req, res) => {
  const { month_key, label, amount, date, notes } = req.body;
  if (!month_key || !label || !amount || !date)
    return res.status(400).json({ error: 'month_key, label, amount, date are required' });
  const result = await db.execute({
    sql: 'INSERT INTO income (user_id, month_key, label, amount, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
    args: [req.userId, month_key, label, parseFloat(amount), date, notes || '']
  });
  const row = await db.execute({ sql: 'SELECT * FROM income WHERE id = ?', args: [result.lastInsertRowid] });
  res.status(201).json(row.rows[0]);
});

// DELETE /api/income/:id
router.delete('/:id', async (req, res) => {
  const row = await db.execute({ sql: 'SELECT id FROM income WHERE id = ? AND user_id = ?', args: [req.params.id, req.userId] });
  if (row.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  await db.execute({ sql: 'DELETE FROM income WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});

module.exports = router;
