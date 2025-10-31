<?php
require_once 'backend/config.php';

try {
    // Connect to database
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    echo "Connected to database successfully.\n";

    // Drop existing database
    $pdo->exec("DROP DATABASE IF EXISTS hrm_system");
    echo "Dropped existing database.\n";

    // Create database with proper charset
    $pdo->exec("CREATE DATABASE hrm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE hrm_system");
    echo "Created database with UTF8MB4 charset.\n";

    // Recreate all tables with proper charset
    $tablesSql = "
        -- Create users table
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        -- Create departments table
        CREATE TABLE IF NOT EXISTS departments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        -- Create positions table
        CREATE TABLE IF NOT EXISTS positions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description TEXT,
            salary_base DECIMAL(10, 2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        -- Create employees table
        CREATE TABLE IF NOT EXISTS employees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            department_id INT,
            position_id INT,
            salary DECIMAL(10, 2) DEFAULT 0.00,
            hire_date DATE NOT NULL,
            email VARCHAR(100),
            address TEXT,
            bonus DECIMAL(10, 2) DEFAULT 0.00,
            deduction DECIMAL(10, 2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
            FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        -- Create attendance table
        CREATE TABLE IF NOT EXISTS attendance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            employee_id INT NOT NULL,
            date DATE NOT NULL,
            check_in TIME,
            check_out TIME,
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
            UNIQUE KEY unique_employee_date (employee_id, date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        -- Create leaves table
        CREATE TABLE IF NOT EXISTS leaves (
            id INT AUTO_INCREMENT PRIMARY KEY,
            employee_id INT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            type ENUM('annual', 'sick', 'personal', 'maternity', 'paternity') DEFAULT 'annual',
            status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            reason TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        -- Create performance_reviews table
        CREATE TABLE IF NOT EXISTS performance_reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            employee_id INT NOT NULL,
            date DATE NOT NULL,
            rating INT CHECK (rating >= 1 AND rating <= 5),
            feedback TEXT,
            reviewer VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        -- Create salary_adjustments table
        CREATE TABLE IF NOT EXISTS salary_adjustments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            employee_id INT NOT NULL,
            type ENUM('increase', 'decrease') NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            effective_date DATE NOT NULL,
            reason TEXT NOT NULL,
            created_by VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        -- Create leave_policies table
        CREATE TABLE IF NOT EXISTS leave_policies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(50) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            max_days INT NOT NULL,
            carry_over BOOLEAN DEFAULT FALSE,
            requires_approval BOOLEAN DEFAULT TRUE,
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";

    $pdo->exec($tablesSql);
    echo "Recreated all tables with UTF8MB4 charset.\n";

    // Insert default data
    $insertDataSql = "
        -- Insert default departments
        INSERT INTO departments (id, name, description) VALUES
        (1, 'Human Resources', 'Quản lý nhân sự và các vấn đề liên quan đến nhân viên'),
        (2, 'Information Technology', 'Phát triển và bảo trì hệ thống công nghệ thông tin'),
        (3, 'Finance', 'Quản lý tài chính và kế toán'),
        (4, 'Marketing', 'Phát triển thương hiệu và chiến lược marketing'),
        (5, 'Operations', 'Quản lý hoạt động hàng ngày của công ty');

        -- Insert default positions
        INSERT INTO positions (id, title, description, salary_base) VALUES
        (1, 'Manager', 'Quản lý phòng ban', 15000000),
        (2, 'Senior Staff', 'Nhân viên cấp cao', 12000000),
        (3, 'Staff', 'Nhân viên', 8000000),
        (4, 'Intern', 'Thực tập sinh', 3000000);

        -- Insert default users
        INSERT INTO users (username, email, password) VALUES
        ('admin', 'admin@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: password

        -- Insert default leave policies
        INSERT INTO leave_policies (type, name, description, max_days, carry_over, requires_approval, is_default) VALUES
        ('annual', 'Nghỉ phép năm', 'Nghỉ phép hàng năm cho nhân viên', 12, TRUE, TRUE, TRUE),
        ('sick', 'Nghỉ ốm', 'Nghỉ phép do lý do sức khỏe', 10, FALSE, TRUE, TRUE),
        ('personal', 'Nghỉ cá nhân', 'Nghỉ phép cho việc cá nhân', 5, FALSE, TRUE, TRUE),
        ('maternity', 'Nghỉ thai sản', 'Nghỉ thai sản cho nữ nhân viên', 90, FALSE, TRUE, TRUE),
        ('paternity', 'Nghỉ chăm con nhỏ', 'Nghỉ chăm con nhỏ cho nam nhân viên', 5, FALSE, TRUE, TRUE);

        -- Insert sample employees
        INSERT INTO employees (id, name, department_id, position_id, salary, hire_date, email, address) VALUES
        (1, 'John Doe', 1, 1, 15000000, '2023-01-01', 'john.doe@example.com', '123 Main St, City'),
        (2, 'Jane Smith', 2, 2, 12000000, '2023-02-01', 'jane.smith@example.com', '456 Oak Ave, Town'),
        (3, 'Alice Johnson', 1, 3, 8000000, '2023-03-01', 'alice.johnson@example.com', '789 Pine Rd, Village'),
        (4, 'Bob Brown', 2, 1, 15000000, '2023-04-01', 'bob.brown@example.com', '321 Elm St, City'),
        (5, 'Charlie Davis', 1, 2, 12000000, '2023-05-01', 'charlie.davis@example.com', '654 Maple Dr, Town');

        -- Insert sample salary adjustments
        INSERT INTO salary_adjustments (employee_id, type, amount, effective_date, reason, created_by) VALUES
        (1, 'increase', 500000, '2024-01-01', 'Thưởng hiệu suất', 'Admin'),
        (2, 'decrease', 300000, '2024-01-15', 'Vi phạm kỷ luật', 'Admin'),
        (3, 'increase', 1000000, '2024-03-01', 'Thăng chức', 'Manager');
    ";

    $pdo->exec($insertDataSql);
    echo "Inserted default data with Vietnamese characters.\n";

    echo "Database reset and reinitialized successfully with UTF8MB4 charset!\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>