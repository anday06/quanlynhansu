<?php
// Test script to verify departments and positions are properly loaded
require_once 'backend/config.php';

try {
    // Test departments
    $sql = "SELECT * FROM departments ORDER BY id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h2>Departments:</h2>\n";
    if (count($departments) > 0) {
        echo "<ul>\n";
        foreach ($departments as $dept) {
            echo "<li>ID: {$dept['id']}, Name: {$dept['name']}, Description: {$dept['description']}</li>\n";
        }
        echo "</ul>\n";
    } else {
        echo "<p>No departments found</p>\n";
    }
    
    // Test positions
    $sql = "SELECT * FROM positions ORDER BY id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $positions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h2>Positions:</h2>\n";
    if (count($positions) > 0) {
        echo "<ul>\n";
        foreach ($positions as $pos) {
            echo "<li>ID: {$pos['id']}, Title: {$pos['title']}, Description: {$pos['description']}, Salary Base: {$pos['salary_base']}</li>\n";
        }
        echo "</ul>\n";
    } else {
        echo "<p>No positions found</p>\n";
    }
    
    // Test employees with department and position names
    $sql = "SELECT e.*, d.name as department_name, p.title as position_title 
            FROM employees e 
            LEFT JOIN departments d ON e.department_id = d.id 
            LEFT JOIN positions p ON e.position_id = p.id 
            ORDER BY e.id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h2>Employees with Department and Position Info:</h2>\n";
    if (count($employees) > 0) {
        echo "<table border='1'>\n";
        echo "<tr><th>ID</th><th>Name</th><th>Department</th><th>Position</th><th>Salary</th><th>Hire Date</th></tr>\n";
        foreach ($employees as $emp) {
            $deptName = $emp['department_name'] ?? 'Không xác định';
            $posTitle = $emp['position_title'] ?? 'Không xác định';
            echo "<tr>";
            echo "<td>{$emp['id']}</td>";
            echo "<td>{$emp['name']}</td>";
            echo "<td>{$deptName}</td>";
            echo "<td>{$posTitle}</td>";
            echo "<td>" . number_format($emp['salary'], 0, ',', '.') . " ₫</td>";
            echo "<td>{$emp['hire_date']}</td>";
            echo "</tr>\n";
        }
        echo "</table>\n";
    } else {
        echo "<p>No employees found</p>\n";
    }
    
} catch (Exception $e) {
    echo "<p>Error: " . $e->getMessage() . "</p>\n";
}
?>