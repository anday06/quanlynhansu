<?php
require_once __DIR__ . '/../models/PerformanceModel.php';
require_once __DIR__ . '/../core/Logger.php';

class PerformanceController {
    private $performanceModel;

    public function __construct() {
        $this->performanceModel = new PerformanceModel();
    }

    /**
     * Get all performance reviews
     */
    public function getAll() {
        try {
            Logger::info('Fetching all performance reviews');
            $reviews = $this->performanceModel->getAll();
            Logger::info('Successfully fetched performance reviews', ['count' => count($reviews)]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $reviews,
                'count' => count($reviews)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch performance reviews', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch performance reviews',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get performance review by ID
     * @param int $id
     */
    public function getById($id) {
        try {
            Logger::info('Fetching performance review by ID', ['id' => $id]);
            
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid review ID provided', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid review ID'
                ]);
                return;
            }
            
            $review = $this->performanceModel->getById($id);
            if ($review) {
                Logger::info('Performance review found', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'data' => $review
                ]);
            } else {
                Logger::warning('Performance review not found', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Performance review not found'
                ]);
            }
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in get review', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch performance review', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch performance review',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get performance reviews by employee ID
     * @param int $employeeId
     */
    public function getByEmployeeId($employeeId) {
        try {
            Logger::info('Fetching performance reviews by employee ID', ['employee_id' => $employeeId]);
            
            if (!is_numeric($employeeId) || $employeeId <= 0) {
                Logger::warning('Invalid employee ID provided', ['employee_id' => $employeeId]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid employee ID'
                ]);
                return;
            }
            
            $reviews = $this->performanceModel->getByEmployeeId($employeeId);
            Logger::info('Successfully fetched performance reviews', ['employee_id' => $employeeId, 'count' => count($reviews)]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $reviews,
                'count' => count($reviews)
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in get reviews by employee', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch performance reviews by employee ID', [
                'employee_id' => $employeeId, 
                'error' => $e->getMessage()
            ]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch performance reviews',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create new performance review
     */
    public function create($data) {
        try {
            Logger::info('Creating new performance review', [
                'employee_id' => $data['employee_id'] ?? null
            ]);
            
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['date']) || empty($data['rating'])) {
                Logger::warning('Missing required fields for performance review');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required fields',
                    'required' => ['employee_id', 'date', 'rating']
                ]);
                return;
            }

            $reviewId = $this->performanceModel->create($data);
            $review = $this->performanceModel->getById($reviewId);
            
            Logger::info('Performance review created successfully', [
                'review_id' => $reviewId,
                'employee_id' => $data['employee_id']
            ]);
            
            http_response_code(201);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Performance review created successfully',
                'data' => $review
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in create review', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to create performance review', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to create performance review',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update performance review
     * @param int $id
     */
    public function update($id, $data) {
        try {
            Logger::info('Updating performance review', ['id' => $id]);
            
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid review ID for update', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid review ID'
                ]);
                return;
            }
            
            // Check if review exists
            $existingReview = $this->performanceModel->getById($id);
            if (!$existingReview) {
                Logger::warning('Performance review not found for update', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Performance review not found'
                ]);
                return;
            }

            $updatedReview = $this->performanceModel->update($id, $data);
            
            Logger::info('Performance review updated successfully', ['id' => $id]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Performance review updated successfully',
                'data' => $updatedReview
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in update review', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to update performance review', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to update performance review',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Delete performance review
     * @param int $id
     */
    public function delete($id) {
        try {
            Logger::info('Deleting performance review', ['id' => $id]);
            
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid review ID for deletion', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid review ID'
                ]);
                return;
            }
            
            // Check if review exists
            $existingReview = $this->performanceModel->getById($id);
            if (!$existingReview) {
                Logger::warning('Performance review not found for deletion', ['id' => $id]);
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Performance review not found'
                ]);
                return;
            }

            $result = $this->performanceModel->delete($id);
            if ($result) {
                Logger::info('Performance review deleted successfully', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Performance review deleted successfully'
                ]);
            } else {
                Logger::error('Failed to delete performance review', ['id' => $id]);
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to delete performance review'
                ]);
            }
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in delete review', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to delete performance review', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete performance review',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get average rating for employee
     * @param int $employeeId
     */
    public function getAverageRating($employeeId) {
        try {
            Logger::info('Fetching average rating for employee', ['employee_id' => $employeeId]);
            
            if (!is_numeric($employeeId) || $employeeId <= 0) {
                Logger::warning('Invalid employee ID for average rating', ['employee_id' => $employeeId]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid employee ID'
                ]);
                return;
            }
            
            $average = $this->performanceModel->getAverageRating($employeeId);
            
            Logger::info('Average rating fetched successfully', ['employee_id' => $employeeId]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $average
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in get average rating', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch average rating', [
                'employee_id' => $employeeId, 
                'error' => $e->getMessage()
            ]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch average rating',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get top performers
     */
    public function getTopPerformers($data) {
        try {
            $limit = isset($data['limit']) ? (int)$data['limit'] : 10;
            
            Logger::info('Fetching top performers', ['limit' => $limit]);
            
            $topPerformers = $this->performanceModel->getTopPerformers($limit);
            
            Logger::info('Top performers fetched successfully', ['count' => count($topPerformers)]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $topPerformers,
                'count' => count($topPerformers)
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in get top performers', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch top performers', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch top performers',
                'error' => $e->getMessage()
            ]);
        }
    }
}
?>