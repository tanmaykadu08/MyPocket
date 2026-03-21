const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/settings
router.get('/', (req, res) => {
  let row = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.userId);
  if (!row) {
    db.prepare('INSERT INTO settings (user_id, bank_balance) VALUES (?, 0)').run(req.userId);
    row = { user_id: req.userId, bank_balance: 0 };
  }
  res.json(row);
});

// PUT /api/settings
router.put('/', (req, res) => {
  const { bank_balance } = req.body;
  if (bank_balance === undefined) return res.status(400).json({ error: 'bank_balance is required' });

  db.prepare(`
    INSERT INTO settings (user_id, bank_balance, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(user_id) DO UPDATE SET bank_balance = excluded.bank_balance, updated_at = excluded.updated_at
  `).run(req.userId, parseFloat(bank_balance));

  res.json({ user_id: req.userId, bank_balance: parseFloat(bank_balance) });
});

module.exports = router;
