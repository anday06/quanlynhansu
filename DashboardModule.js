import ApiClient from "./apiClient.js";

// DashboardModule.js
export async function render(container) {
  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-home"></i> Bảng Điều Khiển</h1>
        <div class="module-header-actions">
          <button class="btn btn-primary" id="refresh-dashboard">
            <i class="fas fa-sync-alt"></i> Làm mới
          </button>
          <button class="btn btn-secondary">
            <i class="fas fa-cog"></i> Cài đặt
          </button>
        </div>
      </div>
      
      <div class="module-subheader">
        <p>Tổng quan về hệ thống quản lý nhân sự</p>
      </div>
      
      <div class="row">
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon blue">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>Nhân viên</h3>
              <p class="stat-number" id="stat-employees">--</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon green">
              <i class="fas fa-sitemap"></i>
            </div>
            <div class="stat-content">
              <h3>Phòng ban</h3>
              <p class="stat-number" id="stat-departments">--</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon orange">
              <i class="fas fa-briefcase"></i>
            </div>
            <div class="stat-content">
              <h3>Chức vụ</h3>
              <p class="stat-number" id="stat-positions">--</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="stat-card">
            <div class="stat-icon purple">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="stat-content">
              <h3>Chấm công</h3>
              <p class="stat-number" id="stat-attendance">--%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mt-4">
        <div class="col-md-8">
          <div class="module-card">
            <div class="module-card-header">
              <h2><i class="fas fa-tasks"></i> Công việc gần đây</h2>
            </div>
            <div class="module-card-body">
              <div class="module-table-container">
                <table class="module-table">
                  <thead>
                    <tr>
                      <th>Tên công việc</th>
                      <th>Nhân viên</th>
                      <th>Ngày hết hạn</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Đánh giá hiệu suất Q4</td>
                      <td>Nguyễn Văn A</td>
                      <td>15/11/2025</td>
                      <td><span class="module-badge module-badge-info">Đang thực hiện</span></td>
                      <td class="module-table-actions">
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
                      <td><span class="module-badge module-badge-success">Hoàn thành</span></td>
                      <td class="module-table-actions">
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
                      <td><span class="module-badge module-badge-danger">Quá hạn</span></td>
                      <td class="module-table-actions">
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
                      <td><span class="module-badge module-badge-info">Chưa bắt đầu</span></td>
                      <td class="module-table-actions">
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
          <div class="module-card">
            <div class="module-card-header">
              <h3><i class="fas fa-chart-bar"></i> Thống kê</h3>
            </div>
            <div class="module-card-body">
              <div class="performance-stats">
                <div class="stat-item">
                  <h4>Tỷ lệ chấm công</h4>
                  <p class="stat-number" id="panel-attendance">--%</p>
                </div>
                <div class="stat-item">
                  <h4>Nhân viên mới</h4>
                  <p class="stat-number" id="stat-new-employees">--</p>
                </div>
                <div class="stat-item">
                  <h4>Đơn xin nghỉ</h4>
                  <p class="stat-number" id="stat-leaves">--</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="module-card">
            <div class="module-card-header">
              <h3><i class="fas fa-calendar-alt"></i> Sự kiện sắp tới</h3>
            </div>
            <div class="module-card-body">
              <div class="module-alert module-alert-info">
                <i class="fas fa-calendar-day"></i>
                <div class="module-alert-content">
                  <h4>Họp phòng nhân sự</h4>
                  <p>Thứ Sáu, 10:00 AM</p>
                </div>
              </div>
              
              <div class="module-alert module-alert-warning">
                <i class="fas fa-birthday-cake"></i>
                <div class="module-alert-content">
                  <h4>Sinh nhật Nguyễn Văn A</h4>
                  <p>Ngày mai</p>
                </div>
              </div>
              
              <div class="module-alert module-alert-success">
                <i class="fas fa-graduation-cap"></i>
                <div class="module-alert-content">
                  <h4>Khóa đào tạo kỹ năng</h4>
                  <p>25/10/2025 - 27/10/2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="module-card mt-4">
        <div class="module-card-header">
          <h2><i class="fas fa-bell"></i> Thông báo gần đây</h2>
          <div class="module-card-actions">
            <button class="btn btn-sm btn-secondary">
              <i class="fas fa-bell-slash"></i> Đánh dấu đã đọc
            </button>
          </div>
        </div>
        <div class="module-card-body">
          <div class="module-alert module-alert-success">
            <i class="fas fa-check-circle"></i>
            <div class="module-alert-content">
              <h4>Thành công!</h4>
              <p>Đã cập nhật thông tin nhân viên mới.</p>
            </div>
            <button class="module-alert-close">&times;</button>
          </div>
          
          <div class="module-alert module-alert-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="module-alert-content">
              <h4>Cảnh báo!</h4>
              <p>Có 3 nhân viên chưa chấm công hôm nay.</p>
            </div>
            <button class="module-alert-close">&times;</button>
          </div>
          
          <div class="module-alert module-alert-info">
            <i class="fas fa-info-circle"></i>
            <div class="module-alert-content">
              <h4>Thông tin!</h4>
              <p>Cuộc họp phòng ban sẽ diễn ra vào thứ Sáu tuần này.</p>
            </div>
            <button class="module-alert-close">&times;</button>
          </div>
          
          <div class="module-alert module-alert-danger">
            <i class="fas fa-exclamation-circle"></i>
            <div class="module-alert-content">
              <h4>Khẩn cấp!</h4>
              <p>Hệ thống sẽ bảo trì vào 23:00 tối nay.</p>
            </div>
            <button class="module-alert-close">&times;</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add event listeners for close buttons
  const closeButtons = container.querySelectorAll(".module-alert-close");
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.remove();
    });
  });

  // Add event listener for refresh button
  const refreshButton = container.querySelector("#refresh-dashboard");
  if (refreshButton) {
    refreshButton.addEventListener("click", () => {
      // Reload the dashboard
      render(container);
    });
  }

  // Fetch real data from backend and update stats using the new summary endpoint
  try {
    // Primary: fetch summary (employees, departments, positions, leaves, attendance)
    const summaryResp = await ApiClient.request("/dashboard/summary");
    const summary = summaryResp && summaryResp.data ? summaryResp.data : null;

    const elEmp = container.querySelector("#stat-employees");
    const elDept = container.querySelector("#stat-departments");
    const elPos = container.querySelector("#stat-positions");
    const elAtt = container.querySelector("#stat-attendance");
    const elPanelAtt = container.querySelector("#panel-attendance");
    const elNewEmp = container.querySelector("#stat-new-employees");
    const elLeaves = container.querySelector("#stat-leaves");

    if (summary) {
      const empCount = Number(summary.employees || 0);
      const deptCount = Number(summary.departments || 0);
      const posCount = Number(summary.positions || 0);
      const leavesCount = Number(summary.leaves || 0);
      const attendancePercent = Number(
        (summary.attendance && summary.attendance.percent) || 0
      );

      if (elEmp) elEmp.textContent = empCount;
      if (elDept) elDept.textContent = deptCount;
      if (elPos) elPos.textContent = posCount;
      if (elLeaves) elLeaves.textContent = leavesCount;
      if (elAtt) elAtt.textContent = attendancePercent + "%";
      if (elPanelAtt) elPanelAtt.textContent = attendancePercent + "%";

      // For "new employees" stat we still need employee hire_date values to compute
      // so fetch full employee list and compute hires within last 30 days.
      try {
        const employees = await ApiClient.getEmployees();
        const recentEmployees = Array.isArray(employees)
          ? employees.filter((e) => {
              if (!e.hire_date) return false;
              const diff =
                (new Date() - new Date(e.hire_date)) / (1000 * 60 * 60 * 24);
              return diff <= 30;
            }).length
          : 0;
        if (elNewEmp) elNewEmp.textContent = recentEmployees;
      } catch (empErr) {
        if (elNewEmp) elNewEmp.textContent = "--";
      }
    } else {
      // summary missing: fallback to previous multi-call approach
      try {
        const [employees, departments, positions, attendanceResp] =
          await Promise.all([
            ApiClient.getEmployees(),
            ApiClient.getDepartments(),
            ApiClient.getPositions(),
            ApiClient.request("/attendance"),
          ]);

        const attendanceData =
          attendanceResp && attendanceResp.data ? attendanceResp.data : [];
        const today = new Date().toISOString().slice(0, 10);
        const presentEmployeeIds = attendanceData
          .filter((rec) => rec.date === today && rec.employee_id)
          .map((rec) => rec.employee_id.toString());
        const uniquePresent = Array.from(new Set(presentEmployeeIds)).length;

        const empCount = Array.isArray(employees) ? employees.length : 0;
        const deptCount = Array.isArray(departments) ? departments.length : 0;
        const posCount = Array.isArray(positions) ? positions.length : 0;
        const attendancePercent =
          empCount > 0 ? Math.round((uniquePresent / empCount) * 100) : 0;

        if (elEmp) elEmp.textContent = empCount;
        if (elDept) elDept.textContent = deptCount;
        if (elPos) elPos.textContent = posCount;
        if (elAtt) elAtt.textContent = attendancePercent + "%";
        if (elPanelAtt) elPanelAtt.textContent = attendancePercent + "%";

        const recentEmployees = Array.isArray(employees)
          ? employees.filter((e) => {
              if (!e.hire_date) return false;
              const diff =
                (new Date() - new Date(e.hire_date)) / (1000 * 60 * 60 * 24);
              return diff <= 30;
            }).length
          : 0;
        if (elNewEmp) elNewEmp.textContent = recentEmployees;

        try {
          const leavesResp = await ApiClient.request("/leaves");
          const leavesCount =
            leavesResp && leavesResp.data ? leavesResp.data.length : 0;
          if (elLeaves) elLeaves.textContent = leavesCount;
        } catch (leaveErr) {
          if (elLeaves) elLeaves.textContent = "--";
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    }
  } catch (err) {
    // If any API fails, leave the static placeholders or fallback to existing values
    // eslint-disable-next-line no-console
    console.error("Failed to load dashboard data", err);
  }
}
