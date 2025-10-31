<?php
/**
 * Test Runner for HRM System
 * Run all unit tests for the application
 */

echo "=== HRM System Test Runner ===\n";
echo "Starting unit tests...\n\n";

// Test results tracking
$allTestsPassed = true;
$totalPassed = 0;
$totalFailed = 0;

// Run EmployeeModel tests
echo "1. Running EmployeeModel Tests...\n";
echo str_repeat("-", 40) . "\n";
require_once 'EmployeeModelTest.php';
$employeeTest = new EmployeeModelTest();
$employeeTestResult = $employeeTest->runAllTests();
if (!$employeeTestResult) {
    $allTestsPassed = false;
}
echo str_repeat("=", 50) . "\n\n";

// Summary
echo "=== FINAL TEST RESULTS ===\n";
if ($allTestsPassed) {
    echo "✓ ALL TESTS PASSED\n";
    echo "The application is working correctly.\n";
} else {
    echo "✗ SOME TESTS FAILED\n";
    echo "Please check the output above for details.\n";
}

echo "\nTest execution completed at " . date('Y-m-d H:i:s') . "\n";
?>