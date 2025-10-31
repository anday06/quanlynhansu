<?php
// Reinitialize data with proper UTF-8 encoding
require_once __DIR__ . '/backend/config.php';

try {
    // Truncate tables first
    echo "Truncating tables...\n";
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("TRUNCATE TABLE departments");
    $pdo->exec("TRUNCATE TABLE positions");
    $pdo->exec("TRUNCATE TABLE leave_policies");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    
    echo "Inserting fresh data with proper UTF-8 encoding...\n";
    
    // Insert departments
    $stmt = $pdo->prepare("INSERT INTO departments (id, name, description) VALUES (?, ?, ?)");
    $departments = [
        [1, 'IT', 'Bộ phận công nghệ thông tin'],
        [2, 'Marketing', 'Bộ phận marketing'],
        [3, 'Nhân Sự', 'Bộ phận nhân sự'],
        [4, 'Tài Chính', 'Bộ phận tài chính']
    ];
    
    foreach ($departments as $dept) {
        $stmt->execute($dept);
        echo "  Inserted department: {$dept[1]}\n";
    }
    
    // Insert positions
    $stmt = $pdo->prepare("INSERT INTO positions (id, title, description) VALUES (?, ?, ?)");
    $positions = [
        [1, 'Giám đốc', 'Quản lý phòng ban'],
        [2, 'Manager', 'Quản lý'],
        [3, 'Designer', 'Thiết kế viên'],
        [4, 'Accountant', 'Kế toán viên'],
        [9, 'Lập Trình Full-Stack', 'IT'],
        [10, 'Nhân Viên', ''],
        [11, 'Thực Tập', '']
    ];
    
    foreach ($positions as $pos) {
        $stmt->execute($pos);
        echo "  Inserted position: {$pos[1]}\n";
    }
    
    // Insert leave policies
    $stmt = $pdo->prepare("INSERT INTO leave_policies (type, name, description, max_days, carry_over, requires_approval, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $leavePolicies = [
        ['annual', 'Nghỉ phép năm', 'Nghỉ phép hàng năm cho nhân viên', 12, 1, 1, 1],
        ['sick', 'Nghỉ ốm', 'Nghỉ phép do lý do sức khỏe', 10, 0, 1, 1],
        ['personal', 'Nghỉ cá nhân', 'Nghỉ phép cho việc cá nhân', 5, 0, 1, 1],
        ['maternity', 'Nghỉ thai sản', 'Nghỉ thai sản cho nữ nhân viên', 90, 0, 1, 1],
        ['paternity', 'Nghỉ chăm con nhỏ', 'Nghỉ chăm con nhỏ cho nam nhân viên', 5, 0, 1, 1]
    ];
    
    foreach ($leavePolicies as $policy) {
        $stmt->execute($policy);
        echo "  Inserted leave policy: {$policy[1]}\n";
    }
    
    echo "Data reinitialization completed successfully!\n";
    echo "All data is now properly encoded in UTF-8.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>