// DashboardModule.js
export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1><i class="fas fa-home"></i> Bảng Điều Khiển</h1>
        <p>Tổng quan về hệ thống quản lý nhân sự</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary">
          <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="btn btn-secondary">
          <i class="fas fa-cog"></i> Cài đặt
        </button>
      </div>
    </div>
    
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <h4>128</h4>
          <p>Nhân viên</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fas fa-building"></i>
        </div>
        <div class="stat-info">
          <h4>12</h4>
          <p>Phòng ban</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="fas fa-briefcase"></i>
        </div>
        <div class="stat-info">
          <h4>24</h4>
          <p>Vị trí</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="stat-info">
          <h4>98%</h4>
          <p>Chấm công hôm nay</p>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-tasks"></i> Công việc cần thực hiện</h3>
            <div class="card-actions">
              <button class="btn btn-sm btn-success">
                <i class="fas fa-plus"></i> Thêm công việc
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Công việc</th>
                    <th>Người phụ trách</th>
                    <th>Ngày hết hạn</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hoàn thiện báo cáo tháng</td>
                    <td>Nguyễn Văn A</td>
                    <td>15/10/2025</td>
                    <td><span class="badge badge-warning">Đang thực hiện</span></td>
                    <td class="table-actions">
                      <button class="btn btn-sm btn-info">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-warning">
                        <i class="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Cập nhật thông tin nhân viên</td>
                    <td>Trần Thị B</td>
                    <td>20/10/2025</td>
                    <td><span class="badge badge-success">Hoàn thành</span></td>
                    <td class="table-actions">
                      <button class="btn btn-sm btn-info">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-warning">
                        <i class="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Đánh giá hiệu suất Q3</td>
                    <td>Lê Văn C</td>
                    <td>25/10/2025</td>
                    <td><span class="badge badge-danger">Quá hạn</span></td>
                    <td class="table-actions">
                      <button class="btn btn-sm btn-info">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-warning">
                        <i class="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Họp phòng ban hàng quý</td>
                    <td>Phạm Minh D</td>
                    <td>30/10/2025</td>
                    <td><span class="badge badge-info">Chưa bắt đầu</span></td>
                    <td class="table-actions">
                      <button class="btn btn-sm btn-info">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-warning">
                        <i class="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-chart-bar"></i> Thống kê</h3>
          </div>
          <div class="card-body">
            <div class="performance-stats">
              <div class="stat-item">
                <h4>Tỷ lệ chấm công</h4>
                <p class="stat-number">98%</p>
              </div>
              <div class="stat-item">
                <h4>Nhân viên mới</h4>
                <p class="stat-number">5</p>
              </div>
              <div class="stat-item">
                <h4>Đơn xin nghỉ</h4>
                <p class="stat-number">12</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-calendar-alt"></i> Sự kiện sắp tới</h3>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <i class="fas fa-calendar-day"></i>
              <div>
                <strong>Họp phòng nhân sự</strong>
                <p>Thứ Sáu, 10:00 AM</p>
              </div>
            </div>
            
            <div class="alert alert-warning">
              <i class="fas fa-birthday-cake"></i>
              <div>
                <strong>Sinh nhật Nguyễn Văn A</strong>
                <p>Ngày mai</p>
              </div>
            </div>
            
            <div class="alert alert-success">
              <i class="fas fa-graduation-cap"></i>
              <div>
                <strong>Khóa đào tạo kỹ năng</strong>
                <p>25/10/2025 - 27/10/2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-bell"></i> Thông báo gần đây</h3>
        <div class="card-actions">
          <button class="btn btn-sm btn-secondary">
            <i class="fas fa-bell-slash"></i> Đánh dấu đã đọc
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          <div>
            <strong>Thành công!</strong>
            <p>Đã cập nhật thông tin nhân viên mới.</p>
          </div>
          <button class="close">&times;</button>
        </div>
        
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <div>
            <strong>Cảnh báo!</strong>
            <p>Có 3 nhân viên chưa chấm công hôm nay.</p>
          </div>
          <button class="close">&times;</button>
        </div>
        
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i>
          <div>
            <strong>Thông tin!</strong>
            <p>Cuộc họp phòng ban sẽ diễn ra vào thứ Sáu tuần này.</p>
          </div>
          <button class="close">&times;</button>
        </div>
        
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-circle"></i>
          <div>
            <strong>Khẩn cấp!</strong>
            <p>Hệ thống sẽ bảo trì vào 23:00 tối nay.</p>
          </div>
          <button class="close">&times;</button>
        </div>
      </div>
    </div>
  `;

  // Add event listeners for close buttons
  const closeButtons = container.querySelectorAll(".alert .close");
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.remove();
    });
  });
}
