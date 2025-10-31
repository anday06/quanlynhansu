<?php
// Employee routes
require_once __DIR__ . '/../controllers/EmployeeController.php';

$router->get('/employees', function($router, $params) {
    $employeeController = new EmployeeController();
    return $employeeController->getAll();
});

$router->get('/employees/{id}', function($router, $params) {
    $employeeController = new EmployeeController();
    return $employeeController->getById($params[0]);
});

$router->post('/employees', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $employeeController = new EmployeeController();
    return $employeeController->create($input);
});

$router->put('/employees/{id}', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $employeeController = new EmployeeController();
    return $employeeController->update($params[0], $input);
});

$router->delete('/employees/{id}', function($router, $params) {
    $employeeController = new EmployeeController();
    return $employeeController->delete($params[0]);
});

$router->get('/employees/search', function($router, $params) {
    $filters = $_GET;
    $employeeController = new EmployeeController();
    return $employeeController->search($filters);
});
?>