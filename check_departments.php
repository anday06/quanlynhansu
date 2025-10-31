<?php
require_once 'backend/config.php';

try {
    $stmt = $pdo->query("SELECT * FROM departments");
    $departments = $stmt->fetchAll();
    
    echo "Current departments in database:\n";
    foreach ($departments as $dept) {
        echo "ID: " . $dept['id'] . ", Name: " . $dept['name'] . ", Description: " . $dept['description'] . "\n";
    }
    
    if (empty($departments)) {
        echo "No departments found in database.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>