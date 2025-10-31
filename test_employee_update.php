<?php
// Direct test of the employee update API endpoint
$_GET['endpoint'] = '/employees/1';
$_SERVER['REQUEST_METHOD'] = 'PUT';

// Mock the input data
$inputData = [
    'name' => 'John Doe Updated',
    'email' => 'john.updated@example.com',
    'department_id' => 1,
    'position_id' => 2,
    'salary' => 5000000,
    'hire_date' => '2025-01-15'
];

// Set the input data
$originalInput = file_get_contents('php://input');
file_put_contents('php://input', json_encode($inputData));

// Include the API file
include 'backend/api.php';

// Restore original input
file_put_contents('php://input', $originalInput);
?>