const express = require('express');
const { db } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/autopay
router.get('/', async (req, res) => {
  const result = await db.execute({
    sql: 'SELECT * FROM auto_payments WHERE user_id = ? ORDER BY due_day ASC',
    args: [req.userId]
  });
  res.json(result.rows.map(r => ({ ...r, active: r.active === 1 || r.active === true })));
});

// POST /api/autopay
router.post('/', async (req, res) => {
  const { name, amount, due_day, payment } = req.body;
  if (!name || !amount || !due_day)
    return res.status(400).json({ error: 'name, amount, due_day are required' });
  const result = await db.execute({
    sql: 'INSERT INTO auto_payments (user_id, name, amount, due_day, payment, active) VALUES (?, ?, ?, ?, ?, 1)',
    args: [req.userId, name, parseFloat(amount), parseInt(due_day), payment || 'Auto debit']
  });
  const row = await db.execute({ sql: 'SELECT * FROM auto_payments WHERE id = ?', args: [result.lastInsertRowid] });
  const r = row.rows[0];
  res.status(201).json({ ...r, active: r.active === 1 || r.active === true });
});

// PATCH /api/autopay/:id/toggle
router.patch('/:id/toggle', async (req, res) => {
  const row = await db.execute({ sql: 'SELECT * FROM auto_payments WHERE id = ? AND user_id = ?', args: [req.params.id, req.userId] });
  if (row.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  const current = row.rows[0];
  const newActive = (current.active === 1 || current.active === true) ? 0 : 1;
  await db.execute({ sql: 'UPDATE auto_payments SET active = ? WHERE id = ?', args: [newActive, req.params.id] });
  res.json({ ...current, active: newActive === 1 });
});

// DELETE /api/autopay/:id
router.delete('/:id', async (req, res) => {
  const row = await db.execute({ sql: 'SELECT id FROM auto_payments WHERE id = ? AND user_id = ?', args: [req.params.id, req.userId] });
  if (row.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  await db.execute({ sql: 'DELETE FROM auto_payments WHERE id = ?', args: [req.params.id] });
  res.json({ success: true });
});

module.exports = router;
