<?php
require_once __DIR__ . '/../core/Logger.php';

class AuthMiddleware {
    /**
     * Check if user is authenticated
     * @param callable $next
     * @return mixed
     */
    public static function authenticate($next) {
        // Get authorization header
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        
        // Check if Bearer token is present
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7); // Remove 'Bearer ' prefix
            
            // Validate token (in a real app, you would verify JWT signature)
            $decoded = self::validateToken($token);
            
            if ($decoded && isset($decoded['user_id']) && isset($decoded['exp'])) {
                // Check if token is expired
                if ($decoded['exp'] > time()) {
                    // Token is valid, proceed to next middleware/controller
                    Logger::info('User authenticated successfully', ['user_id' => $decoded['user_id']]);
                    return $next($decoded);
                } else {
                    Logger::warning('Authentication token expired');
                    http_response_code(401);
                    header('Content-Type: application/json');
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Authentication token expired'
                    ]);
                    return false;
                }
            }
        }
        
        Logger::warning('Invalid or missing authentication token');
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid or missing authentication token'
        ]);
        return false;
    }
    
    /**
     * Validate JWT token
     * @param string $token
     * @return array|false
     */
    private static function validateToken($token) {
        try {
            // In a real application, you would use a JWT library to verify the token
            // For this example, we'll just decode the base64 encoded token
            $decoded = base64_decode($token);
            $data = json_decode($decoded, true);
            
            // Verify required fields exist
            if (!isset($data['user_id']) || !isset($data['exp'])) {
                return false;
            }
            
            return $data;
        } catch (Exception $e) {
            Logger::error('Token validation failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
    
    /**
     * Generate JWT token (for reference)
     * @param array $userData
     * @return string
     */
    public static function generateToken($userData) {
        // Add expiration time (1 hour from now)
        $userData['exp'] = time() + 3600;
        
        // In a real application, you would sign this with a secret key
        // For this example, we'll just base64 encode it
        return base64_encode(json_encode($userData));
    }
}
?>