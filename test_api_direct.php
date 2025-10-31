<?php
// Direct test of the departments API endpoint
$_GET['endpoint'] = '/departments';
$_SERVER['REQUEST_METHOD'] = 'GET';

// Include the API file
include 'backend/api.php';
?>