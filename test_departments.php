<?php
// Test departments
require_once __DIR__ . '/backend/config.php';

try {
    // Test query
    $stmt = $pdo->query("SELECT * FROM departments");
    $departments = $stmt->fetchAll();
    
    echo "Database connection successful!\n";
    echo "Number of departments: " . count($departments) . "\n";
    echo "Departments list:\n";
    foreach ($departments as $dept) {
        echo "- ID: " . $dept['id'] . ", Name: " . $dept['name'] . "\n";
    }
    
    // Test specific department
    $stmt = $pdo->prepare("SELECT * FROM departments WHERE id = ?");
    $stmt->execute([5]);
    $department = $stmt->fetch();
    
    if ($department) {
        echo "\nDepartment with ID 5 exists:\n";
        echo "- ID: " . $department['id'] . ", Name: " . $department['name'] . "\n";
    } else {
        echo "\nDepartment with ID 5 does not exist\n";
    }
    
} catch (Exception $e) {
    echo "Database test failed: " . $e->getMessage() . "\n";
}
?>