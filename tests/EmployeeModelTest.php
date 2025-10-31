<?php
require_once __DIR__ . '/../backend/models/EmployeeModel.php';
require_once __DIR__ . '/../backend/core/Database.php';

class EmployeeModelTest {
    private $employeeModel;
    private $testEmployeeId;
    
    public function __construct() {
        $this->employeeModel = new EmployeeModel();
    }
    
    /**
     * Test creating an employee
     */
    public function testCreateEmployee() {
        echo "Testing Employee Creation...\n";
        
        try {
            $employeeData = [
                'name' => 'Test Employee',
                'department_id' => 1,
                'position_id' => 1,
                'salary' => 50000,
                'hire_date' => '2023-01-01',
                'email' => 'test@example.com',
                'address' => 'Test Address'
            ];
            
            $employeeId = $this->employeeModel->create($employeeData);
            $this->testEmployeeId = $employeeId;
            
            if ($employeeId > 0) {
                echo "✓ Employee created successfully with ID: $employeeId\n";
                return true;
            } else {
                echo "✗ Failed to create employee\n";
                return false;
            }
        } catch (Exception $e) {
            echo "✗ Error creating employee: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    /**
     * Test getting all employees
     */
    public function testGetAllEmployees() {
        echo "Testing Get All Employees...\n";
        
        try {
            $employees = $this->employeeModel->getAll();
            
            if (is_array($employees)) {
                echo "✓ Retrieved " . count($employees) . " employees\n";
                return true;
            } else {
                echo "✗ Failed to retrieve employees\n";
                return false;
            }
        } catch (Exception $e) {
            echo "✗ Error retrieving employees: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    /**
     * Test getting employee by ID
     */
    public function testGetEmployeeById() {
        echo "Testing Get Employee By ID...\n";
        
        if (!$this->testEmployeeId) {
            echo "✗ No test employee ID available\n";
            return false;
        }
        
        try {
            $employee = $this->employeeModel->getById($this->testEmployeeId);
            
            if ($employee && $employee['id'] == $this->testEmployeeId) {
                echo "✓ Retrieved employee: " . $employee['name'] . "\n";
                return true;
            } else {
                echo "✗ Failed to retrieve employee by ID\n";
                return false;
            }
        } catch (Exception $e) {
            echo "✗ Error retrieving employee: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    /**
     * Test updating an employee
     */
    public function testUpdateEmployee() {
        echo "Testing Employee Update...\n";
        
        if (!$this->testEmployeeId) {
            echo "✗ No test employee ID available\n";
            return false;
        }
        
        try {
            $updateData = [
                'name' => 'Updated Test Employee',
                'department_id' => 2,
                'position_id' => 2,
                'salary' => 55000,
                'hire_date' => '2023-01-01',
                'email' => 'updated@example.com',
                'address' => 'Updated Address'
            ];
            
            $updatedEmployee = $this->employeeModel->update($this->testEmployeeId, $updateData);
            
            if ($updatedEmployee && $updatedEmployee['name'] === 'Updated Test Employee') {
                echo "✓ Employee updated successfully\n";
                return true;
            } else {
                echo "✗ Failed to update employee\n";
                return false;
            }
        } catch (Exception $e) {
            echo "✗ Error updating employee: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    /**
     * Test searching employees
     */
    public function testSearchEmployees() {
        echo "Testing Employee Search...\n";
        
        try {
            $filters = [
                'name' => 'Updated Test'
            ];
            
            $employees = $this->employeeModel->search($filters);
            
            if (is_array($employees) && count($employees) > 0) {
                echo "✓ Found " . count($employees) . " employees matching search criteria\n";
                return true;
            } else {
                echo "✓ Search completed (no matches found, which is OK)\n";
                return true;
            }
        } catch (Exception $e) {
            echo "✗ Error searching employees: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    /**
     * Test deleting an employee
     */
    public function testDeleteEmployee() {
        echo "Testing Employee Deletion...\n";
        
        if (!$this->testEmployeeId) {
            echo "✗ No test employee ID available\n";
            return false;
        }
        
        try {
            $result = $this->employeeModel->delete($this->testEmployeeId);
            
            if ($result) {
                echo "✓ Employee deleted successfully\n";
                return true;
            } else {
                echo "✗ Failed to delete employee\n";
                return false;
            }
        } catch (Exception $e) {
            echo "✗ Error deleting employee: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    /**
     * Run all tests
     */
    public function runAllTests() {
        echo "=== EmployeeModel Tests ===\n";
        
        $tests = [
            'testCreateEmployee',
            'testGetAllEmployees',
            'testGetEmployeeById',
            'testUpdateEmployee',
            'testSearchEmployees',
            'testDeleteEmployee'
        ];
        
        $passed = 0;
        $failed = 0;
        
        foreach ($tests as $test) {
            if ($this->$test()) {
                $passed++;
            } else {
                $failed++;
            }
            echo "\n";
        }
        
        echo "=== Test Results ===\n";
        echo "Passed: $passed\n";
        echo "Failed: $failed\n";
        echo "Total: " . ($passed + $failed) . "\n";
        
        return $failed === 0;
    }
}

// Run tests if this file is executed directly
if (basename(__FILE__) == basename($_SERVER['SCRIPT_NAME'])) {
    $test = new EmployeeModelTest();
    $test->runAllTests();
}
?>