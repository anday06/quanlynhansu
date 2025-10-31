# Hệ Thống Quản Lý Nhân Sự (HRM)

Ứng dụng quản lý nhân sự hoàn chỉnh với frontend JavaScript thuần và backend PHP/MySQL.

## Tính Năng

- **Quản lý nhân viên**: Thêm, sửa, xóa, tìm kiếm nhân viên
- **Quản lý phòng ban**: CRUD các phòng ban trong công ty
- **Quản lý chức vụ**: CRUD các chức vụ công việc
- **Quản lý lương**: Tính toán và theo dõi bảng lương
- **Chấm công**: Theo dõi thời gian làm việc của nhân viên
- **Nghỉ phép**: Quản lý yêu cầu nghỉ phép
- **Đánh giá hiệu suất**: Đánh giá và theo dõi hiệu suất làm việc

## Yêu Cầu Hệ Thống

- PHP 7.4 hoặc cao hơn
- MySQL 5.7 hoặc cao hơn
- Web server (Apache với mod_rewrite hoặc Nginx)
- Trình duyệt hiện đại

## Cài Đặt

### 1. Cài đặt cơ sở dữ liệu

1. Tạo database:

```sql
CREATE DATABASE hrm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Chạy script khởi tạo:

```bash
mysql -u root -p hrm_system < init.sql
```

### 2. Cấu hình kết nối database

Chỉnh sửa file `backend/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_PORT', 3307);  // Thay đổi nếu cần
define('DB_NAME', 'hrm_system');
define('DB_USER', 'root');
define('DB_PASS', '');
```

### 3. Chạy ứng dụng

#### Sử dụng XAMPP/WAMP:

1. Copy thư mục dự án vào thư mục `htdocs`
2. Khởi động Apache và MySQL
3. Truy cập `http://localhost/baiquanlynhansu`

#### Sử dụng PHP built-in server:

```bash
php -S localhost:8000
```

Truy cập `http://localhost:8000`

## Cấu Trúc Dự Án

```
├── backend/
│   ├── api.php                 # API entry point
│   ├── config.php              # Database configuration
│   ├── controllers/            # Controller classes
│   ├── models/                 # Model classes
│   ├── routes/                 # Route definitions
│   ├── middleware/             # Middleware functions
│   └── core/                   # Core classes
├── *.js modules                # Frontend feature modules
├── App.js                      # Main frontend entry
├── index.html                  # Single page entry
└── init.sql                    # Database schema
```

## Tài Khoản Mặc Định

- **Username**: admin
- **Password**: password

## API Endpoints

### Authentication

- `POST /backend/api.php/auth/register` - Đăng ký người dùng
- `POST /backend/api.php/auth/login` - Đăng nhập
- `POST /backend/api.php/auth/logout` - Đăng xuất

### Employees

- `GET /backend/api.php/employees` - Lấy tất cả nhân viên
- `GET /backend/api.php/employees/{id}` - Lấy nhân viên theo ID
- `POST /backend/api.php/employees` - Tạo nhân viên mới
- `PUT /backend/api.php/employees/{id}` - Cập nhật nhân viên
- `DELETE /backend/api.php/employees/{id}` - Xóa nhân viên
- `GET /backend/api.php/employees/search` - Tìm kiếm nhân viên

### Departments

- `GET /backend/api.php/departments` - Lấy tất cả phòng ban
- `GET /backend/api.php/departments/{id}` - Lấy phòng ban theo ID
- `POST /backend/api.php/departments` - Tạo phòng ban mới
- `PUT /backend/api.php/departments/{id}` - Cập nhật phòng ban
- `DELETE /backend/api.php/departments/{id}` - Xóa phòng ban

### Positions

- `GET /backend/api.php/positions` - Lấy tất cả chức vụ
- `GET /backend/api.php/positions/{id}` - Lấy chức vụ theo ID
- `POST /backend/api.php/positions` - Tạo chức vụ mới
- `PUT /backend/api.php/positions/{id}` - Cập nhật chức vụ
- `DELETE /backend/api.php/positions/{id}` - Xóa chức vụ

### Attendance

- `GET /backend/api.php/attendance` - Lấy tất cả bản ghi chấm công
- `GET /backend/api.php/attendance/employee/{id}` - Lấy bản ghi chấm công theo nhân viên
- `POST /backend/api.php/attendance/check-in` - Check-in nhân viên
- `POST /backend/api.php/attendance/check-out` - Check-out nhân viên
- `POST /backend/api.php/attendance/report` - Lấy báo cáo chấm công
- `DELETE /backend/api.php/attendance/{id}` - Xóa bản ghi chấm công

### Leaves

- `GET /backend/api.php/leaves` - Lấy tất cả yêu cầu nghỉ phép
- `GET /backend/api.php/leaves/{id}` - Lấy yêu cầu nghỉ phép theo ID
- `GET /backend/api.php/leaves/employee/{id}` - Lấy yêu cầu nghỉ phép theo nhân viên
- `POST /backend/api.php/leaves` - Tạo yêu cầu nghỉ phép mới
- `PUT /backend/api.php/leaves/{id}` - Cập nhật yêu cầu nghỉ phép
- `PUT /backend/api.php/leaves/{id}/status` - Cập nhật trạng thái yêu cầu nghỉ phép
- `DELETE /backend/api.php/leaves/{id}` - Xóa yêu cầu nghỉ phép
- `GET /backend/api.php/leaves/balance/{id}` - Lấy số ngày nghỉ còn lại của nhân viên

### Performance

- `GET /backend/api.php/performance` - Lấy tất cả đánh giá hiệu suất
- `GET /backend/api.php/performance/{id}` - Lấy đánh giá hiệu suất theo ID
- `GET /backend/api.php/performance/employee/{id}` - Lấy đánh giá hiệu suất theo nhân viên
- `POST /backend/api.php/performance` - Tạo đánh giá hiệu suất mới
- `PUT /backend/api.php/performance/{id}` - Cập nhật đánh giá hiệu suất
- `DELETE /backend/api.php/performance/{id}` - Xóa đánh giá hiệu suất
- `GET /backend/api.php/performance/average/{id}` - Lấy điểm trung bình của nhân viên
- `POST /backend/api.php/performance/top` - Lấy danh sách nhân viên xuất sắc

## Cải Tiến Đã Thực Hiện

### 1. Cải Thiện Xác Thực và Xử Lý Lỗi

- **Xác thực dữ liệu toàn diện**: Kiểm tra kiểu dữ liệu, định dạng ngày, email hợp lệ
- **Xử lý lỗi chi tiết**: Phân loại lỗi theo loại (validation, server, network)
- **Thông báo lỗi rõ ràng**: Cung cấp thông tin chi tiết cho người dùng

### 2. Cải Thiện Logging

- **Hệ thống logging**: Ghi log các hoạt động quan trọng
- **Phân loại log**: INFO, WARNING, ERROR
- **Context đầy đủ**: Thông tin chi tiết cho việc debug

### 3. Cải Thiện Bảo Mật

- **Kết nối database an toàn**: Sử dụng prepared statements
- **Header bảo mật**: Thiết lập các header bảo mật
- **Xác thực input**: Kiểm tra và lọc dữ liệu đầu vào

### 4. Cải Thiện Frontend

- **Xác thực real-time**: Kiểm tra dữ liệu khi người dùng nhập
- **Phản hồi trực quan**: Hiển thị lỗi cụ thể cho từng trường
- **Trải nghiệm người dùng**: Thông báo rõ ràng, xử lý bất đồng bộ

### 5. Hoàn Thiện Các Module Backend Thiếu

- **AttendanceModule**: Quản lý chấm công với check-in/check-out
- **LeaveModule**: Quản lý nghỉ phép với các loại nghỉ khác nhau
- **PerformanceModule**: Đánh giá hiệu suất với rating 1-5 sao
- **AuthMiddleware**: Middleware xác thực cho các endpoint được bảo vệ

## Kiến Trúc Hệ Thống

### Frontend Architecture

```
index.html
├── App.js (main entry, routing)
├── style.css (styling)
├── apiClient.js (API communication)
└── Module files (.js)
    ├── AuthModule.js
    ├── EmployeeDbModule.js
    ├── AddEmployeeModule.js
    ├── EditEmployeeModule.js
    ├── DeleteEmployeeModule.js
    ├── SearchEmployeeModule.js
    ├── DepartmentModule.js
    ├── PositionModule.js
    ├── SalaryModule.js
    ├── AttendanceModule.js
    ├── LeaveModule.js
    └── PerformanceModule.js
```

### Backend Architecture

```
backend/
├── api.php (entry point)
├── config.php (database configuration)
├── core/
│   ├── Database.php (PDO wrapper)
│   ├── Router.php (routing)
│   └── Logger.php (logging)
├── models/
│   ├── UserModel.php
│   ├── EmployeeModel.php
│   ├── DepartmentModel.php
│   ├── PositionModel.php
│   ├── AttendanceModel.php
│   ├── LeaveModel.php
│   └── PerformanceModel.php
├── controllers/
│   ├── AuthController.php
│   ├── EmployeeController.php
│   ├── DepartmentController.php
│   ├── PositionController.php
│   ├── AttendanceController.php
│   ├── LeaveController.php
│   └── PerformanceController.php
├── routes/
│   ├── auth.php
│   ├── employee.php
│   ├── department.php
│   ├── position.php
│   ├── attendance.php
│   ├── leave.php
│   └── performance.php
└── middleware/
    └── AuthMiddleware.php
```

## Công Nghệ Sử Dụng

### Frontend

- JavaScript ES6+
- HTML5
- CSS3
- Fetch API để gọi backend

### Backend

- PHP 8+ (OOP, MVC)
- MySQL
- PDO để kết nối database

## Gỡ Lỗi và Kiểm Tra

### Backend Debugging

1. Kiểm tra file log tại `backend/logs/app.log`
2. Sử dụng `var_dump()` hoặc `print_r()` để debug
3. Kiểm tra kết nối database trong `backend/config.php`

### Frontend Debugging

1. Sử dụng DevTools của trình duyệt
2. Kiểm tra Network tab để xem request/response API
3. Console để xem lỗi JavaScript

### Kiểm Thử Edge Cases

1. **Validation dữ liệu**: Kiểm tra các trường hợp dữ liệu không hợp lệ
2. **Xử lý lỗi mạng**: Kiểm tra khi không có kết nối internet
3. **Xử lý lỗi server**: Kiểm tra khi server gặp lỗi
4. **Xử lý lỗi xác thực**: Kiểm tra khi token hết hạn

## Unit Tests

Ứng dụng có thể được kiểm thử với các unit test sau:

### Backend Tests

1. **Model Tests**:

   - EmployeeModelTest: Kiểm tra các phương thức CRUD
   - DepartmentModelTest: Kiểm tra quản lý phòng ban
   - PositionModelTest: Kiểm tra quản lý chức vụ
   - AttendanceModelTest: Kiểm tra chấm công
   - LeaveModelTest: Kiểm tra nghỉ phép
   - PerformanceModelTest: Kiểm tra đánh giá hiệu suất

2. **Controller Tests**:
   - EmployeeControllerTest: Kiểm tra API endpoints nhân viên
   - AuthControllerTest: Kiểm tra xác thực người dùng
   - AttendanceControllerTest: Kiểm tra API chấm công
   - LeaveControllerTest: Kiểm tra API nghỉ phép
   - PerformanceControllerTest: Kiểm tra API đánh giá hiệu suất

### Frontend Tests

1. **Module Tests**:

   - AddEmployeeModuleTest: Kiểm tra thêm nhân viên
   - EditEmployeeModuleTest: Kiểm tra sửa nhân viên
   - SearchEmployeeModuleTest: Kiểm tra tìm kiếm nhân viên
   - DepartmentModuleTest: Kiểm tra quản lý phòng ban
   - PositionModuleTest: Kiểm tra quản lý chức vụ

2. **Integration Tests**:
   - ApiClientTest: Kiểm tra gọi API
   - AuthModuleTest: Kiểm tra xác thực
   - NavigationTest: Kiểm tra chuyển đổi giữa các module

## Tác Giả

Hệ thống được phát triển như một bài tập thực hành lập trình.

## Giấy Phép

MIT License
