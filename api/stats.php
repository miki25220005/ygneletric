<?php
/**
 * Private Admin Analytics Data Provider
 * Accessible ONLY with the correct Admin PIN.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Pin");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

// Extract PIN from GET, Header, or POST body
$pin = $_GET['pin'] ?? $_SERVER['HTTP_X_ADMIN_PIN'] ?? '';
if (empty($pin) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $pin = $body['pin'] ?? '';
}

if ($pin !== ADMIN_PIN) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized: Incorrect Admin PIN"]);
    exit;
}

if (!file_exists(DATA_FILE)) {
    echo json_encode([
        "status" => "success",
        "summary" => [
            "totalPageviews" => 0,
            "uniqueVisitors" => 0,
            "devices" => ["mobile" => 0, "desktop" => 0, "tablet" => 0],
            "groups" => ["A" => 0, "B" => 0],
            "firstRecorded" => date('Y-m-d'),
            "lastUpdated" => date('Y-m-d H:i:s')
        ],
        "dailyHistory" => []
    ]);
    exit;
}

$raw = @file_get_contents(DATA_FILE);
$db = json_decode($raw, true);

if (!$db) {
    echo json_encode(["status" => "error", "message" => "Failed to read analytics database"]);
    exit;
}

// Strip internal visitor hashes before responding
if (isset($db['dailyHistory']) && is_array($db['dailyHistory'])) {
    foreach ($db['dailyHistory'] as &$day) {
        unset($day['visitors']);
    }
}

echo json_encode([
    "status" => "success",
    "summary" => $db['summary'] ?? [],
    "dailyHistory" => $db['dailyHistory'] ?? []
]);
