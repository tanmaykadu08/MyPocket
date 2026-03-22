const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const { initDb } = require('./db');

const authRoutes     = require('./routes/authRoutes');
const incomeRoutes   = require('./routes/incomeRoutes');
const expenseRoutes  = require('./routes/expenseRoutes');
const autopayRoutes  = require('./routes/autopayRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
const frontendPath = path.join(__dirname, '..', 'public');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// API Routes
app.use('/api/auth',     authRoutes);
app.use('/api/income',   incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/autopay',  autopayRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Catch-all for SPA
if (fs.existsSync(frontendPath)) {
  app.get('*', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
}

// Init DB then start server
initDb().then(() => {
  app.listen(PORT, () => console.log(`✅ MyPocket running on port ${PORT}`));
}).catch(err => {
  console.error('❌ Failed to init database:', err);
  process.exit(1);
});

module.exports = app;
