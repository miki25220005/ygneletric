<?php
/**
 * Yangon Electricity Schedule - Admin & Analytics Configuration
 * This file is for OWNER / ADMIN USE ONLY.
 */

// Private Admin PIN
define('ADMIN_PIN', '2005');

// Internal Database Storage Paths (Protected from public web access)
define('DATA_DIR', dirname(__DIR__) . '/data');
define('DATA_FILE', DATA_DIR . '/analytics_db.json');
