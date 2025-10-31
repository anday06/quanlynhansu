<?php
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Logger.php';

class DashboardController {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Return summary counts for dashboard
     * GET /dashboard/summary
     */
    public function summary() {
        try {
            Logger::info('Generating dashboard summary');

            // Employees count
            $empRow = $this->db->fetchOne("SELECT COUNT(*) as cnt FROM employees");
            $employees = (int)($empRow['cnt'] ?? 0);

            // Departments count
            $deptRow = $this->db->fetchOne("SELECT COUNT(*) as cnt FROM departments");
            $departments = (int)($deptRow['cnt'] ?? 0);

            // Positions count
            $posRow = $this->db->fetchOne("SELECT COUNT(*) as cnt FROM positions");
            $positions = (int)($posRow['cnt'] ?? 0);

            // Leaves count (all requests)
            $leaveRow = $this->db->fetchOne("SELECT COUNT(*) as cnt FROM leaves");
            $leaves = (int)($leaveRow['cnt'] ?? 0);

            // New employees in last 30 days
            $newEmpRow = $this->db->fetchOne("SELECT COUNT(*) as cnt FROM employees WHERE hire_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
            $newEmployees = (int)($newEmpRow['cnt'] ?? 0);

            // Attendance today: count distinct employees with a record for today
            $today = (new DateTime())->format('Y-m-d');
            $attRow = $this->db->fetchOne(
                "SELECT COUNT(DISTINCT employee_id) as present FROM attendance WHERE date = ?",
                [$today]
            );
            $presentToday = (int)($attRow['present'] ?? 0);

            $attendancePercent = $employees > 0 ? (int)round(($presentToday / $employees) * 100) : 0;

            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'data' => [
                    'employees' => $employees,
                    'departments' => $departments,
                    'positions' => $positions,
                    'leaves' => $leaves,
                    'new_employees' => $newEmployees,
                    'attendance' => [
                        'present' => $presentToday,
                        'percent' => $attendancePercent,
                        'date' => $today
                    ]
                ]
            ]);

        } catch (Exception $e) {
            Logger::error('Failed to generate dashboard summary', ['error' => $e->getMessage()]);
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to generate dashboard summary',
                'error' => $e->getMessage()
            ]);
        }
    }
}

?>
