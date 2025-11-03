<?php
// Script to initialize departments and positions data for hosting environment
require_once 'backend/config.php';

try {
    // Check if departments exist, if not, insert them
    $sql = "SELECT COUNT(*) as count FROM departments";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result['count'] == 0) {
        echo "Inserting default departments...\n";
        
        $departments = [
            [1, 'Human Resources', 'Quản lý nhân sự và các vấn đề liên quan đến nhân viên'],
            [2, 'Information Technology', 'Phát triển và bảo trì hệ thống công nghệ thông tin'],
            [3, 'Finance', 'Quản lý tài chính và kế toán'],
            [4, 'Marketing', 'Phát triển thương hiệu và chiến lược marketing'],
            [5, 'Operations', 'Quản lý hoạt động hàng ngày của công ty']
        ];
        
        $sql = "INSERT INTO departments (id, name, description) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        foreach ($departments as $dept) {
            $stmt->execute($dept);
            echo "Inserted department: {$dept[1]}\n";
        }
    } else {
        echo "Departments already exist: {$result['count']} found\n";
    }
    
    // Check if positions exist, if not, insert them
    $sql = "SELECT COUNT(*) as count FROM positions";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result['count'] == 0) {
        echo "Inserting default positions...\n";
        
        $positions = [
            [1, 'Manager', 'Quản lý phòng ban', 15000000],
            [2, 'Senior Staff', 'Nhân viên cấp cao', 12000000],
            [3, 'Staff', 'Nhân viên', 8000000],
            [4, 'Intern', 'Thực tập sinh', 3000000]
        ];
        
        $sql = "INSERT INTO positions (id, title, description, salary_base) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        
        foreach ($positions as $pos) {
            $stmt->execute($pos);
            echo "Inserted position: {$pos[1]}\n";
        }
    } else {
        echo "Positions already exist: {$result['count']} found\n";
    }
    
    echo "Database initialization completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>