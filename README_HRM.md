# Human Resource Management (HRM) System

## Overview

A complete Human Resource Management system built with vanilla JavaScript (frontend) and PHP/MySQL (backend) following MVC architecture and OOP principles.

## Features

### Core Modules (12+)

1. **Authentication** - User login/registration
2. **Employee Management** - Add, edit, delete, search employees
3. **Department Management** - Organizational structure
4. **Position Management** - Job positions and roles
5. **Salary Management** - Salary tracking and adjustments
6. **Attendance Tracking** - Check-in/check-out system
7. **Leave Management** - Leave requests and approvals
8. **Performance Evaluation** - Employee performance reviews
9. **Leave Policy Management** - Company leave policies
10. **Dashboard** - System overview and statistics
11. **Salary Adjustment** - Salary modification tracking
12. **Search Employee** - Advanced employee search

## Technology Stack

### Frontend

- Vanilla JavaScript (ES6+)
- HTML5
- CSS3
- Fetch API for backend communication

### Backend

- PHP 8+ (OOP, MVC)
- MySQL database
- PDO for database access

## System Requirements

- Web server with PHP 8+ support (Apache/Nginx)
- MySQL 5.7+ or MariaDB
- Modern web browser

## Installation

### 1. Database Setup

1. Create a MySQL database:

   ```sql
   CREATE DATABASE hrm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Import the database schema:
   ```bash
   mysql -u username -p hrm_system < init.sql
   ```

### 2. Configure Database Connection

Edit `backend/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_PORT', 3306);
define('DB_NAME', 'hrm_system');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 3. Web Server Configuration

Ensure your web server is configured to serve the project directory.

## Running the Application

1. Start your web server (Apache/Nginx)
2. Navigate to the project URL in your browser
3. Login with default credentials:
   - Username: `admin`
   - Password: `password`

## API Endpoints

### Authentication

- `POST /backend/api.php/auth/register` - Register new user
- `POST /backend/api.php/auth/login` - User login
- `POST /backend/api.php/auth/logout` - User logout

### Employees

- `GET /backend/api.php/employees` - Get all employees
- `GET /backend/api.php/employees/{id}` - Get employee by ID
- `POST /backend/api.php/employees` - Create new employee
- `PUT /backend/api.php/employees/{id}` - Update employee
- `DELETE /backend/api.php/employees/{id}` - Delete employee
- `GET /backend/api.php/employees/search` - Search employees

### Departments

- `GET /backend/api.php/departments` - Get all departments
- `GET /backend/api.php/departments/{id}` - Get department by ID
- `POST /backend/api.php/departments` - Create new department
- `PUT /backend/api.php/departments/{id}` - Update department
- `DELETE /backend/api.php/departments/{id}` - Delete department

### Positions

- `GET /backend/api.php/positions` - Get all positions
- `GET /backend/api.php/positions/{id}` - Get position by ID
- `POST /backend/api.php/positions` - Create new position
- `PUT /backend/api.php/positions/{id}` - Update position
- `DELETE /backend/api.php/positions/{id}` - Delete position

### Attendance

- `GET /backend/api.php/attendance` - Get all attendance records
- `GET /backend/api.php/attendance/employee/{id}` - Get attendance by employee
- `POST /backend/api.php/attendance/check-in` - Employee check-in
- `POST /backend/api.php/attendance/check-out` - Employee check-out
- `POST /backend/api.php/attendance/report` - Get attendance report
- `DELETE /backend/api.php/attendance/{id}` - Delete attendance record

### Leaves

- `GET /backend/api.php/leaves` - Get all leave requests
- `GET /backend/api.php/leaves/{id}` - Get leave request by ID
- `GET /backend/api.php/leaves/employee/{id}` - Get leaves by employee
- `POST /backend/api.php/leaves` - Create new leave request
- `PUT /backend/api.php/leaves/{id}` - Update leave request
- `PUT /backend/api.php/leaves/{id}/status` - Update leave status
- `DELETE /backend/api.php/leaves/{id}` - Delete leave request
- `GET /backend/api.php/leaves/balance/{id}` - Get leave balance

### Performance

- `GET /backend/api.php/performance` - Get all performance reviews
- `GET /backend/api.php/performance/{id}` - Get review by ID
- `GET /backend/api.php/performance/employee/{id}` - Get reviews by employee
- `POST /backend/api.php/performance` - Create new review
- `PUT /backend/api.php/performance/{id}` - Update review
- `DELETE /backend/api.php/performance/{id}` - Delete review
- `GET /backend/api.php/performance/average/{id}` - Get average rating
- `POST /backend/api.php/performance/top` - Get top performers

### Salary

- `GET /backend/api.php/salary` - Get all salary records
- `GET /backend/api.php/salary/{id}` - Get salary by employee ID
- `PUT /backend/api.php/salary/{id}` - Update employee salary
- `GET /backend/api.php/salary/summary` - Get payroll summary

### Salary Adjustments

- `GET /backend/api.php/salary-adjustments` - Get all adjustments
- `GET /backend/api.php/salary-adjustments/{id}` - Get adjustment by ID
- `GET /backend/api.php/salary-adjustments/employee/{id}` - Get adjustments by employee
- `POST /backend/api.php/salary-adjustments` - Create new adjustment
- `PUT /backend/api.php/salary-adjustments/{id}` - Update adjustment
- `DELETE /backend/api.php/salary-adjustments/{id}` - Delete adjustment
- `GET /backend/api.php/salary-adjustments/summary` - Get adjustment summary

## Project Structure

```
.
├── backend/
│   ├── controllers/     # Controller classes
│   ├── core/           # Core framework components
│   ├── middleware/     # Authentication middleware
│   ├── models/         # Model classes
│   ├── routes/         # API route definitions
│   ├── api.php         # Main API entry point
│   └── config.php      # Database configuration
├── tests/              # Unit tests
├── *.js                # Frontend modules
├── *.html              # HTML files
├── *.css               # Stylesheets
├── init.sql            # Database initialization
└── README.md           # This file
```

## Testing

### Backend Tests

Run PHP unit tests:

```bash
cd tests
php run_tests.php
```

### Frontend Tests

Manual testing through browser interface.

## Security Features

- Password hashing using PHP's `password_hash()`
- Prepared statements to prevent SQL injection
- Input validation on both frontend and backend
- CORS headers for API security
- Error handling without exposing sensitive information

## Data Persistence

All data is stored in MySQL database, not in localStorage. The system ensures data consistency and persistence across sessions.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is for educational purposes as part of an assignment.

## Support

For issues and questions, please contact the development team.
