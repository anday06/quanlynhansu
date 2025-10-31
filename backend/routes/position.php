<?php
// Position routes
require_once __DIR__ . '/../controllers/PositionController.php';

$router->get('/positions', function($router, $params) {
    $positionController = new PositionController();
    return $positionController->getAll();
});

$router->get('/positions/{id}', function($router, $params) {
    $positionController = new PositionController();
    return $positionController->getById($params[0]);
});

$router->post('/positions', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $positionController = new PositionController();
    return $positionController->create($input);
});

$router->put('/positions/{id}', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $positionController = new PositionController();
    return $positionController->update($params[0], $input);
});

$router->delete('/positions/{id}', function($router, $params) {
    $positionController = new PositionController();
    return $positionController->delete($params[0]);
});
?>