<?php
/**
 * Public Anonymous Analytics Collector
 * Lightweight, privacy-preserving ping endpoint (< 2ms execution).
 * Zero cookies, zero personal data. Aggregates total visits, devices, and dates.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

require_once __DIR__ . '/config.php';

// Ensure protected data directory exists
if (!is_dir(DATA_DIR)) {
    @mkdir(DATA_DIR, 0755, true);
    @file_put_contents(DATA_DIR . '/.htaccess', "Deny from all\n");
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    echo json_encode(["status" => "ignored"]);
    exit;
}

$device = isset($data['device']) && in_array($data['device'], ['mobile', 'desktop', 'tablet']) 
    ? $data['device'] 
    : 'mobile';
$group = isset($data['group']) && in_array($data['group'], ['A', 'B', 'C']) ? $data['group'] : 'A';

// Anonymized daily visitor fingerprint: SHA256 of IP + User-Agent + Current Date (no raw IP stored)
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$visitorHash = hash('sha256', $ip . $ua . date('Y-m-d'));

// Today's date in Myanmar Time (UTC+6:30)
try {
    $tz = new DateTimeZone('Asia/Yangon');
    $now = new DateTime('now', $tz);
} catch (Exception $e) {
    $now = new DateTime('now');
}
$todayKey = $now->format('Y-m-d');
$hourKey = (int)$now->format('H');

// Default database structure
$db = [
    "summary" => [
        "totalPageviews" => 0,
        "uniqueVisitors" => 0,
        "firstRecorded" => $todayKey,
        "lastUpdated" => $now->format('Y-m-d H:i:s'),
        "devices" => [
            "mobile" => 0,
            "desktop" => 0,
            "tablet" => 0
        ],
        "groups" => [
            "A" => 0,
            "B" => 0
        ]
    ],
    "dailyHistory" => []
];

$lockFile = DATA_DIR . '/lock.tmp';
$fp = @fopen($lockFile, 'w+');
if ($fp && flock($fp, LOCK_EX)) {
    if (file_exists(DATA_FILE)) {
        $loaded = json_decode(@file_get_contents(DATA_FILE), true);
        if ($loaded && isset($loaded['summary'])) {
            $db = $loaded;
        }
    }

    // Initialize daily entry if not exists
    if (!isset($db['dailyHistory'][$todayKey])) {
        $db['dailyHistory'][$todayKey] = [
            "date" => $todayKey,
            "pageviews" => 0,
            "uniqueVisitors" => 0,
            "visitors" => [], // Temporary array of daily hashes to calculate unique visitors
            "devices" => [
                "mobile" => 0,
                "desktop" => 0,
                "tablet" => 0
            ],
            "groups" => [
                "A" => 0,
                "B" => 0
            ],
            "hours" => array_fill(0, 24, 0)
        ];
    }

    // Check unique visitor for today
    if (!isset($db['dailyHistory'][$todayKey]['visitors'])) {
        $db['dailyHistory'][$todayKey]['visitors'] = [];
    }

    if (!in_array($visitorHash, $db['dailyHistory'][$todayKey]['visitors'])) {
        $db['dailyHistory'][$todayKey]['visitors'][] = $visitorHash;
        $db['dailyHistory'][$todayKey]['uniqueVisitors']++;
        $db['summary']['uniqueVisitors']++;
    }

    // Limit visitor hash cache array to prevent runaway file size
    if (count($db['dailyHistory'][$todayKey]['visitors']) > 3000) {
        array_shift($db['dailyHistory'][$todayKey]['visitors']);
    }

    // Increment pageviews & device counts
    $db['dailyHistory'][$todayKey]['pageviews']++;
    $db['dailyHistory'][$todayKey]['devices'][$device]++;
    if (isset($db['dailyHistory'][$todayKey]['groups'][$group])) {
        $db['dailyHistory'][$todayKey]['groups'][$group]++;
    }
    if (isset($db['dailyHistory'][$todayKey]['hours'][$hourKey])) {
        $db['dailyHistory'][$todayKey]['hours'][$hourKey]++;
    }

    // Increment overall summary
    $db['summary']['totalPageviews']++;
    $db['summary']['devices'][$device]++;
    if (isset($db['summary']['groups'][$group])) {
        $db['summary']['groups'][$group]++;
    }
    $db['summary']['lastUpdated'] = $now->format('Y-m-d H:i:s');

    @file_put_contents(DATA_FILE, json_encode($db, JSON_PRETTY_PRINT));
    flock($fp, LOCK_UN);
    fclose($fp);
}

echo json_encode(["status" => "success"]);
