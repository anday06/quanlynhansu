<?php
// Script to fix encoding issues in the database
require_once __DIR__ . '/backend/config.php';

echo "Fixing encoding issues in the database...\n";

try {
    // Fix departments table
    $sql = "UPDATE departments SET name = CONVERT(BINARY name USING utf8mb4), description = CONVERT(BINARY description USING utf8mb4)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo "Fixed " . $stmt->rowCount() . " departments records\n";

    // Fix positions table
    $sql = "UPDATE positions SET title = CONVERT(BINARY title USING utf8mb4), description = CONVERT(BINARY description USING utf8mb4)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo "Fixed " . $stmt->rowCount() . " positions records\n";

    // Fix employees table
    $sql = "UPDATE employees SET name = CONVERT(BINARY name USING utf8mb4), email = CONVERT(BINARY email USING utf8mb4), address = CONVERT(BINARY address USING utf8mb4)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo "Fixed " . $stmt->rowCount() . " employees records\n";

    // Fix attendance table
    // No text fields to fix in this table

    // Fix leaves table
    $sql = "UPDATE leaves SET reason = CONVERT(BINARY reason USING utf8mb4)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo "Fixed " . $stmt->rowCount() . " leaves records\n";

    // Fix performance_reviews table
    $sql = "UPDATE performance_reviews SET feedback = CONVERT(BINARY feedback USING utf8mb4), reviewer = CONVERT(BINARY reviewer USING utf8mb4)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo "Fixed " . $stmt->rowCount() . " performance reviews records\n";

    // Fix salary_adjustments table
    $sql = "UPDATE salary_adjustments SET reason = CONVERT(BINARY reason USING utf8mb4), created_by = CONVERT(BINARY created_by USING utf8mb4)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo "Fixed " . $stmt->rowCount() . " salary adjustments records\n";

    // Fix leave_policies table
    $sql = "UPDATE leave_policies SET type = CONVERT(BINARY type USING utf8mb4), name = CONVERT(BINARY name USING utf8mb4), description = CONVERT(BINARY description USING utf8mb4)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo "Fixed " . $stmt->rowCount() . " leave policies records\n";

    // Fix users table
    $sql = "UPDATE users SET username = CONVERT(BINARY username USING utf8mb4), email = CONVERT(BINARY email USING utf8mb4)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    echo "Fixed " . $stmt->rowCount() . " users records\n";

    echo "All encoding issues have been fixed!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>