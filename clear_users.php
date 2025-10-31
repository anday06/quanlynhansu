<?php
// Clear all users from the database
require_once __DIR__ . '/backend/config.php';

try {
    // Clear all users
    $sql = "DELETE FROM users";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    echo "All users have been deleted successfully!\n";
    echo "You can now register new users.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>