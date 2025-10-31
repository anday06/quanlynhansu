<?php
// Test API endpoints
require_once __DIR__ . '/backend/config.php';

try {
    // Test departments endpoint
    echo "Testing departments endpoint...\n";
    $stmt = $pdo->prepare("SELECT * FROM departments");
    $stmt->execute();
    $departments = $stmt->fetchAll();
    
    echo "Departments:\n";
    foreach ($departments as $dept) {
        echo "  ID: {$dept['id']}, Name: {$dept['name']}, Description: {$dept['description']}\n";
    }
    
    // Test positions endpoint
    echo "\nTesting positions endpoint...\n";
    $stmt = $pdo->prepare("SELECT * FROM positions");
    $stmt->execute();
    $positions = $stmt->fetchAll();
    
    echo "Positions:\n";
    foreach ($positions as $pos) {
        echo "  ID: {$pos['id']}, Title: {$pos['title']}, Description: {$pos['description']}\n";
    }
    
    echo "\nDatabase connection and data retrieval working correctly!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>