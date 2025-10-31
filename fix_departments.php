<?php
// Script to fix department names with proper UTF-8 encoding
require_once __DIR__ . '/backend/config.php';

echo "Fixing department names with proper UTF-8 encoding...\n";

try {
    // Set UTF-8 encoding for the connection
    $pdo->exec("SET NAMES utf8mb4");
    
    // Update Marketing department
    $sql = "UPDATE departments SET name = ?, description = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Marketing', 'Phát triển thương hiệu và chiến lược marketing', 4]);
    echo "Updated Marketing department\n";
    
    // Update Test Department
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Test Department', 'Kiểm Tra', 9]);
    echo "Updated Test Department\n";
    
    // Update IT department
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['IT', 'Lập Trình', 18]);
    echo "Updated IT department\n";
    
    // Update Nhân Sự department
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['Nhân Sự', 'Quản lý nhân sự', 19]);
    echo "Updated Nhân Sự department\n";
    
    echo "All department names have been fixed!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>