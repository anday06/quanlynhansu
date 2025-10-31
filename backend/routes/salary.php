<?php
// Salary routes
require_once __DIR__ . '/../controllers/SalaryController.php';

$router->get('/salary', function($router, $params) {
    $controller = new SalaryController();
    return $controller->getAll();
});

$router->get('/salary/{id}', function($router, $params) {
    $controller = new SalaryController();
    return $controller->getById($params[0]);
});

$router->put('/salary/{id}', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $controller = new SalaryController();
    return $controller->update($params[0], $input);
});

$router->get('/salary/summary', function($router, $params) {
    $controller = new SalaryController();
    return $controller->summary();
});
?>