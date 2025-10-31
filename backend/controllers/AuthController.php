<?php
require_once __DIR__ . '/../models/UserModel.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function register($data) {
        // Validate input
        if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }

        // Check if user already exists
        $usernameExists = $this->userModel->findByUsername($data['username']);
        $emailExists = $this->userModel->findByEmail($data['email']);
        
        if ($usernameExists) {
            http_response_code(409);
            echo json_encode(['error' => 'Username already exists']);
            return;
        }

        if ($emailExists) {
            http_response_code(409);
            echo json_encode(['error' => 'Email already exists']);
            return;
        }

        // Create user
        try {
            $userId = $this->userModel->create($data['username'], $data['email'], $data['password']);
            http_response_code(201);
            echo json_encode(['message' => 'User created successfully', 'user_id' => $userId]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create user']);
        }
    }

    public function login($data) {
        // Validate input
        if (empty($data['username']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required']);
            return;
        }

        // Validate credentials
        $user = $this->userModel->validateCredentials($data['username'], $data['password']);
        if ($user) {
            // Generate a simple token (in production, use JWT)
            $token = base64_encode(json_encode([
                'user_id' => $user['id'],
                'username' => $user['username'],
                'exp' => time() + 3600 // 1 hour
            ]));

            http_response_code(200);
            echo json_encode([
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    }

    public function logout() {
        // For stateless API, just return success
        http_response_code(200);
        echo json_encode(['message' => 'Logged out successfully']);
    }
}
?>