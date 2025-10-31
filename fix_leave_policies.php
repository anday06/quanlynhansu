<?php
// Script to fix leave policies data with proper UTF-8 encoding
require_once __DIR__ . '/backend/config.php';

echo "Fixing leave policies data with proper UTF-8 encoding...\n";

try {
    // Set UTF-8 encoding for the connection
    $pdo->exec("SET NAMES utf8mb4");
    
    // Update annual leave policy
    $sql = "UPDATE leave_policies SET name = ?, description = ? WHERE type = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Nghỉ phép năm', 'Nghỉ phép hàng năm cho nhân viên', 'annual']);
    echo "Updated annual leave policy\n";
    
    // Update sick leave policy
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Nghỉ ốm', 'Nghỉ phép do lý do sức khỏe', 'sick']);
    echo "Updated sick leave policy\n";
    
    // Update personal leave policy
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Nghỉ cá nhân', 'Nghỉ phép cho việc cá nhân', 'personal']);
    echo "Updated personal leave policy\n";
    
    // Update maternity leave policy
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Nghỉ thai sản', 'Nghỉ thai sản cho nữ nhân viên', 'maternity']);
    echo "Updated maternity leave policy\n";
    
    // Update paternity leave policy
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Nghỉ chăm con nhỏ', 'Nghỉ chăm con nhỏ cho nam nhân viên', 'paternity']);
    echo "Updated paternity leave policy\n";
    
    echo "All leave policies have been fixed!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>