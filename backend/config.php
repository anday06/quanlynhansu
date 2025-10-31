<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_PORT', 3306);
define('DB_NAME', 'hrm_system');
define('DB_USER', 'root');
define('DB_PASS', '');

// JWT Secret for authentication
define('JWT_SECRET', 'hrm_system_secret_key_2025');

// Application settings
define('APP_ENV', 'development'); // development, production
define('LOG_QUERIES', true);
define('DEBUG_MODE', true);

// Security settings
define('ALLOWED_ORIGINS', [
    'http://localhost',
    'http://localhost:8000',
    'http://127.0.0.1',
    'http://127.0.0.1:8000'
]);

// Create PDO connection
try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_PERSISTENT => true, // Persistent connections
    ]);
    
    // Set timezone
    $pdo->exec("SET time_zone = '+07:00'");
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    die("Connection failed: " . $e->getMessage());
}

// Security headers
if (APP_ENV === 'production') {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
}
?>