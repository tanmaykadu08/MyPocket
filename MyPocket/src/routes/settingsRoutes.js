const express = require('express');
const { db } = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/settings
router.get('/', async (req, res) => {
  const result = await db.execute({ sql: 'SELECT * FROM settings WHERE user_id = ?', args: [req.userId] });
  if (result.rows.length === 0) {
    await db.execute({ sql: 'INSERT INTO settings (user_id, bank_balance) VALUES (?, 0)', args: [req.userId] });
    return res.json({ user_id: req.userId, bank_balance: 0 });
  }
  res.json(result.rows[0]);
});

// PUT /api/settings
router.put('/', async (req, res) => {
  const { bank_balance } = req.body;
  if (bank_balance === undefined) return res.status(400).json({ error: 'bank_balance is required' });
  await db.execute({
    sql: `INSERT INTO settings (user_id, bank_balance, updated_at) VALUES (?, ?, datetime('now'))
          ON CONFLICT(user_id) DO UPDATE SET bank_balance = excluded.bank_balance, updated_at = excluded.updated_at`,
    args: [req.userId, parseFloat(bank_balance)]
  });
  res.json({ user_id: req.userId, bank_balance: parseFloat(bank_balance) });
});

module.exports = router;
