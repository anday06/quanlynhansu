<?php
require_once __DIR__ . '/../core/Database.php';

class UserModel {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function create($username, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        $this->db->query($sql, [$username, $email, $hashedPassword]);
        return $this->db->lastInsertId();
    }

    public function findByUsername($username) {
        $sql = "SELECT * FROM users WHERE username = ?";
        return $this->db->fetchOne($sql, [$username]);
    }

    public function findByEmail($email) {
        $sql = "SELECT * FROM users WHERE email = ?";
        return $this->db->fetchOne($sql, [$email]);
    }

    public function validateCredentials($username, $password) {
        $user = $this->findByUsername($username);
        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return false;
    }
}
?>