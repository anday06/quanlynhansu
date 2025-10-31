<?php
// Dashboard summary route
require_once __DIR__ . '/../controllers/DashboardController.php';

$router->get('/dashboard/summary', function($router, $params) {
    $controller = new DashboardController();
    return $controller->summary();
});

?>
