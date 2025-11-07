<?php
// Test employee JOIN queries
require_once __DIR__ . '/backend/config.php';

try {
    // Create PDO connection
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);
    
    echo "✅ Database connection successful!\n";
    
    // Test basic employee query
    echo "\n1. Testing basic employee query...\n";
    $stmt = $pdo->query("SELECT * FROM employees LIMIT 5");
    $employees = $stmt->fetchAll();
    echo "Found " . count($employees) . " employees\n";
    
    // Test JOIN query for employee with department and position
    echo "\n2. Testing JOIN query for employee details...\n";
    $stmt = $pdo->prepare("SELECT e.*, d.name as department_name, p.title as position_title 
                          FROM employees e 
                          LEFT JOIN departments d ON e.department_id = d.id 
                          LEFT JOIN positions p ON e.position_id = p.id 
                          WHERE e.id = ?");
    $stmt->execute([1]);
    $employee = $stmt->fetch();
    
    if ($employee) {
        echo "Employee found:\n";
        echo "  ID: " . $employee['id'] . "\n";
        echo "  Name: " . $employee['name'] . "\n";
        echo "  Department: " . ($employee['department_name'] ?? 'N/A') . "\n";
        echo "  Position: " . ($employee['position_title'] ?? 'N/A') . "\n";
        echo "  Salary: " . $employee['salary'] . "\n";
    } else {
        echo "No employee found with ID 1\n";
    }
    
    // Test search query with filters
    echo "\n3. Testing search query with filters...\n";
    $stmt = $pdo->prepare("SELECT e.*, d.name as department_name, p.title as position_title 
                          FROM employees e 
                          LEFT JOIN departments d ON e.department_id = d.id 
                          LEFT JOIN positions p ON e.position_id = p.id 
                          WHERE e.salary >= ? AND e.salary <= ? 
                          ORDER BY e.salary DESC");
    $stmt->execute([5000000, 20000000]);
    $employees = $stmt->fetchAll();
    echo "Found " . count($employees) . " employees with salary between 5,000,000 and 20,000,000\n";
    
    // Display first few results
    foreach (array_slice($employees, 0, 3) as $emp) {
        echo "  - " . $emp['name'] . " (" . ($emp['department_name'] ?? 'N/A') . " - " . ($emp['position_title'] ?? 'N/A') . "): " . $emp['salary'] . "\n";
    }
    
    echo "\n✅ All tests completed successfully!\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ General error: " . $e->getMessage() . "\n";
    exit(1);
}
?>