<?php
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Logger.php';

class LeaveModel {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Get all leave requests
     * @return array
     */
    public function getAll() {
        $sql = "SELECT * FROM leaves ORDER BY created_at DESC";
        return $this->db->fetchAll($sql);
    }

    /**
     * Get leave request by ID
     * @param int $id
     * @return array|null
     */
    public function getById($id) {
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid leave ID");
        }
        
        $sql = "SELECT * FROM leaves WHERE id = ?";
        return $this->db->fetchOne($sql, [$id]);
    }

    /**
     * Get leave requests by employee ID
     * @param int $employeeId
     * @return array
     */
    public function getByEmployeeId($employeeId) {
        if (!is_numeric($employeeId) || $employeeId <= 0) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        $sql = "SELECT * FROM leaves WHERE employee_id = ? ORDER BY created_at DESC";
        return $this->db->fetchAll($sql, [$employeeId]);
    }

    /**
     * Create new leave request
     * @param array $data
     * @return int Last insert ID
     */
    public function create($data) {
        // Validate required fields
        $this->validateLeaveData($data, true);
        
        $sql = "INSERT INTO leaves (employee_id, start_date, end_date, type, reason) VALUES (?, ?, ?, ?, ?)";
        $this->db->query($sql, [
            $data['employee_id'],
            $data['start_date'],
            $data['end_date'],
            $data['type'] ?? 'annual',
            $data['reason'] ?? null
        ]);
        
        return $this->db->lastInsertId();
    }

    /**
     * Update leave request
     * @param int $id
     * @param array $data
     * @return array Updated leave request
     */
    public function update($id, $data) {
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid leave ID");
        }
        
        // Validate data
        $this->validateLeaveData($data, false);
        
        $sql = "UPDATE leaves SET employee_id = ?, start_date = ?, end_date = ?, type = ?, reason = ? WHERE id = ?";
        $this->db->query($sql, [
            $data['employee_id'],
            $data['start_date'],
            $data['end_date'],
            $data['type'] ?? 'annual',
            $data['reason'] ?? null,
            $id
        ]);
        
        return $this->getById($id);
    }

    /**
     * Update leave request status
     * @param int $id
     * @param string $status
     * @return array Updated leave request
     */
    public function updateStatus($id, $status) {
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid leave ID");
        }
        
        // Validate status
        $validStatuses = ['pending', 'approved', 'rejected'];
        if (!in_array($status, $validStatuses)) {
            throw new InvalidArgumentException("Invalid status. Must be one of: " . implode(', ', $validStatuses));
        }
        
        $sql = "UPDATE leaves SET status = ? WHERE id = ?";
        $this->db->query($sql, [$status, $id]);
        
        return $this->getById($id);
    }

    /**
     * Delete leave request
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        if (!is_numeric($id) || $id <= 0) {
            throw new InvalidArgumentException("Invalid leave ID");
        }
        
        $sql = "DELETE FROM leaves WHERE id = ?";
        return $this->db->execute($sql, [$id]) > 0;
    }

    /**
     * Get leave balance for employee
     * @param int $employeeId
     * @return array
     */
    public function getLeaveBalance($employeeId) {
        if (!is_numeric($employeeId) || $employeeId <= 0) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        // Default leave balance (this could be customized per employee)
        $annualLeave = 20; // 20 days annual leave
        $sickLeave = 10;   // 10 days sick leave
        
        // Calculate used leave
        $sql = "SELECT type, SUM(DATEDIFF(end_date, start_date) + 1) as days_used 
                FROM leaves 
                WHERE employee_id = ? AND status = 'approved' 
                GROUP BY type";
        $usedLeave = $this->db->fetchAll($sql, [$employeeId]);
        
        $usedAnnual = 0;
        $usedSick = 0;
        
        foreach ($usedLeave as $leave) {
            if ($leave['type'] === 'annual') {
                $usedAnnual = (int)$leave['days_used'];
            } elseif ($leave['type'] === 'sick') {
                $usedSick = (int)$leave['days_used'];
            }
        }
        
        return [
            'annual' => [
                'allocated' => $annualLeave,
                'used' => $usedAnnual,
                'remaining' => $annualLeave - $usedAnnual
            ],
            'sick' => [
                'allocated' => $sickLeave,
                'used' => $usedSick,
                'remaining' => $sickLeave - $usedSick
            ]
        ];
    }

    /**
     * Validate leave data
     * @param array $data
     * @param bool $isCreate
     * @throws InvalidArgumentException
     */
    private function validateLeaveData($data, $isCreate = false) {
        // Required fields for creation
        if ($isCreate) {
            if (empty($data['employee_id'])) {
                throw new InvalidArgumentException("Employee ID is required");
            }
            
            if (empty($data['start_date'])) {
                throw new InvalidArgumentException("Start date is required");
            }
            
            if (empty($data['end_date'])) {
                throw new InvalidArgumentException("End date is required");
            }
        }
        
        // Validate employee ID
        if (isset($data['employee_id']) && (!is_numeric($data['employee_id']) || $data['employee_id'] <= 0)) {
            throw new InvalidArgumentException("Invalid employee ID");
        }
        
        // Validate dates
        if (isset($data['start_date'])) {
            $startDate = DateTime::createFromFormat('Y-m-d', $data['start_date']);
            if (!$startDate || $startDate->format('Y-m-d') !== $data['start_date']) {
                throw new InvalidArgumentException("Invalid start date format. Use YYYY-MM-DD");
            }
        }
        
        if (isset($data['end_date'])) {
            $endDate = DateTime::createFromFormat('Y-m-d', $data['end_date']);
            if (!$endDate || $endDate->format('Y-m-d') !== $data['end_date']) {
                throw new InvalidArgumentException("Invalid end date format. Use YYYY-MM-DD");
            }
        }
        
        // Validate date range
        if (isset($data['start_date']) && isset($data['end_date'])) {
            $startDate = new DateTime($data['start_date']);
            $endDate = new DateTime($data['end_date']);
            
            if ($endDate < $startDate) {
                throw new InvalidArgumentException("End date must be after start date");
            }
        }
        
        // Validate leave type
        if (isset($data['type'])) {
            $validTypes = ['annual', 'sick', 'personal', 'maternity', 'paternity'];
            if (!in_array($data['type'], $validTypes)) {
                throw new InvalidArgumentException("Invalid leave type. Must be one of: " . implode(', ', $validTypes));
            }
        }
    }
}
?>