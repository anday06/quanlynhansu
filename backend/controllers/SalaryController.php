<?php
require_once __DIR__ . '/../models/SalaryModel.php';
require_once __DIR__ . '/../core/Logger.php';

class SalaryController {
    private $salaryModel;

    public function __construct() {
        $this->salaryModel = new SalaryModel();
    }

    /**
     * Get all salary records
     * GET /salary
     */
    public function getAll() {
        try {
            Logger::info('Fetching all salary records');
            $salaries = $this->salaryModel->getAll();
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $salaries,
                'count' => count($salaries)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch salary records', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch salary records',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get salary record by employee ID
     * GET /salary/{id}
     */
    public function getById($id) {
        try {
            Logger::info('Fetching salary record by employee ID', ['employee_id' => $id]);
            
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
            
            $salary = $this->salaryModel->getByEmployeeId($id);
            if ($salary) {
                Logger::info('Salary record found', ['employee_id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'data' => $salary
                ]);
            } else {
                Logger::warning('Salary record not found', ['employee_id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Salary record not found'
                ]);
            }
        } catch (Exception $e) {
            Logger::error('Failed to fetch salary record', ['employee_id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch salary record',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update employee salary components
     * PUT /salary/{id}
     */
    public function update($id, $data) {
        try {
            Logger::info('Updating salary record', ['employee_id' => $id]);
            
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
            
            // Validate required fields
            $bonus = isset($data['bonus']) ? floatval($data['bonus']) : 0;
            $deduction = isset($data['deduction']) ? floatval($data['deduction']) : 0;
            
            if ($bonus < 0) {
                Logger::warning('Invalid bonus amount', ['bonus' => $bonus]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Bonus must be a positive number'
                ]);
                return;
            }
            
            if ($deduction < 0) {
                Logger::warning('Invalid deduction amount', ['deduction' => $deduction]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Deduction must be a positive number'
                ]);
                return;
            }
            
            // Update salary
            $result = $this->salaryModel->updateSalary($id, $bonus, $deduction);
            
            if ($result) {
                // Get updated record
                $updatedSalary = $this->salaryModel->getByEmployeeId($id);
                Logger::info('Salary record updated successfully', ['employee_id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Salary record updated successfully',
                    'data' => $updatedSalary
                ]);
            } else {
                Logger::error('Failed to update salary record', ['employee_id' => $id]);
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update salary record'
                ]);
            }
        } catch (Exception $e) {
            Logger::error('Failed to update salary record', ['employee_id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to update salary record',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get payroll summary
     * GET /salary/summary
     */
    public function summary() {
        try {
            Logger::info('Generating payroll summary');
            $summary = $this->salaryModel->getPayrollSummary();
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $summary
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to generate payroll summary', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to generate payroll summary',
                'error' => $e->getMessage()
            ]);
        }
    }
}
?>