<?php
/**
 * Employee Model
 * 
 * This class handles all database operations related to employees.
 * It provides methods for CRUD operations and searching employees.
 * 
 * @package HRM
 * @subpackage Models
 * @author HRM System Developer
 * @version 1.0
 */

require_once __DIR__ . '/../core/Database.php';

class EmployeeModel {
    /**
     * @var Database Database connection instance
     */
    private $db;

    /**
     * Constructor - Initialize database connection
     */
    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Get all employees
     * 
     * @return array Array of employee records
     * @throws Exception If database query fails
     */
    public function getAll() {
        $sql = "SELECT * FROM employees ORDER BY id";
        return $this->db->fetchAll($sql);
    }

    /**
     * Get employee by ID
     * 
     * @param int $id Employee ID
     * @return array|null Employee record or null if not found
     * @throws InvalidArgumentException If ID is invalid
     */
    public function getById($id) {
        // Validate ID
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        $sql = "SELECT * FROM employees WHERE id = ? LEFT JOIN departments ON employees.department_id = departments.id LEFT JOIN positions ON employees.position_id = positions.id";
        return $this->db->fetchOne($sql, [$id]);
    }

    /**
     * Create new employee
     * 
     * @param array $data Employee data
     * @return int ID of created employee
     * @throws InvalidArgumentException If data validation fails
     */
    public function create($data) {
        // Validate required fields
        $this->validateEmployeeData($data, true);
        
        $sql = "INSERT INTO employees (name, department_id, position_id, salary, hire_date, email, address, bonus, deduction) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $this->db->query($sql, [
            $data['name'],
            $data['department_id'],
            $data['position_id'],
            $data['salary'],
            $data['hire_date'],
            $data['email'] ?? null,
            $data['address'] ?? null,
            $data['bonus'] ?? 0,
            $data['deduction'] ?? 0
        ]);
        return $this->db->lastInsertId();
    }

    /**
     * Update employee
     * 
     * @param int $id Employee ID
     * @param array $data Employee data
     * @return array Updated employee record
     * @throws InvalidArgumentException If ID or data validation fails
     */
    public function update($id, $data) {
        // Validate ID
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        // Validate data
        $this->validateEmployeeData($data, false);
        
        $sql = "UPDATE employees SET 
                name = ?, department_id = ?, position_id = ?, salary = ?, hire_date = ?, 
                email = ?, address = ?, bonus = ?, deduction = ? 
                WHERE id = ?";
        $this->db->query($sql, [
            $data['name'],
            $data['department_id'],
            $data['position_id'],
            $data['salary'],
            $data['hire_date'],
            $data['email'] ?? null,
            $data['address'] ?? null,
            $data['bonus'] ?? 0,
            $data['deduction'] ?? 0,
            $id
        ]);
        return $this->getById($id);
    }

    /**
     * Delete employee
     * 
     * @param int $id Employee ID
     * @return bool True if deleted, false otherwise
     * @throws InvalidArgumentException If ID is invalid
     */
    public function delete($id) {
        // Validate ID
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        $sql = "DELETE FROM employees WHERE id = ?";
        return $this->db->execute($sql, [$id]) > 0;
    }

    /**
     * Search employees with filters
     * 
     * @param array $filters Search filters
     * @return array Array of matching employee records
     */
    public function search($filters = []) {
        $sql = "SELECT * FROM employees WHERE 1=1";
        $params = [];

        if (!empty($filters['name'])) {
            $sql .= " AND name LIKE ?";
            $params[] = '%' . $filters['name'] . '%';
        }

        if (!empty($filters['department_id']) && is_numeric($filters['department_id'])) {
            $sql .= " AND department_id = ?";
            $params[] = $filters['department_id'];
        }

        if (!empty($filters['min_salary']) && is_numeric($filters['min_salary'])) {
            $sql .= " AND salary >= ?";
            $params[] = $filters['min_salary'];
        }

        if (!empty($filters['max_salary']) && is_numeric($filters['max_salary'])) {
            $sql .= " AND salary <= ?";
            $params[] = $filters['max_salary'];
        }

        $sql .= " ORDER BY salary DESC";
        return $this->db->fetchAll($sql, $params);
    }
    
    /**
     * Validate employee data
     * 
     * @param array $data Employee data
     * @param bool $isCreate Whether this is for creation (requires all fields)
     * @throws InvalidArgumentException
     */
    private function validateEmployeeData($data, $isCreate = false) {
        // Required fields for creation
        if ($isCreate) {
            if (empty($data['name'])) {
                throw new InvalidArgumentException("Employee name is required");
            }
            
            if (empty($data['department_id']) || !is_numeric($data['department_id'])) {
                throw new InvalidArgumentException("Valid department ID is required");
            }
            
            if (empty($data['position_id']) || !is_numeric($data['position_id'])) {
                throw new InvalidArgumentException("Valid position ID is required");
            }
            
            if (empty($data['hire_date'])) {
                throw new InvalidArgumentException("Hire date is required");
            }
        }
        
        // Validate salary
        if (isset($data['salary']) && (!is_numeric($data['salary']) || $data['salary'] < 0)) {
            throw new InvalidArgumentException("Salary must be a positive number");
        }
        
        // Validate hire date format
        if (isset($data['hire_date'])) {
            $date = DateTime::createFromFormat('Y-m-d', $data['hire_date']);
            if (!$date || $date->format('Y-m-d') !== $data['hire_date']) {
                throw new InvalidArgumentException("Invalid hire date format. Use YYYY-MM-DD");
            }
        }
        
        // Validate email format if provided
        if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format");
        }
        
        // Validate bonus and deduction
        if (isset($data['bonus']) && (!is_numeric($data['bonus']) || $data['bonus'] < 0)) {
            throw new InvalidArgumentException("Bonus must be a positive number");
        }
        
        if (isset($data['deduction']) && (!is_numeric($data['deduction']) || $data['deduction'] < 0)) {
            throw new InvalidArgumentException("Deduction must be a positive number");
        }
    }
}
?>