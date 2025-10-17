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
    <div class="page-header">
      <h1><i class="fas fa-calendar-check"></i> Chấm Công</h1>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-clock"></i> Chấm Công Ngày Hôm Nay</h3>
      </div>
      <form id="attendance-form">
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="attEmpId">Mã Nhân Viên</label>
              <input type="number" id="attEmpId" class="form-control" placeholder="Nhập mã nhân viên" required>
            </div>
          </div>
        </div>
        
        <div class="btn-group">
          <button type="button" id="checkIn" class="btn btn-success">
            <i class="fas fa-sign-in-alt"></i> Vào Làm
          </button>
          <button type="button" id="checkOut" class="btn btn-warning">
            <i class="fas fa-sign-out-alt"></i> Ra Về
          </button>
        </div>
      </form>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-file-alt"></i> Báo Cáo Chấm Công</h3>
      </div>
      <form id="report-form">
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="reportEmpId">Mã Nhân Viên</label>
              <input type="number" id="reportEmpId" class="form-control" placeholder="Nhập mã nhân viên" required>
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="fromDate">Từ Ngày</label>
              <input type="date" id="fromDate" class="form-control" value="${today}">
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="toDate">Đến Ngày</label>
              <input type="date" id="toDate" class="form-control" value="${today}">
            </div>
          </div>
        </div>
        
        <div class="btn-group">
          <button type="submit" class="btn btn-info">
            <i class="fas fa-chart-bar"></i> Xem Báo Cáo
          </button>
        </div>
      </form>
    </div>
    
    <div id="report-container"></div>
  `;

  // Add event listeners
  container.querySelector("#checkIn").addEventListener("click", () => {
    const id = parseInt(document.getElementById("attEmpId").value);
    if (!id) {
      showAlert("Vui lòng nhập mã nhân viên", "danger");
      return;
    }

    if (checkIn(id)) {
      showAlert("Chấm công vào làm thành công!", "success");
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
      showAlert("Chấm công ra về thành công!", "success");
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
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i>
        <div>Không có dữ liệu chấm công cho khoảng thời gian này</div>
      </div>
    `;
    return;
  }

  const totalHours = report.reduce((sum, r) => sum + parseFloat(r.hours), 0);

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-chart-line"></i> Kết Quả Báo Cáo</h3>
      </div>
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="stat-info">
            <h4>${report.length}</h4>
            <p>Ngày Làm Việc</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon green">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-info">
            <h4>${totalHours.toFixed(2)}</h4>
            <p>Tổng Giờ Làm</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon orange">
            <i class="fas fa-calculator"></i>
          </div>
          <div class="stat-info">
            <h4>${(totalHours / report.length).toFixed(2)}</h4>
            <p>Giờ Trung Bình/Ngày</p>
          </div>
        </div>
      </div>
      
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Giờ Vào</th>
              <th>Giờ Ra</th>
              <th>Số Giờ</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${report
              .map(
                (r) => `
                <tr>
                  <td>${formatDate(r.date)}</td>
                  <td>${formatTime(r.checkIn)}</td>
                  <td>${r.checkOut ? formatTime(r.checkOut) : "Chưa ra về"}</td>
                  <td>${r.hours}</td>
                  <td>
                    ${
                      r.checkOut
                        ? '<span class="badge badge-success">Hoàn thành</span>'
                        : '<span class="badge badge-warning">Đang làm</span>'
                    }
                  </td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function showAlert(message, type) {
  // Remove existing alerts
  const existingAlert = document.querySelector(".attendance-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create alert element
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} attendance-alert`;
  alert.innerHTML = `
    <i class="fas fa-${
      type === "success"
        ? "check-circle"
        : type === "warning"
        ? "exclamation-triangle"
        : "exclamation-circle"
    }"></i>
    <div>${message}</div>
  `;

  // Insert alert after the form
  const form = document.getElementById("attendance-form");
  form.parentNode.insertBefore(alert, form.nextSibling);

  // Remove alert after 3 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 3000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function formatTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
