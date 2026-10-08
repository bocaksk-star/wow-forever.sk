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

CREATE TABLE IF NOT EXISTS recruits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nick TEXT,
  faction TEXT NOT NULL CHECK (faction IN ('A','H','?')),
  class TEXT,
  focus TEXT,
  note TEXT,
  contact TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_recruits_created ON recruits (created_at);

CREATE TABLE IF NOT EXISTS poll_votes (
  poll TEXT NOT NULL,
  option_slug TEXT NOT NULL,
  voter TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (poll, voter)
);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes (poll);

-- Návrhy mien pre vlastnú guildu + hlasovanie o najlepšom
CREATE TABLE IF NOT EXISTS guild_names (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  note TEXT,
  contact TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_guild_names_status ON guild_names (status, created_at);

CREATE TABLE IF NOT EXISTS guild_name_votes (
  voter TEXT PRIMARY KEY,
  name_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_guild_name_votes_name ON guild_name_votes (name_id);
