<?php
// Script to display leave policies data
require_once __DIR__ . '/backend/config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<h1>Leave Policies</h1>\n";

try {
    // Set UTF-8 encoding for the connection
    $pdo->exec("SET NAMES utf8mb4");
    
    // Select all leave policies
    $sql = "SELECT * FROM leave_policies ORDER BY id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $policies = $stmt->fetchAll();
    
    echo "<table border='1'>\n";
    echo "<tr><th>ID</th><th>Type</th><th>Name</th><th>Description</th><th>Max Days</th></tr>\n";
    
    foreach ($policies as $policy) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($policy['id']) . "</td>";
        echo "<td>" . htmlspecialchars($policy['type']) . "</td>";
        echo "<td>" . htmlspecialchars($policy['name']) . "</td>";
        echo "<td>" . htmlspecialchars($policy['description']) . "</td>";
        echo "<td>" . htmlspecialchars($policy['max_days']) . "</td>";
        echo "</tr>\n";
    }
    
    echo "</table>\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>