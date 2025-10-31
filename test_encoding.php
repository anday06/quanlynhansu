<?php
// Test script to check encoding
require_once __DIR__ . '/backend/config.php';

echo "Testing database encoding...\n";

try {
    // Test departments
    $sql = "SELECT * FROM departments WHERE name LIKE '%Nghỉ%'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $departments = $stmt->fetchAll();
    
    echo "Found " . count($departments) . " departments with 'Nghỉ' in name:\n";
    foreach ($departments as $dept) {
        echo "  ID: " . $dept['id'] . ", Name: " . $dept['name'] . "\n";
    }
    
    // Test positions
    $sql = "SELECT * FROM positions WHERE title LIKE '%Nghỉ%'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $positions = $stmt->fetchAll();
    
    echo "Found " . count($positions) . " positions with 'Nghỉ' in title:\n";
    foreach ($positions as $pos) {
        echo "  ID: " . $pos['id'] . ", Title: " . $pos['title'] . "\n";
    }
    
    echo "Test completed.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>