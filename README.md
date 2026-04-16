# Paisa — Money Manager Backend

Node.js + Express + SQLite backend with JWT auth. Deploy to Render in minutes.

---

## Project structure

```
paisa-backend/
├── src/
│   ├── index.js              ← Express app entry point
│   ├── db.js                 ← SQLite setup & schema
│   ├── auth.js               ← JWT middleware
│   └── routes/
│       ├── authRoutes.js     ← POST /api/auth/register|login
│       ├── incomeRoutes.js   ← GET/POST/DELETE /api/income
│       ├── expenseRoutes.js  ← GET/POST/DELETE /api/expenses
│       ├── autopayRoutes.js  ← GET/POST/PATCH/DELETE /api/autopay
│       └── settingsRoutes.js ← GET/PUT /api/settings
├── public/
│   └── index.html            ← Frontend (served by backend)
├── render.yaml               ← Render deployment config
├── package.json
└── README.md
```

---

## Local development

### 1. Install dependencies
```bash
npm install
```

### 2. Create a `.env` file
```env
PORT=3000
JWT_SECRET=your-super-secret-key-change-this
DB_DIR=./data
```

### 3. Start the dev server
```bash
npm run dev
```

Open http://localhost:3000

---

## Deploy to Render 

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/paisa-backend.git
git push -u origin main
```

### Step 2 — Create a Render account
Go to https://render.com and sign up (free).

### Step 3 — New Web Service
1. Click **New → Web Service**
2. Connect your GitHub repo
3. Render will auto-detect `render.yaml` — it sets everything up automatically:
   - Build: `npm install`
   - Start: `npm start`
   - Disk: `/var/data` (persistent SQLite storage)
   - `JWT_SECRET` auto-generated

### Step 4 — Deploy
Click **Create Web Service**. Render builds and deploys in ~2 minutes.

Your app URL will be: `https://paisa-backend.onrender.com`

> ⚠️ Free tier spins down after 15 mins of inactivity. First request after sleep takes ~30 seconds.

---

## Using the frontend

The `public/index.html` file is served by the backend itself.

- **Option A**: Open `https://your-app.onrender.com` directly in any browser — it serves the frontend automatically.
- **Option B**: Open the standalone `public/index.html` file locally. Enter your Render URL in the "Backend URL" field at the top of the login screen.

---

## API Reference

All routes except `/api/auth/*` require `Authorization: Bearer <token>` header.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT token |
| GET | `/api/income?month=YYYY-MM` | Get income for month |
| POST | `/api/income` | Add income entry |
| DELETE | `/api/income/:id` | Delete income entry |
| GET | `/api/expenses?month=YYYY-MM` | Get expenses for month |
| POST | `/api/expenses` | Add expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/autopay` | Get all auto payments |
| POST | `/api/autopay` | Add auto payment |
| PATCH | `/api/autopay/:id/toggle` | Toggle active/inactive |
| DELETE | `/api/autopay/:id` | Delete auto payment |
| GET | `/api/settings` | Get bank balance |
| PUT | `/api/settings` | Update bank balance |
| GET | `/api/health` | Health check |

---

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret for signing JWTs | ⚠️ **Must set in production** |
| `DB_DIR` | Directory for SQLite file | `./data` |
| `FRONTEND_URL` | CORS allowed origin | `*` |
