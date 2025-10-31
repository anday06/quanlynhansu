<?php
// Hosting-specific database configuration
define('DB_HOST', 'localhost');
define('DB_PORT', 3306);
define('DB_NAME', 'jcsucupp_hrm_system'); // Hosting database name
define('DB_USER', 'jcsucupp_hrm'); // Hosting database user
define('DB_PASS', 'T3st1ngHrm@2025'); // Hosting database password

try {
    // Connect to database
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    echo "Connected to hosting database successfully.\n";

    // Use the existing database
    $pdo->exec("USE " . DB_NAME);
    echo "Using database: " . DB_NAME . "\n";

    // Convert existing tables to use UTF8MB4 charset
    $tables = [
        'users', 'departments', 'positions', 'employees', 
        'attendance', 'leaves', 'performance_reviews', 
        'salary_adjustments', 'leave_policies'
    ];

    foreach ($tables as $table) {
        try {
            $pdo->exec("ALTER TABLE `$table` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            echo "Converted table `$table` to UTF8MB4 charset.\n";
        } catch (PDOException $e) {
            echo "Warning: Could not convert table `$table` - " . $e->getMessage() . "\n";
        }
    }

    // Fix existing data with corrupted Vietnamese characters
    // This is a workaround for data that was already corrupted
    
    // Fix departments
    $pdo->exec("UPDATE departments SET 
        description = 'Quản lý nhân sự và các vấn đề liên quan đến nhân viên' 
        WHERE id = 1");
        
    $pdo->exec("UPDATE departments SET 
        description = 'Phát triển và bảo trì hệ thống công nghệ thông tin' 
        WHERE id = 2");
        
    $pdo->exec("UPDATE departments SET 
        description = 'Quản lý tài chính và kế toán' 
        WHERE id = 3");
        
    $pdo->exec("UPDATE departments SET 
        description = 'Phát triển thương hiệu và chiến lược marketing' 
        WHERE id = 4");
        
    $pdo->exec("UPDATE departments SET 
        description = 'Quản lý hoạt động hàng ngày của công ty' 
        WHERE id = 5");
    
    echo "Fixed Vietnamese text in departments table.\n";

    // Fix positions
    $pdo->exec("UPDATE positions SET 
        description = 'Quản lý phòng ban' 
        WHERE id = 1");
        
    $pdo->exec("UPDATE positions SET 
        description = 'Nhân viên cấp cao' 
        WHERE id = 2");
        
    $pdo->exec("UPDATE positions SET 
        description = 'Nhân viên' 
        WHERE id = 3");
        
    $pdo->exec("UPDATE positions SET 
        description = 'Thực tập sinh' 
        WHERE id = 4");
    
    echo "Fixed Vietnamese text in positions table.\n";

    // Fix leave policies
    $pdo->exec("UPDATE leave_policies SET 
        name = 'Nghỉ phép năm',
        description = 'Nghỉ phép hàng năm cho nhân viên' 
        WHERE type = 'annual'");
        
    $pdo->exec("UPDATE leave_policies SET 
        name = 'Nghỉ ốm',
        description = 'Nghỉ phép do lý do sức khỏe' 
        WHERE type = 'sick'");
        
    $pdo->exec("UPDATE leave_policies SET 
        name = 'Nghỉ cá nhân',
        description = 'Nghỉ phép cho việc cá nhân' 
        WHERE type = 'personal'");
        
    $pdo->exec("UPDATE leave_policies SET 
        name = 'Nghỉ thai sản',
        description = 'Nghỉ thai sản cho nữ nhân viên' 
        WHERE type = 'maternity'");
        
    $pdo->exec("UPDATE leave_policies SET 
        name = 'Nghỉ chăm con nhỏ',
        description = 'Nghỉ chăm con nhỏ cho nam nhân viên' 
        WHERE type = 'paternity'");
    
    echo "Fixed Vietnamese text in leave_policies table.\n";

    // Set connection charset to UTF8MB4
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // Insert or update sample data with proper encoding
    try {
        // Insert sample salary adjustments with proper Vietnamese text
        $stmt = $pdo->prepare("INSERT INTO salary_adjustments (employee_id, type, amount, effective_date, reason, created_by) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([1, 'increase', 500000, '2024-01-01', 'Thưởng hiệu suất', 'Admin']);
        $stmt->execute([2, 'decrease', 300000, '2024-01-15', 'Vi phạm kỷ luật', 'Admin']);
        $stmt->execute([3, 'increase', 1000000, '2024-03-01', 'Thăng chức', 'Manager']);
        echo "Inserted sample salary adjustments with Vietnamese text.\n";
    } catch (PDOException $e) {
        echo "Note: Sample data may already exist.\n";
    }

    echo "Database encoding fix completed successfully for hosting environment!\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>