CREATE TABLE IF NOT EXISTS guilds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  faction TEXT NOT NULL CHECK (faction IN ('A','H')),
  realm TEXT NOT NULL,
  focus TEXT NOT NULL,
  lang TEXT NOT NULL,
  raid_times TEXT,
  discord TEXT,
  description TEXT,
  contact TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
-- admin kľúč: INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_key', '...');
CREATE INDEX IF NOT EXISTS idx_guilds_status ON guilds (status, created_at);
