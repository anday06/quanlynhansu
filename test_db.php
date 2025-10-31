<?php
// Test database connection and data
require_once __DIR__ . '/backend/config.php';

try {
    // Test departments table
    $sql = "SELECT COUNT(*) as count FROM departments";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch();
    
    echo "Database connection successful!\n";
    echo "Departments count: " . $result['count'] . "\n";
    
    // Test positions table
    $sql = "SELECT COUNT(*) as count FROM positions";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch();
    
    echo "Positions count: " . $result['count'] . "\n";
    
    // Test employees table
    $sql = "SELECT COUNT(*) as count FROM employees";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch();
    
    echo "Employees count: " . $result['count'] . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>