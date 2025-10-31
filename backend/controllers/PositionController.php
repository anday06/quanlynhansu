<?php
require_once __DIR__ . '/../models/PositionModel.php';

class PositionController {
    private $positionModel;

    public function __construct() {
        $this->positionModel = new PositionModel();
    }

    public function getAll() {
        try {
            $positions = $this->positionModel->getAll();
            http_response_code(200);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($positions, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to fetch positions'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function getById($id) {
        try {
            $position = $this->positionModel->getById($id);
            if ($position) {
                http_response_code(200);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode($position, JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(404);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'Position not found'], JSON_UNESCAPED_UNICODE);
            }
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to fetch position'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function create($data) {
        // Validate required fields
        if (empty($data['title'])) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Position title is required'], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $positionId = $this->positionModel->create($data);
            $position = $this->positionModel->getById($positionId);
            http_response_code(201);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($position, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to create position'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function update($id, $data) {
        // Check if position exists
        $existingPosition = $this->positionModel->getById($id);
        if (!$existingPosition) {
            http_response_code(404);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Position not found'], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Validate required fields
        if (empty($data['title'])) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Position title is required'], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $updatedPosition = $this->positionModel->update($id, $data);
            http_response_code(200);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($updatedPosition, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to update position'], JSON_UNESCAPED_UNICODE);
        }
    }

    public function delete($id) {
        // Check if position exists
        $existingPosition = $this->positionModel->getById($id);
        if (!$existingPosition) {
            http_response_code(404);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Position not found'], JSON_UNESCAPED_UNICODE);
            return;
        }

        try {
            $result = $this->positionModel->delete($id);
            if ($result) {
                http_response_code(200);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['message' => 'Position deleted successfully'], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(500);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'Failed to delete position'], JSON_UNESCAPED_UNICODE);
            }
        } catch (Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Failed to delete position'], JSON_UNESCAPED_UNICODE);
        }
    }
}