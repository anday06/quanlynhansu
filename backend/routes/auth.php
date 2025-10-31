<?php
// Auth routes
require_once __DIR__ . '/../controllers/AuthController.php';

$router->post('/auth/register', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $authController = new AuthController();
    return $authController->register($input);
});

$router->post('/auth/login', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $authController = new AuthController();
    return $authController->login($input);
});

$router->post('/auth/logout', function($router, $params) {
    $authController = new AuthController();
    return $authController->logout();
});
?>