<?php
require_once __DIR__ . '/../models/LeavePolicyModel.php';
require_once __DIR__ . '/../core/Logger.php';

class LeavePolicyController {
    private $leavePolicyModel;

    public function __construct() {
        $this->leavePolicyModel = new LeavePolicyModel();
    }

    /**
     * Get all leave policies
     * GET /leave-policies
     */
    public function getAll() {
        try {
            Logger::info('Fetching all leave policies');
            $policies = $this->leavePolicyModel->getAll();
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $policies,
                'count' => count($policies)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch leave policies', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch leave policies',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get leave policy by ID
     * GET /leave-policies/{id}
     */
    public function getById($id) {
        try {
            Logger::info('Fetching leave policy by ID', ['id' => $id]);
            
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid leave policy ID provided', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid leave policy ID'
                ]);
                return;
            }
            
            $policy = $this->leavePolicyModel->getById($id);
            if ($policy) {
                Logger::info('Leave policy found', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'data' => $policy
                ]);
            } else {
                Logger::warning('Leave policy not found', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Leave policy not found'
                ]);
            }
        } catch (Exception $e) {
            Logger::error('Failed to fetch leave policy', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch leave policy',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create new leave policy
     * POST /leave-policies
     */
    public function create($data) {
        try {
            Logger::info('Creating new leave policy');
            
            // Validate required fields
            if (empty($data['type'])) {
                Logger::warning('Missing policy type');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Policy type is required'
                ]);
                return;
            }
            
            if (empty($data['name'])) {
                Logger::warning('Missing policy name');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Policy name is required'
                ]);
                return;
            }
            
            if (empty($data['max_days']) || !is_numeric($data['max_days']) || $data['max_days'] < 0) {
                Logger::warning('Missing or invalid max days', ['max_days' => $data['max_days']]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Valid maximum days is required'
                ]);
                return;
            }
            
            // Check if policy type already exists
            $existingPolicy = $this->leavePolicyModel->getByType($data['type']);
            if ($existingPolicy) {
                Logger::warning('Leave policy type already exists', ['type' => $data['type']]);
                http_response_code(409);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Leave policy type already exists'
                ]);
                return;
            }
            
            // Set default values
            if (!isset($data['description'])) {
                $data['description'] = '';
            }
            
            if (!isset($data['carry_over'])) {
                $data['carry_over'] = 0;
            }
            
            if (!isset($data['requires_approval'])) {
                $data['requires_approval'] = 1;
            }
            
            // Create leave policy
            $policyId = $this->leavePolicyModel->create($data);
            $policy = $this->leavePolicyModel->getById($policyId);
            
            Logger::info('Leave policy created successfully', ['id' => $policyId]);
            http_response_code(201);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Leave policy created successfully',
                'data' => $policy
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to create leave policy', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to create leave policy',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update leave policy
     * PUT /leave-policies/{id}
     */
    public function update($id, $data) {
        try {
            Logger::info('Updating leave policy', ['id' => $id]);
            
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid leave policy ID for update', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid leave policy ID'
                ]);
                return;
            }
            
            // Check if policy exists
            $existingPolicy = $this->leavePolicyModel->getById($id);
            if (!$existingPolicy) {
                Logger::warning('Leave policy not found for update', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Leave policy not found'
                ]);
                return;
            }
            
            // Validate fields
            if (isset($data['max_days']) && (!is_numeric($data['max_days']) || $data['max_days'] < 0)) {
                Logger::warning('Invalid max days', ['max_days' => $data['max_days']]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Valid maximum days is required'
                ]);
                return;
            }
            
            // Update leave policy
            $result = $this->leavePolicyModel->update($id, $data);
            
            if ($result) {
                // Get updated record
                $updatedPolicy = $this->leavePolicyModel->getById($id);
                Logger::info('Leave policy updated successfully', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Leave policy updated successfully',
                    'data' => $updatedPolicy
                ]);
            } else {
                Logger::error('Failed to update leave policy', ['id' => $id]);
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update leave policy'
                ]);
            }
        } catch (Exception $e) {
            Logger::error('Failed to update leave policy', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to update leave policy',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Delete leave policy
     * DELETE /leave-policies/{id}
     */
    public function delete($id) {
        try {
            Logger::info('Deleting leave policy', ['id' => $id]);
            
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid leave policy ID for deletion', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid leave policy ID'
                ]);
                return;
            }
            
            // Check if policy exists
            $existingPolicy = $this->leavePolicyModel->getById($id);
            if (!$existingPolicy) {
                Logger::warning('Leave policy not found for deletion', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Leave policy not found'
                ]);
                return;
            }
            
            // Delete leave policy
            $result = $this->leavePolicyModel->delete($id);
            
            if ($result) {
                Logger::info('Leave policy deleted successfully', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Leave policy deleted successfully'
                ]);
            } else {
                Logger::error('Failed to delete leave policy', ['id' => $id]);
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to delete leave policy'
                ]);
            }
        } catch (Exception $e) {
            Logger::error('Failed to delete leave policy', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete leave policy',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get default leave policies
     * GET /leave-policies/default
     */
    public function getDefault() {
        try {
            Logger::info('Fetching default leave policies');
            $policies = $this->leavePolicyModel->getDefaultPolicies();
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $policies,
                'count' => count($policies)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch default leave policies', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch default leave policies',
                'error' => $e->getMessage()
            ]);
        }
    }
}
?>