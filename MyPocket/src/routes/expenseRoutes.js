const express = require('express');
const { db } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();
router.use(authMiddleware);

const VALID_CATS = ['food','transport','bills','shopping','health','other'];
const VALID_PAY  = ['UPI','Cash','Card','Net Banking'];

// GET /api/expenses?month=2025-03
router.get('/', async (req, res) => {
  const { month } = req.query;
  if (!month || !/^\d{4}-\d{2}$/.test(month))
    return res.status(400).json({ error: 'month query param required (YYYY-MM)' });
  const result = await db.execute({
    sql: 'SELECT * FROM expenses WHERE user_id = ? AND month_key = ? ORDER BY date DESC',
    args: [req.userId, month]
  });
  res.json(result.rows);
});

// POST /api/expenses
router.post('/', async (req, res) => {
  const { month_key, desc, amount, date, category, payment } = req.body;
  if (!month_key || !desc || !amount || !date)
    return res.status(400).json({ error: 'month_key, desc, amount, date are required' });
  const cat = VALID_CATS.includes(category) ? category : 'other';
  const pay = VALID_PAY.includes(payment)   ? payment  : 'UPI';
  const result = await db.execute({
    sql: 'INSERT INTO expenses (user_id, month_key, desc, amount, date, category, payment) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [req.userId, month_key, desc, parseFloat(amount), date, cat, pay]
  });
  const row = await db.execute({ sql: 'SELECT * FROM expenses WHERE id = ?', args: [result.lastInsertRowid] });
  res.status(201).json(row.rows[0]);
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  const row = await db.execute({ sql: 'SELECT id FROM expenses WHERE id = ? AND user_id = ?', args: [req.params.id, req.userId] });
  if (row.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  await db.execute({ sql: 'DELETE FROM expenses WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});

module.exports = router;
