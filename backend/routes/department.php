<?php
// Department routes
require_once __DIR__ . '/../controllers/DepartmentController.php';

$router->get('/departments', function($router, $params) {
    $departmentController = new DepartmentController();
    return $departmentController->getAll();
});

$router->get('/departments/{id}', function($router, $params) {
    $departmentController = new DepartmentController();
    return $departmentController->getById($params[0]);
});

$router->post('/departments', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $departmentController = new DepartmentController();
    return $departmentController->create($input);
});

$router->put('/departments/{id}', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $departmentController = new DepartmentController();
    return $departmentController->update($params[0], $input);
});

$router->delete('/departments/{id}', function($router, $params) {
    $departmentController = new DepartmentController();
    return $departmentController->delete($params[0]);
});
?>