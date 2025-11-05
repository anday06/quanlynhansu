<?php
// Fix database encoding for hosting environment
require_once __DIR__ . '/backend/config.php';

try {
    // Connect to database using existing config
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    echo "Connected to database successfully.\n";

    // Use the database
    $pdo->exec("USE " . DB_NAME);
    echo "Using database: " . DB_NAME . "\n";

    // Convert existing tables to use UTF8MB4 charset
    $tables = [
        'users', 'departments', 'positions', 'employees', 
        'attendance', 'leaves', 'performance_reviews', 
        'salary_adjustments', 'leave_policies'
    ];

    foreach ($tables as $table) {
        try {
            $pdo->exec("ALTER TABLE `$table` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            echo "Converted table `$table` to UTF8MB4 charset.\n";
        } catch (PDOException $e) {
            echo "Warning: Could not convert table `$table` - " . $e->getMessage() . "\n";
        }
    }

    // Set connection charset to UTF8MB4
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    echo "Database encoding fix completed successfully!\n";
    echo "Please refresh your application to see the changes.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>