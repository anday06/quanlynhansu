<?php
// Performance routes
require_once __DIR__ . '/../controllers/PerformanceController.php';

$router->get('/performance', function($router, $params) {
    $performanceController = new PerformanceController();
    return $performanceController->getAll();
});

$router->get('/performance/{id}', function($router, $params) {
    $performanceController = new PerformanceController();
    return $performanceController->getById($params[0]);
});

$router->get('/performance/employee/{id}', function($router, $params) {
    $performanceController = new PerformanceController();
    return $performanceController->getByEmployeeId($params[0]);
});

$router->post('/performance', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $performanceController = new PerformanceController();
    return $performanceController->create($input);
});

$router->put('/performance/{id}', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $performanceController = new PerformanceController();
    return $performanceController->update($params[0], $input);
});

$router->delete('/performance/{id}', function($router, $params) {
    $performanceController = new PerformanceController();
    return $performanceController->delete($params[0]);
});

$router->get('/performance/average/{id}', function($router, $params) {
    $performanceController = new PerformanceController();
    return $performanceController->getAverageRating($params[0]);
});

$router->post('/performance/top', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $performanceController = new PerformanceController();
    return $performanceController->getTopPerformers($input);
});
?>