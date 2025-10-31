<?php
require_once __DIR__ . '/../core/Database.php';

class SalaryAdjustmentModel {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Get all salary adjustments
     */
    public function getAll() {
        $sql = "SELECT sa.*, e.name as employee_name, d.name as department_name
                FROM salary_adjustments sa
                LEFT JOIN employees e ON sa.employee_id = e.id
                LEFT JOIN departments d ON e.department_id = d.id
                ORDER BY sa.created_at DESC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Get salary adjustment by ID
     */
    public function getById($id) {
        $sql = "SELECT sa.*, e.name as employee_name, d.name as department_name
                FROM salary_adjustments sa
                LEFT JOIN employees e ON sa.employee_id = e.id
                LEFT JOIN departments d ON e.department_id = d.id
                WHERE sa.id = ?";
        return $this->db->fetchOne($sql, [$id]);
    }

    /**
     * Get salary adjustments by employee ID
     */
    public function getByEmployeeId($employeeId) {
        $sql = "SELECT sa.*, e.name as employee_name, d.name as department_name
                FROM salary_adjustments sa
                LEFT JOIN employees e ON sa.employee_id = e.id
                LEFT JOIN departments d ON e.department_id = d.id
                WHERE sa.employee_id = ?
                ORDER BY sa.created_at DESC";
        return $this->db->fetchAll($sql, [$employeeId]);
    }

    /**
     * Create new salary adjustment
     */
    public function create($data) {
        $sql = "INSERT INTO salary_adjustments (employee_id, type, amount, effective_date, reason, created_by) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $this->db->query($sql, [
            $data['employee_id'],
            $data['type'],
            $data['amount'],
            $data['effective_date'],
            $data['reason'],
            $data['created_by']
        ]);
        return $this->db->lastInsertId();
    }

    /**
     * Update salary adjustment
     */
    public function update($id, $data) {
        $sql = "UPDATE salary_adjustments SET employee_id = ?, type = ?, amount = ?, 
                effective_date = ?, reason = ?, created_by = ? WHERE id = ?";
        return $this->db->query($sql, [
            $data['employee_id'],
            $data['type'],
            $data['amount'],
            $data['effective_date'],
            $data['reason'],
            $data['created_by'],
            $id
        ]);
    }

    /**
     * Delete salary adjustment
     */
    public function delete($id) {
        $sql = "DELETE FROM salary_adjustments WHERE id = ?";
        return $this->db->query($sql, [$id]);
    }

    /**
     * Get salary adjustment history summary
     */
    public function getHistorySummary() {
        $sql = "SELECT 
                COUNT(*) as total_adjustments,
                SUM(CASE WHEN type = 'increase' THEN 1 ELSE 0 END) as total_increases,
                SUM(CASE WHEN type = 'decrease' THEN 1 ELSE 0 END) as total_decreases,
                SUM(CASE WHEN type = 'increase' THEN amount ELSE 0 END) as total_increase_amount,
                SUM(CASE WHEN type = 'decrease' THEN amount ELSE 0 END) as total_decrease_amount
                FROM salary_adjustments";
        return $this->db->fetchOne($sql);
    }
}
?>