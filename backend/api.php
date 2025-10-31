<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include core components
require_once __DIR__ . '/core/Database.php';
require_once __DIR__ . '/core/Router.php';

// Create router instance
$router = new Router();

// Include routes
require_once __DIR__ . '/routes/auth.php';
require_once __DIR__ . '/routes/employee.php';
require_once __DIR__ . '/routes/department.php';
require_once __DIR__ . '/routes/position.php';
require_once __DIR__ . '/routes/attendance.php';
require_once __DIR__ . '/routes/leave.php';
require_once __DIR__ . '/routes/performance.php';
require_once __DIR__ . '/routes/dashboard.php';
require_once __DIR__ . '/routes/salary.php';
require_once __DIR__ . '/routes/salaryadjustment.php';
require_once __DIR__ . '/routes/leavepolicy.php';

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];

// Prefer explicit endpoint query parameter (helps with PHP built-in server routing)
if (isset($_GET['endpoint'])) {
    // Use provided endpoint (should start with '/'), e.g. /departments
    $path = $_GET['endpoint'];
    
    // Ensure path starts with '/'
    if ($path !== '' && $path[0] !== '/') {
        $path = '/' . $path;
    }
} else {
    $path = $_SERVER['REQUEST_URI'];
    
    // Clean up the path from query string or base path
    $path = parse_url($path, PHP_URL_PATH);
    
    // Remove base path if exists
    $basePath = '/backend/api.php';
    if (strpos($path, $basePath) === 0) {
        $path = substr($path, strlen($basePath));
    }
    
    // Add leading slash if missing
    if ($path !== '' && $path[0] !== '/') {
        $path = '/' . $path;
    }
}

// If path is still empty, use root path
if (empty($path)) {
    $path = '/';
}

// Resolve route
$routeHandler = $router->resolve($method, $path);

if ($routeHandler) {
    try {
        if (is_array($routeHandler)) {
            // Dynamic route with parameters
            $callback = $routeHandler[0];
            $params = $routeHandler[1];
            call_user_func($callback, $router, $params);
        } else {
            // Static route
            call_user_func($routeHandler, $router, []);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}