<?php
// Salary Adjustment routes
require_once __DIR__ . '/../controllers/SalaryAdjustmentController.php';

$router->get('/salary-adjustments', function($router, $params) {
    $controller = new SalaryAdjustmentController();
    return $controller->getAll();
});

$router->get('/salary-adjustments/{id}', function($router, $params) {
    $controller = new SalaryAdjustmentController();
    return $controller->getById($params[0]);
});

$router->get('/salary-adjustments/employee/{id}', function($router, $params) {
    $controller = new SalaryAdjustmentController();
    return $controller->getByEmployeeId($params[0]);
});

$router->post('/salary-adjustments', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $controller = new SalaryAdjustmentController();
    return $controller->create($input);
});

$router->put('/salary-adjustments/{id}', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $controller = new SalaryAdjustmentController();
    return $controller->update($params[0], $input);
});

$router->delete('/salary-adjustments/{id}', function($router, $params) {
    $controller = new SalaryAdjustmentController();
    return $controller->delete($params[0]);
});

$router->get('/salary-adjustments/summary', function($router, $params) {
    $controller = new SalaryAdjustmentController();
    return $controller->summary();
});
?>