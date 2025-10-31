<?php
require_once __DIR__ . '/../models/DepartmentModel.php';

class DepartmentController {
    private $departmentModel;

    public function __construct() {
        $this->departmentModel = new DepartmentModel();
    }

    public function getAll() {
        try {
            $departments = $this->departmentModel->getAll();
            http_response_code(200);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($departments, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to fetch departments'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function getById($id) {
        try {
            $department = $this->departmentModel->getById($id);
            if ($department) {
                http_response_code(200);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode($department, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'Department not found'], JSON_UNESCAPED_UNICODE);
            }
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to fetch department'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function create($data) {
        // Validate required fields
        if (empty($data['name'])) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Department name is required'], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $departmentId = $this->departmentModel->create($data);
            $department = $this->departmentModel->getById($departmentId);
            http_response_code(201);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($department, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to create department'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function update($id, $data) {
        // Check if department exists
        $existingDepartment = $this->departmentModel->getById($id);
        if (!$existingDepartment) {
            http_response_code(404);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Department not found'], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Validate required fields
        if (empty($data['name'])) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Department name is required'], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $updatedDepartment = $this->departmentModel->update($id, $data);
            http_response_code(200);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($updatedDepartment, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to update department'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function delete($id) {
        // Check if department exists
        $existingDepartment = $this->departmentModel->getById($id);
        if (!$existingDepartment) {
            http_response_code(404);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Department not found'], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $result = $this->departmentModel->delete($id);
            if ($result) {
                http_response_code(200);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['message' => 'Department deleted successfully'], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(500);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'Failed to delete department'], JSON_UNESCAPED_UNICODE);
            }
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to delete department'], JSON_UNESCAPED_UNICODE);
        }
    }
}