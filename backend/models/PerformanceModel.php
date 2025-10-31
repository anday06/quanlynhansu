<?php
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Logger.php';

class PerformanceModel {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Get all performance reviews
     * @return array
     */
    public function getAll() {
        $sql = "SELECT * FROM performance_reviews ORDER BY date DESC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Get performance review by ID
     * @param int $id
     * @return array|null
     */
    public function getById($id) {
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid review ID");
        }
        
        $sql = "SELECT * FROM performance_reviews WHERE id = ?";
        return $this->db->fetchOne($sql, [$id]);
    }

    /**
     * Get performance reviews by employee ID
     * @param int $employeeId
     * @return array
     */
    public function getByEmployeeId($employeeId) {
        if (!is_numeric($employeeId) || $employeeId <= 0) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        $sql = "SELECT * FROM performance_reviews WHERE employee_id = ? ORDER BY date DESC";
        return $this->db->fetchAll($sql, [$employeeId]);
    }

    /**
     * Create new performance review
     * @param array $data
     * @return int Last insert ID
     */
    public function create($data) {
        // Validate required fields
        $this->validateReviewData($data, true);
        
        $sql = "INSERT INTO performance_reviews (employee_id, date, rating, feedback, reviewer) VALUES (?, ?, ?, ?, ?)";
        $this->db->query($sql, [
            $data['employee_id'],
            $data['date'],
            $data['rating'],
            $data['feedback'] ?? null,
            $data['reviewer'] ?? null
        ]);
        
        return $this->db->lastInsertId();
    }

    /**
     * Update performance review
     * @param int $id
     * @param array $data
     * @return array Updated review
     */
    public function update($id, $data) {
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid review ID");
        }
        
        // Validate data
        $this->validateReviewData($data, false);
        
        $sql = "UPDATE performance_reviews SET employee_id = ?, date = ?, rating = ?, feedback = ?, reviewer = ? WHERE id = ?";
        $this->db->query($sql, [
            $data['employee_id'],
            $data['date'],
            $data['rating'],
            $data['feedback'] ?? null,
            $data['reviewer'] ?? null,
            $id
        ]);
        
        return $this->getById($id);
    }

    /**
     * Delete performance review
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid review ID");
        }
        
        $sql = "DELETE FROM performance_reviews WHERE id = ?";
        return $this->db->execute($sql, [$id]) > 0;
    }

    /**
     * Get average rating for employee
     * @param int $employeeId
     * @return float
     */
    public function getAverageRating($employeeId) {
        if (!is_numeric($employeeId) || $employeeId <= 0) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        $sql = "SELECT AVG(rating) as average_rating, COUNT(*) as review_count FROM performance_reviews WHERE employee_id = ?";
        $result = $this->db->fetchOne($sql, [$employeeId]);
        
        return [
            'average_rating' => $result['average_rating'] ? round($result['average_rating'], 2) : 0,
            'review_count' => (int)$result['review_count']
        ];
    }

    /**
     * Get top performers
     * @param int $limit
     * @return array
     */
    public function getTopPerformers($limit = 10) {
        if (!is_numeric($limit) || $limit <= 0) {
            throw new InvalidArgumentException("Invalid limit");
        }
        
        $sql = "SELECT 
                    employee_id,
                    AVG(rating) as average_rating,
                    COUNT(*) as review_count
                FROM performance_reviews 
                GROUP BY employee_id 
                HAVING review_count >= 2
                ORDER BY average_rating DESC 
                LIMIT ?";
        
        return $this->db->fetchAll($sql, [$limit]);
    }

    /**
     * Validate performance review data
     * @param array $data
     * @param bool $isCreate
     * @throws InvalidArgumentException
     */
    private function validateReviewData($data, $isCreate = false) {
        // Required fields for creation
        if ($isCreate) {
            if (empty($data['employee_id'])) {
                throw new InvalidArgumentException("Employee ID is required");
            }
            
            if (empty($data['date'])) {
                throw new InvalidArgumentException("Review date is required");
            }
            
            if (empty($data['rating'])) {
                throw new InvalidArgumentException("Rating is required");
            }
        }
        
        // Validate employee ID
        if (isset($data['employee_id']) && (!is_numeric($data['employee_id']) || $data['employee_id'] <= 0)) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        // Validate date
        if (isset($data['date'])) {
            $date = DateTime::createFromFormat('Y-m-d', $data['date']);
            if (!$date || $date->format('Y-m-d') !== $data['date']) {
                throw new InvalidArgumentException("Invalid date format. Use YYYY-MM-DD");
            }
        }
        
        // Validate rating
        if (isset($data['rating'])) {
            if (!is_numeric($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
                throw new InvalidArgumentException("Rating must be a number between 1 and 5");
            }
        }
    }
}
?>