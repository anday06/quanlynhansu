<?php
// Attendance routes
require_once __DIR__ . '/../controllers/AttendanceController.php';

$router->get('/attendance', function($router, $params) {
    $attendanceController = new AttendanceController();
    return $attendanceController->getAll();
});

$router->get('/attendance/employee/{id}', function($router, $params) {
    $attendanceController = new AttendanceController();
    return $attendanceController->getByEmployeeId($params[0]);
});

$router->post('/attendance/check-in', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $attendanceController = new AttendanceController();
    return $attendanceController->checkIn($input);
});

$router->post('/attendance/check-out', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $attendanceController = new AttendanceController();
    return $attendanceController->checkOut($input);
});

$router->post('/attendance/report', function($router, $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $attendanceController = new AttendanceController();
    return $attendanceController->getReport($input);
});

$router->delete('/attendance/{id}', function($router, $params) {
    $attendanceController = new AttendanceController();
    return $attendanceController->delete($params[0]);
});
?>