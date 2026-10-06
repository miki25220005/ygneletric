const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://netlifydb_owner:npg_Y8Ufmplcgr7E@ep-dawn-resonance-ai1pdxvy.c-4.us-east-1.db.netlify.com/netlifydb?sslmode=require';
const ADMIN_PIN = process.env.ADMIN_PIN || '1950';

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Pin, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Verify Admin PIN
    const pin = event.queryStringParameters?.pin 
        || event.headers['x-admin-pin'] 
        || (event.body ? JSON.parse(event.body || '{}').pin : '');

    if (pin !== ADMIN_PIN) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ status: 'error', message: 'Unauthorized: Incorrect Admin PIN' })
        };
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // 1. Overall Summary Totals
        const summaryRes = await client.query(`
            SELECT 
                COALESCE(SUM(pageviews), 0)::INT AS total_pageviews,
                COALESCE(SUM(unique_visitors), 0)::INT AS unique_visitors,
                COALESCE(SUM(mobile_views), 0)::INT AS mobile,
                COALESCE(SUM(desktop_views), 0)::INT AS desktop,
                COALESCE(SUM(tablet_views), 0)::INT AS tablet,
                COALESCE(SUM(group_a_views), 0)::INT AS group_a,
                COALESCE(SUM(group_b_views), 0)::INT AS group_b,
                MIN(date)::TEXT AS first_recorded
            FROM daily_analytics;
        `);

        // 2. Daily History Log
        const historyRes = await client.query(`
            SELECT 
                date::TEXT AS date,
                pageviews,
                unique_visitors,
                mobile_views,
                desktop_views,
                tablet_views,
                group_a_views,
                group_b_views
            FROM daily_analytics 
            ORDER BY date DESC 
            LIMIT 90;
        `);

        const s = summaryRes.rows[0] || {};
        const dailyHistory = {};

        historyRes.rows.forEach(r => {
            dailyHistory[r.date] = {
                date: r.date,
                pageviews: r.pageviews,
                uniqueVisitors: r.unique_visitors,
                devices: {
                    mobile: r.mobile_views,
                    desktop: r.desktop_views,
                    tablet: r.tablet_views
                },
                groups: {
                    A: r.group_a_views,
                    B: r.group_b_views
                }
            };
        });

        const responsePayload = {
            status: 'success',
            summary: {
                totalPageviews: s.total_pageviews || 0,
                uniqueVisitors: s.unique_visitors || 0,
                firstRecorded: s.first_recorded || new Date().toISOString().split('T')[0],
                devices: {
                    mobile: s.mobile || 0,
                    desktop: s.desktop || 0,
                    tablet: s.tablet || 0
                },
                groups: {
                    A: s.group_a || 0,
                    B: s.group_b || 0
                }
            },
            dailyHistory
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(responsePayload)
        };
    } catch (err) {
        console.error('Stats Query Error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ status: 'error', message: err.message })
        };
    } finally {
        await client.end();
    }
};
