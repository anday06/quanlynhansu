<?php
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Logger.php';

class AttendanceModel {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Get all attendance records
     * @return array
     */
    public function getAll() {
        $sql = "SELECT * FROM attendance ORDER BY date DESC, employee_id";
        return $this->db->fetchAll($sql);
    }

    /**
     * Get attendance records by employee ID
     * @param int $employeeId
     * @return array
     */
    public function getByEmployeeId($employeeId) {
        $sql = "SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC";
        return $this->db->fetchAll($sql, [$employeeId]);
    }

    /**
     * Get attendance record by employee ID and date
     * @param int $employeeId
     * @param string $date
     * @return array|null
     */
    public function getByEmployeeAndDate($employeeId, $date) {
        $sql = "SELECT * FROM attendance WHERE employee_id = ? AND date = ?";
        return $this->db->fetchOne($sql, [$employeeId, $date]);
    }

    /**
     * Check in employee
     * @param int $employeeId
     * @param string $date
     * @param string $checkInTime
     * @return int Last insert ID
     */
    public function checkIn($employeeId, $date, $checkInTime) {
        // Validate inputs
        if (!is_numeric($employeeId) || $employeeId <= 0) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        // Validate date format
        $dateObj = DateTime::createFromFormat('Y-m-d', $date);
        if (!$dateObj || $dateObj->format('Y-m-d') !== $date) {
            throw new InvalidArgumentException("Invalid date format. Use YYYY-MM-DD");
        }
        
        // Validate time format
        $timeObj = DateTime::createFromFormat('H:i:s', $checkInTime);
        if (!$timeObj || $timeObj->format('H:i:s') !== $checkInTime) {
            throw new InvalidArgumentException("Invalid time format. Use HH:MM:SS");
        }
        
        // Check if record already exists
        $existing = $this->getByEmployeeAndDate($employeeId, $date);
        if ($existing) {
            // Update existing record
            $sql = "UPDATE attendance SET check_in = ? WHERE employee_id = ? AND date = ?";
            $this->db->query($sql, [$checkInTime, $employeeId, $date]);
            return $existing['id'];
        } else {
            // Create new record
            $sql = "INSERT INTO attendance (employee_id, date, check_in) VALUES (?, ?, ?)";
            $this->db->query($sql, [$employeeId, $date, $checkInTime]);
            return $this->db->lastInsertId();
        }
    }

    /**
     * Check out employee
     * @param int $employeeId
     * @param string $date
     * @param string $checkOutTime
     * @return bool
     */
    public function checkOut($employeeId, $date, $checkOutTime) {
        // Validate inputs
        if (!is_numeric($employeeId) || $employeeId <= 0) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        // Validate date format
        $dateObj = DateTime::createFromFormat('Y-m-d', $date);
        if (!$dateObj || $dateObj->format('Y-m-d') !== $date) {
            throw new InvalidArgumentException("Invalid date format. Use YYYY-MM-DD");
        }
        
        // Validate time format
        $timeObj = DateTime::createFromFormat('H:i:s', $checkOutTime);
        if (!$timeObj || $timeObj->format('H:i:s') !== $checkOutTime) {
            throw new InvalidArgumentException("Invalid time format. Use HH:MM:SS");
        }
        
        // Check if record exists
        $existing = $this->getByEmployeeAndDate($employeeId, $date);
        if (!$existing) {
            throw new InvalidArgumentException("No check-in record found for this date");
        }
        
        // Update checkout time
        $sql = "UPDATE attendance SET check_out = ? WHERE employee_id = ? AND date = ?";
        $this->db->query($sql, [$checkOutTime, $employeeId, $date]);
        return true;
    }

    /**
     * Delete attendance record
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid attendance ID");
        }
        
        $sql = "DELETE FROM attendance WHERE id = ?";
        return $this->db->execute($sql, [$id]) > 0;
    }

    /**
     * Get attendance report for an employee
     * @param int $employeeId
     * @param string $fromDate
     * @param string $toDate
     * @return array
     */
    public function getReport($employeeId, $fromDate, $toDate) {
        $sql = "SELECT * FROM attendance WHERE employee_id = ? AND date BETWEEN ? AND ? ORDER BY date";
        return $this->db->fetchAll($sql, [$employeeId, $fromDate, $toDate]);
    }

    /**
     * Calculate total hours worked
     * @param array $attendanceRecords
     * @return float Total hours
     */
    public function calculateTotalHours($attendanceRecords) {
        $totalSeconds = 0;
        
        foreach ($attendanceRecords as $record) {
            if (!empty($record['check_in']) && !empty($record['check_out'])) {
                $checkIn = new DateTime($record['date'] . ' ' . $record['check_in']);
                $checkOut = new DateTime($record['date'] . ' ' . $record['check_out']);
                
                if ($checkOut > $checkIn) {
                    $interval = $checkIn->diff($checkOut);
                    $totalSeconds += ($interval->h * 3600) + ($interval->i * 60) + $interval->s;
                }
            }
        }
        
        return round($totalSeconds / 3600, 2);
    }
}
?>