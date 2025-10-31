<?php
require_once __DIR__ . '/../models/SalaryAdjustmentModel.php';
require_once __DIR__ . '/../core/Logger.php';

class SalaryAdjustmentController {
    private $salaryAdjustmentModel;

    public function __construct() {
        $this->salaryAdjustmentModel = new SalaryAdjustmentModel();
    }

    /**
     * Get all salary adjustments
     * GET /salary-adjustments
     */
    public function getAll() {
        try {
            Logger::info('Fetching all salary adjustments');
            $adjustments = $this->salaryAdjustmentModel->getAll();
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $adjustments,
                'count' => count($adjustments)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch salary adjustments', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch salary adjustments',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get salary adjustment by ID
     * GET /salary-adjustments/{id}
     */
    public function getById($id) {
        try {
            Logger::info('Fetching salary adjustment by ID', ['id' => $id]);
            
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid salary adjustment ID provided', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid salary adjustment ID'
                ]);
                return;
            }
            
            $adjustment = $this->salaryAdjustmentModel->getById($id);
            if ($adjustment) {
                Logger::info('Salary adjustment found', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'data' => $adjustment
                ]);
            } else {
                Logger::warning('Salary adjustment not found', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Salary adjustment not found'
                ]);
            }
        } catch (Exception $e) {
            Logger::error('Failed to fetch salary adjustment', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch salary adjustment',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get salary adjustments by employee ID
     * GET /salary-adjustments/employee/{id}
     */
    public function getByEmployeeId($id) {
        try {
            Logger::info('Fetching salary adjustments by employee ID', ['employee_id' => $id]);
            
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid employee ID provided', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid employee ID'
                ]);
                return;
            }
            
            $adjustments = $this->salaryAdjustmentModel->getByEmployeeId($id);
            Logger::info('Salary adjustments found', ['employee_id' => $id, 'count' => count($adjustments)]);
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $adjustments,
                'count' => count($adjustments)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch salary adjustments by employee ID', ['employee_id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch salary adjustments',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create new salary adjustment
     * POST /salary-adjustments
     */
    public function create($data) {
        try {
            Logger::info('Creating new salary adjustment');
            
            // Validate required fields
            if (empty($data['employee_id']) || !is_numeric($data['employee_id'])) {
                Logger::warning('Missing or invalid employee ID');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Valid employee ID is required'
                ]);
                return;
            }
            
            if (empty($data['type']) || !in_array($data['type'], ['increase', 'decrease'])) {
                Logger::warning('Missing or invalid adjustment type', ['type' => $data['type']]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Valid adjustment type (increase/decrease) is required'
                ]);
                return;
            }
            
            if (empty($data['amount']) || !is_numeric($data['amount']) || $data['amount'] <= 0) {
                Logger::warning('Missing or invalid adjustment amount', ['amount' => $data['amount']]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Valid adjustment amount is required'
                ]);
                return;
            }
            
            if (empty($data['effective_date'])) {
                Logger::warning('Missing effective date');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Effective date is required'
                ]);
                return;
            }
            
            if (empty($data['reason'])) {
                Logger::warning('Missing reason');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Reason is required'
                ]);
                return;
            }
            
            // Set default created_by if not provided
            if (empty($data['created_by'])) {
                $data['created_by'] = 'Admin';
            }
            
            // Create salary adjustment
            $adjustmentId = $this->salaryAdjustmentModel->create($data);
            $adjustment = $this->salaryAdjustmentModel->getById($adjustmentId);
            
            Logger::info('Salary adjustment created successfully', ['id' => $adjustmentId]);
            http_response_code(201);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Salary adjustment created successfully',
                'data' => $adjustment
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to create salary adjustment', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to create salary adjustment',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update salary adjustment
     * PUT /salary-adjustments/{id}
     */
    public function update($id, $data) {
        try {
            Logger::info('Updating salary adjustment', ['id' => $id]);
            
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid salary adjustment ID for update', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid salary adjustment ID'
                ]);
                return;
            }
            
            // Check if adjustment exists
            $existingAdjustment = $this->salaryAdjustmentModel->getById($id);
            if (!$existingAdjustment) {
                Logger::warning('Salary adjustment not found for update', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Salary adjustment not found'
                ]);
                return;
            }
            
            // Validate fields (similar to create)
            if (isset($data['employee_id']) && !is_numeric($data['employee_id'])) {
                Logger::warning('Invalid employee ID', ['employee_id' => $data['employee_id']]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Valid employee ID is required'
                ]);
                return;
            }
            
            if (isset($data['type']) && !in_array($data['type'], ['increase', 'decrease'])) {
                Logger::warning('Invalid adjustment type', ['type' => $data['type']]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Valid adjustment type (increase/decrease) is required'
                ]);
                return;
            }
            
            if (isset($data['amount']) && (!is_numeric($data['amount']) || $data['amount'] <= 0)) {
                Logger::warning('Invalid adjustment amount', ['amount' => $data['amount']]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Valid adjustment amount is required'
                ]);
                return;
            }
            
            // Update salary adjustment
            $result = $this->salaryAdjustmentModel->update($id, $data);
            
            if ($result) {
                // Get updated record
                $updatedAdjustment = $this->salaryAdjustmentModel->getById($id);
                Logger::info('Salary adjustment updated successfully', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Salary adjustment updated successfully',
                    'data' => $updatedAdjustment
                ]);
            } else {
                Logger::error('Failed to update salary adjustment', ['id' => $id]);
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update salary adjustment'
                ]);
            }
        } catch (Exception $e) {
            Logger::error('Failed to update salary adjustment', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to update salary adjustment',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Delete salary adjustment
     * DELETE /salary-adjustments/{id}
     */
    public function delete($id) {
        try {
            Logger::info('Deleting salary adjustment', ['id' => $id]);
            
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid salary adjustment ID for deletion', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid salary adjustment ID'
                ]);
                return;
            }
            
            // Check if adjustment exists
            $existingAdjustment = $this->salaryAdjustmentModel->getById($id);
            if (!$existingAdjustment) {
                Logger::warning('Salary adjustment not found for deletion', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Salary adjustment not found'
                ]);
                return;
            }
            
            // Delete salary adjustment
            $result = $this->salaryAdjustmentModel->delete($id);
            
            if ($result) {
                Logger::info('Salary adjustment deleted successfully', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Salary adjustment deleted successfully'
                ]);
            } else {
                Logger::error('Failed to delete salary adjustment', ['id' => $id]);
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to delete salary adjustment'
                ]);
            }
        } catch (Exception $e) {
            Logger::error('Failed to delete salary adjustment', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete salary adjustment',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get salary adjustment history summary
     * GET /salary-adjustments/summary
     */
    public function summary() {
        try {
            Logger::info('Generating salary adjustment history summary');
            $summary = $this->salaryAdjustmentModel->getHistorySummary();
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $summary
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to generate salary adjustment history summary', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to generate salary adjustment history summary',
                'error' => $e->getMessage()
            ]);
        }
    }
}
?>