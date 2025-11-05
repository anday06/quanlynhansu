<?php
/**
 * Deployment fix script for hosting environment
 * This script should be run after deploying to hosting to fix common issues
 */

echo "Starting hosting deployment fix...\n";

// 1. Fix database encoding
echo "1. Fixing database encoding...\n";
include_once 'fix_hosting_db_encoding.php';

// 2. Initialize database if needed
echo "2. Initializing database...\n";
try {
    // Connect to database using existing config
    require_once __DIR__ . '/backend/config.php';
    
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    // Check if tables exist, if not create them
    $tables = $pdo->query("SHOW TABLES LIKE 'departments'")->fetchAll();
    if (count($tables) == 0) {
        echo "Creating database tables...\n";
        // Read and execute init.sql
        $initSql = file_get_contents(__DIR__ . '/init.sql');
        if ($initSql) {
            $pdo->exec($initSql);
            echo "Database tables created successfully.\n";
        } else {
            echo "Warning: Could not read init.sql file.\n";
        }
    } else {
        echo "Database tables already exist.\n";
    }
} catch (PDOException $e) {
    echo "Warning: Database initialization failed - " . $e->getMessage() . "\n";
}

// 3. Fix Vietnamese text encoding
echo "3. Fixing Vietnamese text encoding...\n";
include_once 'fix_hosting_encoding.php';

echo "Deployment fix completed!\n";
echo "Please refresh your application to see the changes.\n";
?>