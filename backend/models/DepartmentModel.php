<?php
require_once __DIR__ . '/../core/Database.php';

class DepartmentModel {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function getAll() {
        $sql = "SELECT * FROM departments ORDER BY id";
        return $this->db->fetchAll($sql);
    }

    public function getById($id) {
        $sql = "SELECT * FROM departments WHERE id = ?";
        return $this->db->fetchOne($sql, [$id]);
    }

    public function create($data) {
        $sql = "INSERT INTO departments (name, description) VALUES (?, ?)";
        $this->db->query($sql, [$data['name'], $data['description'] ?? null]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $sql = "UPDATE departments SET name = ?, description = ? WHERE id = ?";
        $this->db->query($sql, [$data['name'], $data['description'] ?? null, $id]);
        return $this->getById($id);
    }

    public function delete($id) {
        $sql = "DELETE FROM departments WHERE id = ?";
        return $this->db->execute($sql, [$id]) > 0;
    }
}
?>