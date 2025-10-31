<?php
// Leave routes
require_once __DIR__ . '/../controllers/LeaveController.php';

$router->get('/leaves', function($router, $params) {
    $leaveController = new LeaveController();
    return $leaveController->getAll();
});

$router->get('/leaves/{id}', function($router, $params) {
    $leaveController = new LeaveController();
    return $leaveController->getById($params[0]);
});

$router->get('/leaves/employee/{id}', function($router, $params) {
    $leaveController = new LeaveController();
    return $leaveController->getByEmployeeId($params[0]);
});

$router->post('/leaves', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $leaveController = new LeaveController();
    return $leaveController->create($input);
});

$router->put('/leaves/{id}', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $leaveController = new LeaveController();
    return $leaveController->update($params[0], $input);
});

$router->put('/leaves/{id}/status', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $leaveController = new LeaveController();
    return $leaveController->updateStatus($params[0], $input);
});

$router->delete('/leaves/{id}', function($router, $params) {
    $leaveController = new LeaveController();
    return $leaveController->delete($params[0]);
});

$router->get('/leaves/balance/{id}', function($router, $params) {
    $leaveController = new LeaveController();
    return $leaveController->getLeaveBalance($params[0]);
});
?>