<?php
// Test database connection and show current departments
require_once 'backend/config.php';

echo "<h2>Database Connection Test</h2>\n";

try {
    // Test connection
    echo "<p>✓ Database connection successful</p>\n";
    
    // Check if departments table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'departments'");
    $tableExists = $stmt->fetch();
    
    if ($tableExists) {
        echo "<p>✓ Departments table exists</p>\n";
        
        // Get all departments
        $stmt = $pdo->query("SELECT * FROM departments ORDER BY id");
        $departments = $stmt->fetchAll();
        
        echo "<h3>Current Departments:</h3>\n";
        if (count($departments) > 0) {
            echo "<ul>\n";
            foreach ($departments as $dept) {
                echo "<li>ID: {$dept['id']} - Name: {$dept['name']} - Description: {$dept['description']}</li>\n";
            }
            echo "</ul>\n";
        } else {
            echo "<p>No departments found in database</p>\n";
        }
    } else {
        echo "<p>✗ Departments table does not exist</p>\n";
    }
} catch (Exception $e) {
    echo "<p>Error: " . $e->getMessage() . "</p>\n";
}
?>