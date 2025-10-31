// AttendanceModule.js
import apiClient from "./apiClient.js";

let attendanceRecords = [];
let isLoaded = false;

export async function init() {
  try {
    console.log("Loading attendance records from API...");
    const response = await apiClient.request("/attendance");
    console.log("Attendance data received:", response);
    // Đảm bảo luôn trả về mảng
    attendanceRecords = Array.isArray(response.data) ? response.data : [];
    isLoaded = true;
    console.log("Attendance records loaded:", attendanceRecords);
  } catch (error) {
    console.error("Failed to load attendance records:", error);
    // Cung cấp dữ liệu mặc định nếu không thể tải từ API
    attendanceRecords = [];
    isLoaded = true;
  }
}

export async function checkIn(employeeId) {
  try {
    const checkInData = {
      employee_id: employeeId,
      date: new Date().toISOString().split("T")[0],
      check_in: new Date().toTimeString().split(" ")[0],
    };

    const response = await apiClient.request("/attendance/check-in", {
      method: "POST",
      body: JSON.stringify(checkInData),
    });

    // Reload attendance records
    await init();

    return response.status === "success";
  } catch (error) {
    console.error("Failed to check in:", error);
    throw new Error("Failed to check in: " + error.message);
  }
}

export async function checkOut(employeeId) {
  try {
    const checkOutData = {
      employee_id: employeeId,
      date: new Date().toISOString().split("T")[0],
      check_out: new Date().toTimeString().split(" ")[0],
    };

    const response = await apiClient.request("/attendance/check-out", {
      method: "POST",
      body: JSON.stringify(checkOutData),
    });

    // Reload attendance records
    await init();

    return response.status === "success";
  } catch (error) {
    console.error("Failed to check out:", error);
    throw new Error("Failed to check out: " + error.message);
  }
}

export async function getAttendanceReport(employeeId, fromDate, toDate) {
  try {
    const reportData = {
      employee_id: employeeId,
      from_date: fromDate,
      to_date: toDate,
    };

    const response = await apiClient.request("/attendance/report", {
      method: "POST",
      body: JSON.stringify(reportData),
    });

    return response.data || [];
  } catch (error) {
    console.error("Failed to get attendance report:", error);
    throw new Error("Failed to get attendance report: " + error.message);
  }
}

export async function render(container) {
  // Wait for attendance records to be loaded if they're not already
  if (!isLoaded) {
    // Show loading state while data is being fetched
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-calendar-check"></i> Chấm Công</h1>
        </div>
        <div class="module-card">
          <div class="module-card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu chấm công...</p>
          </div>
        </div>
      </div>
    `;

    // Wait for data to load
    await init();
  }

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
  container.querySelector("#checkIn").addEventListener("click", async () => {
    const id = parseInt(document.getElementById("attEmpId").value);
    if (!id) {
      alert("Vui lòng nhập mã nhân viên");
      return;
    }

    try {
      await checkIn(id);
      alert("Check-in thành công!");
    } catch (error) {
      alert("Check-in thất bại: " + error.message);
    }
  });

  container.querySelector("#checkOut").addEventListener("click", async () => {
    const id = parseInt(document.getElementById("attEmpId").value);
    if (!id) {
      alert("Vui lòng nhập mã nhân viên");
      return;
    }

    try {
      await checkOut(id);
      alert("Check-out thành công!");
    } catch (error) {
      alert("Check-out thất bại: " + error.message);
    }
  });

  container
    .querySelector("#report-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = parseInt(document.getElementById("reportEmpId").value);
      const fromDate = document.getElementById("fromDate").value;
      const toDate = document.getElementById("toDate").value;

      if (!id || !fromDate || !toDate) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }

      try {
        const report = await getAttendanceReport(id, fromDate, toDate);

        const reportHtml = `
        <div class="module-card mt-4">
          <div class="module-card-header">
            <h2><i class="fas fa-file-alt"></i> Kết Quả Báo Cáo</h2>
          </div>
          <div class="module-card-body">
            <div class="module-table-container">
              <table class="module-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Giờ Vào</th>
                    <th>Giờ Ra</th>
                    <th>Số Giờ</th>
                  </tr>
                </thead>
                <tbody>
                  ${report
                    .map(
                      (record) => `
                    <tr>
                      <td>${record.date}</td>
                      <td>${record.check_in || "Chưa có"}</td>
                      <td>${record.check_out || "Chưa có"}</td>
                      <td>${calculateHours(
                        record.check_in,
                        record.check_out
                      )}</td>
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

        document.getElementById("report-container").innerHTML = reportHtml;
      } catch (error) {
        document.getElementById("report-container").innerHTML = `
        <div class="module-alert module-alert-danger">
          <i class="fas fa-exclamation-circle"></i>
          <div class="module-alert-content">
            <p>Lỗi khi lấy báo cáo: ${error.message}</p>
          </div>
        </div>
      `;
      }
    });
}

function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "0.00";

  const [inHours, inMinutes] = checkIn.split(":").map(Number);
  const [outHours, outMinutes] = checkOut.split(":").map(Number);

  const inTime = inHours * 60 + inMinutes;
  const outTime = outHours * 60 + outMinutes;

  const hours = (outTime - inTime) / 60;
  return hours.toFixed(2);
}
