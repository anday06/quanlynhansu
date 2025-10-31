<?php
// Direct test of the dashboard API endpoint
$_GET['endpoint'] = '/dashboard/summary';
$_SERVER['REQUEST_METHOD'] = 'GET';

// Include the API file
include 'backend/api.php';
?>