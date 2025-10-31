<?php
// Script to fix Vietnamese encoding in leave_policies table
require_once __DIR__ . '/backend/config.php';

echo "Fixing Vietnamese encoding in leave_policies table...\n";

try {
    // Set UTF-8 encoding for the connection
    $pdo->exec("SET NAMES utf8mb4");
    
    // Update leave policies with correct Vietnamese text
    $policies = [
        1 => [
            'name' => 'Nghỉ phép năm',
            'description' => 'Nghỉ phép hàng năm cho nhân viên'
        ],
        2 => [
            'name' => 'Nghỉ ốm',
            'description' => 'Nghỉ phép do lý do sức khỏe'
        ],
        3 => [
            'name' => 'Nghỉ cá nhân',
            'description' => 'Nghỉ phép cho việc cá nhân'
        ],
        4 => [
            'name' => 'Nghỉ thai sản',
            'description' => 'Nghỉ thai sản cho nữ nhân viên'
        ],
        5 => [
            'name' => 'Nghỉ chăm con nhỏ',
            'description' => 'Nghỉ chăm con nhỏ cho nam nhân viên'
        ]
    ];
    
    foreach ($policies as $id => $policy) {
        $sql = "UPDATE leave_policies SET name = ?, description = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$policy['name'], $policy['description'], $id]);
        echo "Updated policy ID $id: {$policy['name']}\n";
    }
    
    echo "All leave policies have been updated with correct Vietnamese text!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>