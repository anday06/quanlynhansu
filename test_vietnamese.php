<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kiểm tra hiển thị tiếng Việt</title>
</head>
<body>
    <h1>Kiểm tra hiển thị tiếng Việt</h1>
    <?php
    require_once 'backend/config.php';
    
    try {
        // Set UTF-8 encoding for the connection
        $pdo->exec("SET NAMES utf8mb4");
        
        // Select all leave policies
        $sql = "SELECT * FROM leave_policies ORDER BY id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $policies = $stmt->fetchAll();
        
        echo "<table border='1'>";
        echo "<tr><th>ID</th><th>Loại</th><th>Tên</th><th>Mô tả</th><th>Số ngày tối đa</th></tr>";
        
        foreach ($policies as $policy) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($policy['id']) . "</td>";
            echo "<td>" . htmlspecialchars($policy['type']) . "</td>";
            echo "<td>" . htmlspecialchars($policy['name']) . "</td>";
            echo "<td>" . htmlspecialchars($policy['description']) . "</td>";
            echo "<td>" . htmlspecialchars($policy['max_days']) . "</td>";
            echo "</tr>";
        }
        
        echo "</table>";
        
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
    ?>
</body>
</html>