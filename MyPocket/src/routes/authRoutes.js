const express = require('express');
const bcrypt  = require('bcryptjs');
const { db }  = require('../db');
const { signToken } = require('../auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email.toLowerCase().trim()] });
    if (existing.rows.length > 0) return res.status(409).json({ error: 'An account with this email already exists' });

    const hash = await bcrypt.hash(password, 12);
    const result = await db.execute({
      sql: 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      args: [email.toLowerCase().trim(), hash, name || '']
    });

    const userId = Number(result.lastInsertRowid);
    await db.execute({ sql: 'INSERT INTO settings (user_id, bank_balance) VALUES (?, 0)', args: [userId] });

    const token = signToken(userId, email);
    res.status(201).json({ token, user: { id: userId, email, name: name || '' } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email.toLowerCase().trim()] });
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken(Number(user.id), user.email);
    res.json({ token, user: { id: Number(user.id), email: user.email, name: user.name } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
