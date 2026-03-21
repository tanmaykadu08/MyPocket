const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes     = require('./routes/authRoutes');
const incomeRoutes   = require('./routes/incomeRoutes');
const expenseRoutes  = require('./routes/expenseRoutes');
const autopayRoutes  = require('./routes/autopayRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve frontend static files (optional) ──
const frontendPath = path.join(__dirname, '..', 'public');
const fs = require('fs');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// ── API Routes ──
app.use('/api/auth',     authRoutes);
app.use('/api/income',   incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/autopay',  autopayRoutes);
app.use('/api/settings', settingsRoutes);

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all: serve frontend index.html for SPA ──
if (fs.existsSync(frontendPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`✅ MyPocket backend running on port ${PORT}`);
});

module.exports = app;
