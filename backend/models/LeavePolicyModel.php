<?php
require_once __DIR__ . '/../core/Database.php';

class LeavePolicyModel {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Get all leave policies
     */
    public function getAll() {
        $sql = "SELECT * FROM leave_policies ORDER BY created_at DESC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Get leave policy by ID
     */
    public function getById($id) {
        $sql = "SELECT * FROM leave_policies WHERE id = ?";
        return $this->db->fetchOne($sql, [$id]);
    }

    /**
     * Get leave policy by type
     */
    public function getByType($type) {
        $sql = "SELECT * FROM leave_policies WHERE type = ?";
        return $this->db->fetchOne($sql, [$type]);
    }

    /**
     * Create new leave policy
     */
    public function create($data) {
        $sql = "INSERT INTO leave_policies (type, name, description, max_days, carry_over, requires_approval) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $this->db->query($sql, [
            $data['type'],
            $data['name'],
            $data['description'],
            $data['max_days'],
            $data['carry_over'] ?? 0,
            $data['requires_approval'] ?? 1
        ]);
        return $this->db->lastInsertId();
    }

    /**
     * Update leave policy
     */
    public function update($id, $data) {
        $sql = "UPDATE leave_policies SET type = ?, name = ?, description = ?, 
                max_days = ?, carry_over = ?, requires_approval = ? WHERE id = ?";
        return $this->db->query($sql, [
            $data['type'],
            $data['name'],
            $data['description'],
            $data['max_days'],
            $data['carry_over'] ?? 0,
            $data['requires_approval'] ?? 1,
            $id
        ]);
    }

    /**
     * Delete leave policy
     */
    public function delete($id) {
        $sql = "DELETE FROM leave_policies WHERE id = ?";
        return $this->db->query($sql, [$id]);
    }

    /**
     * Get default policies
     */
    public function getDefaultPolicies() {
        $sql = "SELECT * FROM leave_policies WHERE is_default = 1";
        return $this->db->fetchAll($sql);
    }
}
?>