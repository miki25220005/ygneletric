-- ============================================================================
-- Yangon Electricity Schedule (YESC)
-- Production PostgreSQL Database Schema (Netlify DB / Neon)
-- ============================================================================

-- 1. Daily Analytics Table
-- Tracks aggregated daily pageviews, unique visitors, devices, and group checks
CREATE TABLE IF NOT EXISTS daily_analytics (
    date DATE PRIMARY KEY,
    pageviews INT NOT NULL DEFAULT 0,
    unique_visitors INT NOT NULL DEFAULT 0,
    mobile_views INT NOT NULL DEFAULT 0,
    desktop_views INT NOT NULL DEFAULT 0,
    tablet_views INT NOT NULL DEFAULT 0,
    group_a_views INT NOT NULL DEFAULT 0,
    group_b_views INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date DESC);

-- 2. Anonymous Visitor Deduplication Table
-- Stores daily SHA-256 hashes to count unique daily visitors without storing personal information
CREATE TABLE IF NOT EXISTS visitor_daily_sessions (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    visitor_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_date_visitor UNIQUE (date, visitor_hash)
);

CREATE INDEX IF NOT EXISTS idx_visitor_sessions_date ON visitor_daily_sessions(date);

-- 3. System Metadata Table
CREATE TABLE IF NOT EXISTS analytics_metadata (
    key VARCHAR(64) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO analytics_metadata (key, value)
VALUES ('first_installed_date', CURRENT_DATE::TEXT)
ON CONFLICT (key) DO NOTHING;
