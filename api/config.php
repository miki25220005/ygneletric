<?php
/**
 * Yangon Electricity Schedule - Admin & Analytics Configuration
 * This file is for OWNER / ADMIN USE ONLY.
 */

// Private Admin PIN - Change this to any secret PIN you want
define('ADMIN_PIN', '1950');

// Internal Database Storage Paths (Protected from public web access)
define('DATA_DIR', dirname(__DIR__) . '/data');
define('DATA_FILE', DATA_DIR . '/analytics_db.json');
