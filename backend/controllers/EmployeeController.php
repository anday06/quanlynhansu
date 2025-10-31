<?php
require_once __DIR__ . '/../models/EmployeeModel.php';
require_once __DIR__ . '/../core/Logger.php';

class EmployeeController {
    private $employeeModel;

    public function __construct() {
        $this->employeeModel = new EmployeeModel();
    }

    public function getAll() {
        try {
            Logger::info('Fetching all employees');
            $employees = $this->employeeModel->getAll();
            Logger::info('Successfully fetched employees', ['count' => count($employees)]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $employees,
                'count' => count($employees)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch employees', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch employees',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function getById($id) {
        try {
            Logger::info('Fetching employee by ID', ['id' => $id]);
            
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
            
            $employee = $this->employeeModel->getById($id);
            if ($employee) {
                Logger::info('Employee found', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'data' => $employee
                ]);
            } else {
                Logger::warning('Employee not found', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Employee not found'
                ]);
            }
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in get employee', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch employee', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch employee',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function create($data) {
        try {
            Logger::info('Creating new employee', ['name' => $data['name'] ?? 'Unknown']);
            
            // Validate required fields
            if (empty($data['name']) || empty($data['department_id']) || empty($data['position_id']) || 
                empty($data['salary']) || empty($data['hire_date'])) {
                Logger::warning('Missing required fields for employee creation');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required fields',
                    'required' => ['name', 'department_id', 'position_id', 'salary', 'hire_date']
                ]);
                return;
            }

            $employeeId = $this->employeeModel->create($data);
            $employee = $this->employeeModel->getById($employeeId);
            
            Logger::info('Employee created successfully', ['id' => $employeeId, 'name' => $employee['name']]);
            
            http_response_code(201);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Employee created successfully',
                'data' => $employee
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in create employee', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to create employee', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to create employee',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function update($id, $data) {
        try {
            Logger::info('Updating employee', ['id' => $id]);
            
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid employee ID for update', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid employee ID'
                ]);
                return;
            }
            
            // Check if employee exists
            $existingEmployee = $this->employeeModel->getById($id);
            if (!$existingEmployee) {
                Logger::warning('Employee not found for update', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Employee not found'
                ]);
                return;
            }

            $updatedEmployee = $this->employeeModel->update($id, $data);
            
            Logger::info('Employee updated successfully', ['id' => $id]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Employee updated successfully',
                'data' => $updatedEmployee
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in update employee', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to update employee', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to update employee',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function delete($id) {
        try {
            Logger::info('Deleting employee', ['id' => $id]);
            
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid employee ID for deletion', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid employee ID'
                ]);
                return;
            }
            
            // Check if employee exists
            $existingEmployee = $this->employeeModel->getById($id);
            if (!$existingEmployee) {
                Logger::warning('Employee not found for deletion', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Employee not found'
                ]);
                return;
            }

            $result = $this->employeeModel->delete($id);
            if ($result) {
                Logger::info('Employee deleted successfully', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Employee deleted successfully'
                ]);
            } else {
                Logger::error('Failed to delete employee', ['id' => $id]);
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to delete employee'
                ]);
            }
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in delete employee', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to delete employee', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete employee',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function search($filters) {
        try {
            Logger::info('Searching employees', ['filters' => $filters]);
            $employees = $this->employeeModel->search($filters);
            Logger::info('Search completed', ['count' => count($employees)]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $employees,
                'count' => count($employees)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to search employees', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to search employees',
                'error' => $e->getMessage()
            ]);
        }
    }
}
?>