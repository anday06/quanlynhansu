// AttendanceModule.js
const ATTENDANCE_KEY = "attendance";

export function init() {
  if (!localStorage.getItem(ATTENDANCE_KEY)) {
    saveAttendance([]);
  }
}

export function checkIn(employeeId) {
  const logs = getAttendance();
  const today = new Date().toISOString().split("T")[0];

  // Check if already checked in today
  const existingLog = logs.find(
    (l) => l.date === today && l.employeeId === employeeId
  );

  if (existingLog && existingLog.checkIn) {
    return false; // Already checked in
  }

  if (existingLog) {
    // Update existing log
    existingLog.checkIn = new Date().toISOString();
  } else {
    // Create new log
    logs.push({
      date: today,
      employeeId,
      checkIn: new Date().toISOString(),
      checkOut: null,
    });
  }

  saveAttendance(logs);
  return true;
}

export function checkOut(employeeId) {
  let logs = getAttendance();
  const today = new Date().toISOString().split("T")[0];
  const log = logs.find(
    (l) => l.date === today && l.employeeId === employeeId && !l.checkOut
  );
  if (log) {
    log.checkOut = new Date().toISOString();
    saveAttendance(logs);
    return true;
  }
  return false;
}

export function getAttendanceReport(employeeId, fromDate, toDate) {
  const logs = getAttendance().filter(
    (l) =>
      l.employeeId === employeeId &&
      l.date >= fromDate &&
      l.date <= toDate &&
      l.checkIn
  );
  return logs.map((log) => {
    let hours = 0;
    if (log.checkOut) {
      hours =
        (new Date(log.checkOut) - new Date(log.checkIn)) / (1000 * 60 * 60);
    }
    return { ...log, hours: hours.toFixed(2) };
  });
}

function getAttendance() {
  return JSON.parse(localStorage.getItem(ATTENDANCE_KEY)) || [];
}

function saveAttendance(logs) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(logs));
}

export function render(container) {
  const today = new Date().toISOString().split("T")[0];

  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-calendar-check"></i> Chấm Công</h1>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-clock"></i> Chấm Công Ngày Hôm Nay</h2>
        </div>
        <div class="module-card-body">
          <form id="attendance-form" class="module-form">
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="attEmpId">Mã Nhân Viên</label>
                  <input type="number" id="attEmpId" class="module-form-control" placeholder="Nhập mã nhân viên" required>
                </div>
              </div>
            </div>
            
            <div class="module-btn-group">
              <button type="button" id="checkIn" class="btn btn-success">
                <i class="fas fa-sign-in-alt"></i> Vào Làm
              </button>
              <button type="button" id="checkOut" class="btn btn-warning">
                <i class="fas fa-sign-out-alt"></i> Ra Về
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-file-alt"></i> Báo Cáo Chấm Công</h2>
        </div>
        <div class="module-card-body">
          <form id="report-form" class="module-form">
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="reportEmpId">Mã Nhân Viên</label>
                  <input type="number" id="reportEmpId" class="module-form-control" placeholder="Nhập mã nhân viên" required>
                </div>
              </div>
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="fromDate">Từ Ngày</label>
                  <input type="date" id="fromDate" class="module-form-control" value="${today}">
                </div>
              </div>
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="toDate">Đến Ngày</label>
                  <input type="date" id="toDate" class="module-form-control" value="${today}">
                </div>
              </div>
            </div>
            
            <div class="module-btn-group">
              <button type="submit" class="btn btn-info">
                <i class="fas fa-chart-bar"></i> Xem Báo Cáo
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div id="report-container"></div>
    </div>
  `;

  // Add event listeners
  container.querySelector("#checkIn").addEventListener("click", () => {
    const id = parseInt(document.getElementById("attEmpId").value);
    if (!id) {
      showAlert("Vui lòng nhập mã nhân viên", "danger");
      return;
    }

    if (checkIn(id)) {
      showAlert("Bạn Check-In thành công", "success");
      document.getElementById("attEmpId").value = "";
    } else {
      showAlert("Bạn đã chấm công vào làm hôm nay rồi!", "warning");
    }
  });

  container.querySelector("#checkOut").addEventListener("click", () => {
    const id = parseInt(document.getElementById("attEmpId").value);
    if (!id) {
      showAlert("Vui lòng nhập mã nhân viên", "danger");
      return;
    }

    if (checkOut(id)) {
      showAlert("Bạn Check-Out thành công", "success");
      document.getElementById("attEmpId").value = "";
    } else {
      showAlert(
        "Bạn chưa chấm công vào làm hoặc đã chấm công ra về rồi!",
        "warning"
      );
    }
  });

  container.querySelector("#report-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("reportEmpId").value);
    const from = document.getElementById("fromDate").value || "1900-01-01";
    const to =
      document.getElementById("toDate").value ||
      new Date().toISOString().split("T")[0];

    if (!id) {
      showAlert("Vui lòng nhập mã nhân viên", "danger");
      return;
    }

    const report = getAttendanceReport(id, from, to);
    displayReport(container.querySelector("#report-container"), report);
  });
}

function displayReport(container, report) {
  if (report.length === 0) {
    container.innerHTML = `
      <div class="module-alert module-alert-info">
        <i class="fas fa-info-circle"></i>
        <div class="module-alert-content">
          <h4>Không Có Dữ Liệu</h4>
          <p>Không tìm thấy dữ liệu chấm công cho nhân viên này trong khoảng thời gian đã chọn.</p>
        </div>
      </div>
    `;
    return;
  }

  const totalHours = report.reduce((sum, r) => sum + parseFloat(r.hours), 0);
  const avgHours = totalHours / report.length;

  container.innerHTML = `
    <div class="stats-container mb-4">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-info">
          <h4>${report.length}</h4>
          <p>Số Ngày Làm Việc</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fas fa-hourglass-half"></i>
        </div>
        <div class="stat-info">
          <h4>${totalHours.toFixed(2)}</h4>
          <p>Tổng Số Giờ</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-info">
          <h4>${avgHours.toFixed(2)}</h4>
          <p>Giờ Trung Bình/Ngày</p>
        </div>
      </div>
    </div>
    
    <div class="module-card">
      <div class="module-card-header">
        <h2><i class="fas fa-list"></i> Chi Tiết Chấm Công</h2>
      </div>
      <div class="module-card-body">
        <div class="module-table-container">
          <table class="module-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Vào Làm</th>
                <th>Ra Về</th>
                <th>Số Giờ</th>
              </tr>
            </thead>
            <tbody>
              ${report
                .map(
                  (r) => `
                  <tr>
                    <td>${formatDate(r.date)}</td>
                    <td>${formatTime(r.checkIn)}</td>
                    <td>${
                      r.checkOut ? formatTime(r.checkOut) : "Chưa ra về"
                    }</td>
                    <td>${r.hours} giờ</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN");
}

function showAlert(message, type) {
  // Create alert element
  const alert = document.createElement("div");
  alert.className = `module-alert module-alert-${type}`;
  alert.innerHTML = `
    <i class="fas fa-${
      type === "success" ? "check-circle" : "exclamation-circle"
    }"></i>
    <div class="module-alert-content">
      <p>${message}</p>
    </div>
    <button class="module-alert-close">&times;</button>
  `;

  // Insert alert at the top of the container
  const container = document.querySelector(".module-container");
  container.insertBefore(alert, container.firstChild.nextSibling);

  // Add close event
  const closeBtn = alert.querySelector(".module-alert-close");
  closeBtn.addEventListener("click", () => {
    alert.remove();
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}
