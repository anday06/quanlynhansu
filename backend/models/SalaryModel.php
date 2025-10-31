<?php
require_once __DIR__ . '/../core/Database.php';

class SalaryModel {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Get all salary records
     */
    public function getAll() {
        $sql = "SELECT e.id as employee_id, e.name, e.salary as base_salary, 
                e.bonus, e.deduction, 
                (e.salary + COALESCE(e.bonus, 0) - COALESCE(e.deduction, 0)) as net_salary,
                e.hire_date, d.name as department_name, p.title as position_name
                FROM employees e
                LEFT JOIN departments d ON e.department_id = d.id
                LEFT JOIN positions p ON e.position_id = p.id
                ORDER BY e.id";
        return $this->db->fetchAll($sql);
    }

    /**
     * Get salary record by employee ID
     */
    public function getByEmployeeId($employeeId) {
        $sql = "SELECT e.id as employee_id, e.name, e.salary as base_salary, 
                e.bonus, e.deduction, 
                (e.salary + COALESCE(e.bonus, 0) - COALESCE(e.deduction, 0)) as net_salary,
                e.hire_date, d.name as department_name, p.title as position_name
                FROM employees e
                LEFT JOIN departments d ON e.department_id = d.id
                LEFT JOIN positions p ON e.position_id = p.id
                WHERE e.id = ?";
        return $this->db->fetchOne($sql, [$employeeId]);
    }

    /**
     * Update employee salary components
     */
    public function updateSalary($employeeId, $bonus, $deduction) {
        $sql = "UPDATE employees SET bonus = ?, deduction = ? WHERE id = ?";
        return $this->db->query($sql, [$bonus, $deduction, $employeeId]);
    }

    /**
     * Get payroll summary
     */
    public function getPayrollSummary() {
        $sql = "SELECT 
                COUNT(*) as total_employees,
                SUM(salary) as total_base_salary,
                SUM(bonus) as total_bonus,
                SUM(deduction) as total_deduction,
                SUM(salary + COALESCE(bonus, 0) - COALESCE(deduction, 0)) as total_net_salary
                FROM employees";
        return $this->db->fetchOne($sql);
    }
}
?>