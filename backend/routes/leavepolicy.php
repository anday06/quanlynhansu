<?php
// Leave Policy routes
require_once __DIR__ . '/../controllers/LeavePolicyController.php';

$router->get('/leave-policies', function($router, $params) {
    $controller = new LeavePolicyController();
    return $controller->getAll();
});

$router->get('/leave-policies/{id}', function($router, $params) {
    $controller = new LeavePolicyController();
    return $controller->getById($params[0]);
});

$router->post('/leave-policies', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $controller = new LeavePolicyController();
    return $controller->create($input);
});

$router->put('/leave-policies/{id}', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $controller = new LeavePolicyController();
    return $controller->update($params[0], $input);
});

$router->delete('/leave-policies/{id}', function($router, $params) {
    $controller = new LeavePolicyController();
    return $controller->delete($params[0]);
});

$router->get('/leave-policies/default', function($router, $params) {
    $controller = new LeavePolicyController();
    return $controller->getDefault();
});
?>