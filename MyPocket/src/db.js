const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

async function initDb() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT    NOT NULL UNIQUE,
      password   TEXT    NOT NULL,
      name       TEXT    NOT NULL DEFAULT '',
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS income (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      month_key  TEXT    NOT NULL,
      label      TEXT    NOT NULL,
      amount     REAL    NOT NULL,
      date       TEXT    NOT NULL,
      notes      TEXT    NOT NULL DEFAULT '',
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      month_key  TEXT    NOT NULL,
      desc       TEXT    NOT NULL,
      amount     REAL    NOT NULL,
      date       TEXT    NOT NULL,
      category   TEXT    NOT NULL DEFAULT 'other',
      payment    TEXT    NOT NULL DEFAULT 'UPI',
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS auto_payments (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      name       TEXT    NOT NULL,
      amount     REAL    NOT NULL,
      due_day    INTEGER NOT NULL,
      payment    TEXT    NOT NULL DEFAULT 'Auto debit',
      active     INTEGER NOT NULL DEFAULT 1,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      user_id      INTEGER PRIMARY KEY,
      bank_balance REAL NOT NULL DEFAULT 0,
      updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  console.log('✅ Database tables ready');
}

module.exports = { db, initDb };
