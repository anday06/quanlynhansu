<?php
// Direct test of the positions API endpoint
$_GET['endpoint'] = '/positions';
$_SERVER['REQUEST_METHOD'] = 'GET';

// Include the API file
include 'backend/api.php';
?>