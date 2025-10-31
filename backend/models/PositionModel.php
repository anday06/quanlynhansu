<?php
require_once __DIR__ . '/../core/Database.php';

class PositionModel {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function getAll() {
        $sql = "SELECT * FROM positions ORDER BY id";
        return $this->db->fetchAll($sql);
    }

    public function getById($id) {
        $sql = "SELECT * FROM positions WHERE id = ?";
        return $this->db->fetchOne($sql, [$id]);
    }

    public function create($data) {
        $sql = "INSERT INTO positions (title, description, salary_base) VALUES (?, ?, ?)";
        $this->db->query($sql, [
            $data['title'], 
            $data['description'] ?? null, 
            $data['salary_base'] ?? 0
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $sql = "UPDATE positions SET title = ?, description = ?, salary_base = ? WHERE id = ?";
        $this->db->query($sql, [
            $data['title'], 
            $data['description'] ?? null, 
            $data['salary_base'] ?? 0,
            $id
        ]);
        return $this->getById($id);
    }

    public function delete($id) {
        $sql = "DELETE FROM positions WHERE id = ?";
        return $this->db->execute($sql, [$id]) > 0;
    }
}
?>