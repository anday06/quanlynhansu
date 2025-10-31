<?php
require_once __DIR__ . '/../models/LeaveModel.php';
require_once __DIR__ . '/../core/Logger.php';

class LeaveController {
    private $leaveModel;

    public function __construct() {
        $this->leaveModel = new LeaveModel();
    }

    /**
     * Get all leave requests
     */
    public function getAll() {
        try {
            Logger::info('Fetching all leave requests');
            $leaves = $this->leaveModel->getAll();
            Logger::info('Successfully fetched leave requests', ['count' => count($leaves)]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $leaves,
                'count' => count($leaves)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch leave requests', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch leave requests',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get leave request by ID
     * @param int $id
     */
    public function getById($id) {
        try {
            Logger::info('Fetching leave request by ID', ['id' => $id]);
            
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid leave ID provided', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid leave ID'
                ]);
                return;
            }
            
            $leave = $this->leaveModel->getById($id);
            if ($leave) {
                Logger::info('Leave request found', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'data' => $leave
                ]);
            } else {
                Logger::warning('Leave request not found', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Leave request not found'
                ]);
            }
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in get leave', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch leave request', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch leave request',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get leave requests by employee ID
     * @param int $employeeId
     */
    public function getByEmployeeId($employeeId) {
        try {
            Logger::info('Fetching leave requests by employee ID', ['employee_id' => $employeeId]);
            
            if (!is_numeric($employeeId) || $employeeId <= 0) {
                Logger::warning('Invalid employee ID provided', ['employee_id' => $employeeId]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid employee ID'
                ]);
                return;
            }
            
            $leaves = $this->leaveModel->getByEmployeeId($employeeId);
            Logger::info('Successfully fetched leave requests', ['employee_id' => $employeeId, 'count' => count($leaves)]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $leaves,
                'count' => count($leaves)
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in get leave by employee', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch leave requests by employee ID', [
                'employee_id' => $employeeId, 
                'error' => $e->getMessage()
            ]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch leave requests',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create new leave request
     */
    public function create($data) {
        try {
            Logger::info('Creating new leave request', [
                'employee_id' => $data['employee_id'] ?? null
            ]);
            
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['start_date']) || empty($data['end_date'])) {
                Logger::warning('Missing required fields for leave request');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required fields',
                    'required' => ['employee_id', 'start_date', 'end_date']
                ]);
                return;
            }

            $leaveId = $this->leaveModel->create($data);
            $leave = $this->leaveModel->getById($leaveId);
            
            Logger::info('Leave request created successfully', [
                'leave_id' => $leaveId,
                'employee_id' => $data['employee_id']
            ]);
            
            http_response_code(201);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Leave request created successfully',
                'data' => $leave
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in create leave', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to create leave request', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to create leave request',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update leave request
     * @param int $id
     */
    public function update($id, $data) {
        try {
            Logger::info('Updating leave request', ['id' => $id]);
            
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid leave ID for update', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid leave ID'
                ]);
                return;
            }
            
            // Check if leave request exists
            $existingLeave = $this->leaveModel->getById($id);
            if (!$existingLeave) {
                Logger::warning('Leave request not found for update', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Leave request not found'
                ]);
                return;
            }

            $updatedLeave = $this->leaveModel->update($id, $data);
            
            Logger::info('Leave request updated successfully', ['id' => $id]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Leave request updated successfully',
                'data' => $updatedLeave
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in update leave', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to update leave request', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to update leave request',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update leave request status
     * @param int $id
     */
    public function updateStatus($id, $data) {
        try {
            Logger::info('Updating leave request status', [
                'id' => $id,
                'status' => $data['status'] ?? null
            ]);
            
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid leave ID for status update', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid leave ID'
                ]);
                return;
            }
            
            if (empty($data['status'])) {
                Logger::warning('Missing status field for leave update');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Status field is required'
                ]);
                return;
            }
            
            // Check if leave request exists
            $existingLeave = $this->leaveModel->getById($id);
            if (!$existingLeave) {
                Logger::warning('Leave request not found for status update', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Leave request not found'
                ]);
                return;
            }

            $updatedLeave = $this->leaveModel->updateStatus($id, $data['status']);
            
            Logger::info('Leave request status updated successfully', [
                'id' => $id,
                'status' => $data['status']
            ]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Leave request status updated successfully',
                'data' => $updatedLeave
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in update leave status', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to update leave request status', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to update leave request status',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Delete leave request
     * @param int $id
     */
    public function delete($id) {
        try {
            Logger::info('Deleting leave request', ['id' => $id]);
            
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid leave ID for deletion', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid leave ID'
                ]);
                return;
            }
            
            // Check if leave request exists
            $existingLeave = $this->leaveModel->getById($id);
            if (!$existingLeave) {
                Logger::warning('Leave request not found for deletion', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Leave request not found'
                ]);
                return;
            }

            $result = $this->leaveModel->delete($id);
            if ($result) {
                Logger::info('Leave request deleted successfully', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Leave request deleted successfully'
                ]);
            } else {
                Logger::error('Failed to delete leave request', ['id' => $id]);
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to delete leave request'
                ]);
            }
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in delete leave', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to delete leave request', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete leave request',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get leave balance for employee
     * @param int $employeeId
     */
    public function getLeaveBalance($employeeId) {
        try {
            Logger::info('Fetching leave balance for employee', ['employee_id' => $employeeId]);
            
            if (!is_numeric($employeeId) || $employeeId <= 0) {
                Logger::warning('Invalid employee ID for leave balance', ['employee_id' => $employeeId]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid employee ID'
                ]);
                return;
            }
            
            $balance = $this->leaveModel->getLeaveBalance($employeeId);
            
            Logger::info('Leave balance fetched successfully', ['employee_id' => $employeeId]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $balance
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in get leave balance', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch leave balance', [
                'employee_id' => $employeeId, 
                'error' => $e->getMessage()
            ]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch leave balance',
                'error' => $e->getMessage()
            ]);
        }
    }
}
?>