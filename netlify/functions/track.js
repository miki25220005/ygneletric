const { Client } = require('pg');
const crypto = require('crypto');

const connectionString = process.env.DATABASE_URL || 'postgresql://netlifydb_owner:npg_Y8Ufmplcgr7E@ep-dawn-resonance-ai1pdxvy.c-4.us-east-1.db.netlify.com/netlifydb?sslmode=require';

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    let payload = {};
    try {
        payload = JSON.parse(event.body || '{}');
    } catch (e) {
        payload = {};
    }

    const device = ['mobile', 'desktop', 'tablet'].includes(payload.device) ? payload.device : 'mobile';
    const group = ['A', 'B'].includes(payload.group) ? payload.group : 'A';

    // Current date in Myanmar Time (UTC+6:30)
    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    const mmDate = new Date(utcMs + (6.5 * 3600000));
    const todayStr = mmDate.toISOString().split('T')[0];

    // Anonymous daily hash of IP + User-Agent + Date
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || '127.0.0.1';
    const ua = event.headers['user-agent'] || '';
    const visitorHash = crypto.createHash('sha256').update(ip + ua + todayStr).digest('hex');

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // 1. Try to record unique session for today
        const sessionRes = await client.query(
            `INSERT INTO visitor_daily_sessions (date, visitor_hash) 
             VALUES ($1, $2) 
             ON CONFLICT (date, visitor_hash) DO NOTHING;`,
            [todayStr, visitorHash]
        );

        const isUnique = (sessionRes.rowCount === 1) ? 1 : 0;
        const isMobile = (device === 'mobile') ? 1 : 0;
        const isDesktop = (device === 'desktop') ? 1 : 0;
        const isTablet = (device === 'tablet') ? 1 : 0;
        const isGroupA = (group === 'A') ? 1 : 0;
        const isGroupB = (group === 'B') ? 1 : 0;

        // 2. Atomic UPSERT into daily_analytics
        await client.query(
            `INSERT INTO daily_analytics (
                date, pageviews, unique_visitors, 
                mobile_views, desktop_views, tablet_views, 
                group_a_views, group_b_views, updated_at
            ) VALUES (
                $1, 1, $2, 
                $3, $4, $5, 
                $6, $7, CURRENT_TIMESTAMP
            )
            ON CONFLICT (date) DO UPDATE SET
                pageviews = daily_analytics.pageviews + 1,
                unique_visitors = daily_analytics.unique_visitors + EXCLUDED.unique_visitors,
                mobile_views = daily_analytics.mobile_views + EXCLUDED.mobile_views,
                desktop_views = daily_analytics.desktop_views + EXCLUDED.desktop_views,
                tablet_views = daily_analytics.tablet_views + EXCLUDED.tablet_views,
                group_a_views = daily_analytics.group_a_views + EXCLUDED.group_a_views,
                group_b_views = daily_analytics.group_b_views + EXCLUDED.group_b_views,
                updated_at = CURRENT_TIMESTAMP;`,
            [todayStr, isUnique, isMobile, isDesktop, isTablet, isGroupA, isGroupB]
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ status: 'success' })
        };
    } catch (err) {
        console.error('Tracking Error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ status: 'error', message: err.message })
        };
    } finally {
        await client.end();
    }
};
