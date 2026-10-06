const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://netlifydb_owner:npg_Y8Ufmplcgr7E@ep-dawn-resonance-ai1pdxvy.c-4.us-east-1.db.netlify.com/netlifydb?sslmode=require';

const schemaSQL = `
-- 1. Daily Analytics Table
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

-- 2. Anonymous Daily Visitor Deduplication Table
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
`;

async function initDatabase() {
    console.log('Connecting to PostgreSQL database...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected successfully!');

        console.log('Executing CREATE TABLE queries...');
        await client.query(schemaSQL);
        console.log('Tables and indexes created successfully!');

        // Query created tables to verify
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);
        console.log('Existing tables in public schema:', res.rows.map(r => r.table_name));

    } catch (err) {
        console.error('Database connection or query error:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

initDatabase();
