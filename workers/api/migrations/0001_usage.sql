CREATE TABLE IF NOT EXISTS usage_daily (
  ip_hash TEXT NOT NULL,
  usage_date TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, usage_date)
);
CREATE INDEX IF NOT EXISTS idx_usage_daily_date ON usage_daily (usage_date);
