<?php
require_once __DIR__ . '/../models/AttendanceModel.php';
require_once __DIR__ . '/../core/Logger.php';

class AttendanceController {
    private $attendanceModel;

    public function __construct() {
        $this->attendanceModel = new AttendanceModel();
    }

    /**
     * Get all attendance records
     */
    public function getAll() {
        try {
            Logger::info('Fetching all attendance records');
            $attendance = $this->attendanceModel->getAll();
            Logger::info('Successfully fetched attendance records', ['count' => count($attendance)]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $attendance,
                'count' => count($attendance)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch attendance records', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch attendance records',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get attendance records by employee ID
     * @param int $employeeId
     */
    public function getByEmployeeId($employeeId) {
        try {
            Logger::info('Fetching attendance records by employee ID', ['employee_id' => $employeeId]);
            
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
            
            $attendance = $this->attendanceModel->getByEmployeeId($employeeId);
            Logger::info('Successfully fetched attendance records', ['employee_id' => $employeeId, 'count' => count($attendance)]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $attendance,
                'count' => count($attendance)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to fetch attendance records by employee ID', [
                'employee_id' => $employeeId, 
                'error' => $e->getMessage()
            ]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to fetch attendance records',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Check in employee
     */
    public function checkIn($data) {
        try {
            Logger::info('Processing employee check-in', [
                'employee_id' => $data['employee_id'] ?? null,
                'date' => $data['date'] ?? null
            ]);
            
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['date']) || empty($data['check_in'])) {
                Logger::warning('Missing required fields for check-in');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required fields',
                    'required' => ['employee_id', 'date', 'check_in']
                ]);
                return;
            }

            $attendanceId = $this->attendanceModel->checkIn(
                $data['employee_id'], 
                $data['date'], 
                $data['check_in']
            );
            
            Logger::info('Employee checked in successfully', [
                'attendance_id' => $attendanceId,
                'employee_id' => $data['employee_id']
            ]);
            
            http_response_code(201);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Employee checked in successfully',
                'attendance_id' => $attendanceId
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in check-in', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to check in employee', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to check in employee',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Check out employee
     */
    public function checkOut($data) {
        try {
            Logger::info('Processing employee check-out', [
                'employee_id' => $data['employee_id'] ?? null,
                'date' => $data['date'] ?? null
            ]);
            
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['date']) || empty($data['check_out'])) {
                Logger::warning('Missing required fields for check-out');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required fields',
                    'required' => ['employee_id', 'date', 'check_out']
                ]);
                return;
            }

            $result = $this->attendanceModel->checkOut(
                $data['employee_id'], 
                $data['date'], 
                $data['check_out']
            );
            
            Logger::info('Employee checked out successfully', [
                'employee_id' => $data['employee_id']
            ]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Employee checked out successfully'
            ]);
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in check-out', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to check out employee', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to check out employee',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Get attendance report
     */
    public function getReport($data) {
        try {
            Logger::info('Generating attendance report', [
                'employee_id' => $data['employee_id'] ?? null,
                'from_date' => $data['from_date'] ?? null,
                'to_date' => $data['to_date'] ?? null
            ]);
            
            // Validate required fields
            if (empty($data['employee_id']) || empty($data['from_date']) || empty($data['to_date'])) {
                Logger::warning('Missing required fields for attendance report');
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required fields',
                    'required' => ['employee_id', 'from_date', 'to_date']
                ]);
                return;
            }

            $attendance = $this->attendanceModel->getReport(
                $data['employee_id'], 
                $data['from_date'], 
                $data['to_date']
            );
            
            $totalHours = $this->attendanceModel->calculateTotalHours($attendance);
            
            Logger::info('Attendance report generated successfully', [
                'employee_id' => $data['employee_id'],
                'record_count' => count($attendance)
            ]);
            
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => $attendance,
                'total_hours' => $totalHours,
                'count' => count($attendance)
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to generate attendance report', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to generate attendance report',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Delete attendance record
     * @param int $id
     */
    public function delete($id) {
        try {
            Logger::info('Deleting attendance record', ['id' => $id]);
            
            if (!is_numeric($id) || $id <= 0) {
                Logger::warning('Invalid attendance ID for deletion', ['id' => $id]);
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid attendance ID'
                ]);
                return;
            }

            $result = $this->attendanceModel->delete($id);
            if ($result) {
                Logger::info('Attendance record deleted successfully', ['id' => $id]);
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Attendance record deleted successfully'
                ]);
            } else {
                Logger::error('Failed to delete attendance record', ['id' => $id]);
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to delete attendance record'
                ]);
            }
        } catch (InvalidArgumentException $e) {
            Logger::warning('Invalid argument in delete attendance', ['error' => $e->getMessage()]);
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to delete attendance record', ['id' => $id, 'error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to delete attendance record',
                'error' => $e->getMessage()
            ]);
        }
    }
}
?>