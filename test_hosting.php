<?php
// Test file for hosting environment
require_once 'backend/config.php';

try {
    // Test database connection
    echo "Database Connection Test:\n";
    echo "Host: " . DB_HOST . "\n";
    echo "Database: " . DB_NAME . "\n";
    echo "User: " . DB_USER . "\n";
    
    // Simple query to test
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM departments");
    $result = $stmt->fetch();
    echo "Department count: " . $result['count'] . "\n";
    
    // Test UTF-8 encoding
    $stmt = $pdo->query("SHOW VARIABLES LIKE 'character_set_connection'");
    $result = $stmt->fetch();
    echo "Character set connection: " . $result['Value'] . "\n";
    
    $stmt = $pdo->query("SHOW VARIABLES LIKE 'collation_connection'");
    $result = $stmt->fetch();
    echo "Collation connection: " . $result['Value'] . "\n";
    
    echo "Test completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>