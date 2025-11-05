<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_PORT', 3306);
define('DB_NAME', 'jcsucupp_hanhne');
define('DB_USER', 'jcsucupp_hanhne');
define('DB_PASS', 'CAdfeaNQmYnccwPn4hJE');

// JWT Secret for authentication
define('JWT_SECRET', 'hrm_system_secret_key_2025');

// Application settings
define('APP_ENV', 'production'); // development, production
define('LOG_QUERIES', false);
define('DEBUG_MODE', false);

// Security settings
define('ALLOWED_ORIGINS', [
    'http://localhost',
    'http://localhost:8000',
    'http://127.0.0.1',
    'http://127.0.0.1:8000',
    // Add your hosting domain here
    'https://your-domain.123host.vn',
    'http://your-domain.123host.vn'
]);

// Create PDO connection
try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_PERSISTENT => true, // Persistent connections
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);
    
    // Set timezone
    $pdo->exec("SET time_zone = '+07:00'");
    
    // Ensure proper charset
    $pdo->exec("SET CHARACTER SET utf8mb4");
    $pdo->exec("SET SESSION collation_connection = 'utf8mb4_unicode_ci'");
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