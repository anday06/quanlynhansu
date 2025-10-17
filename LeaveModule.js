// LeaveModule.js
const LEAVES_KEY = "leaves";
const BALANCE_DEFAULT = 20;

export function init() {
  if (!localStorage.getItem(LEAVES_KEY)) {
    saveLeaves([]);
  }
}

export function requestLeave(employeeId, startDate, endDate, type) {
  const leaves = getLeaves();
  const id = Math.max(...leaves.map((l) => l.id || 0), 0) + 1;
  leaves.push({ id, employeeId, startDate, endDate, type, status: "pending" });
  saveLeaves(leaves);
}

export function approveLeave(leaveId) {
  let leaves = getLeaves();
  const leave = leaves.find((l) => l.id === leaveId);
  if (leave) {
    leave.status = "approved";
    // Update balance (simplified, assume deduct days)
    saveLeaves(leaves);
  }
}

export function getLeaveBalance(employeeId) {
  // Simplified: default - approved days
  const approved = getLeaves().filter(
    (l) => l.employeeId === employeeId && l.status === "approved"
  );
  const daysUsed = approved.reduce(
    (sum, l) =>
      sum +
      (new Date(l.endDate) - new Date(l.startDate)) / (1000 * 60 * 60 * 24),
    0
  );
  return BALANCE_DEFAULT - daysUsed;
}

function getLeaves() {
  return JSON.parse(localStorage.getItem(LEAVES_KEY)) || [];
}

function saveLeaves(leaves) {
  localStorage.setItem(LEAVES_KEY, JSON.stringify(leaves));
}

export function render(container) {
  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-calendar-alt"></i> Quản Lý Nghỉ Phép</h1>
      </div>
      
      <div class="module-subheader">
        <p>Quản lý yêu cầu nghỉ phép và ngày nghỉ còn lại của nhân viên</p>
      </div>
      
      <div class="row">
        <div class="col-md-6">
          <div class="module-card">
            <div class="module-card-header">
              <h2><i class="fas fa-plus-circle"></i> Yêu Cầu Nghỉ Phép</h2>
            </div>
            <div class="module-card-body">
              <form id="requestForm" class="module-form">
                <div class="module-form-group">
                  <label for="leaveEmpId">Mã Nhân Viên</label>
                  <input type="number" id="leaveEmpId" class="module-form-control" placeholder="Nhập mã nhân viên" required>
                </div>
                
                <div class="module-form-row">
                  <div class="module-form-col">
                    <div class="module-form-group">
                      <label for="startDate">Ngày Bắt Đầu</label>
                      <input type="date" id="startDate" class="module-form-control" required>
                    </div>
                  </div>
                  <div class="module-form-col">
                    <div class="module-form-group">
                      <label for="endDate">Ngày Kết Thúc</label>
                      <input type="date" id="endDate" class="module-form-control" required>
                    </div>
                  </div>
                </div>
                
                <div class="module-form-group">
                  <label for="type">Loại Nghỉ Phép</label>
                  <select id="type" class="module-form-control">
                    <option value="annual">Nghỉ Phép Năm</option>
                    <option value="sick">Nghỉ Ốm</option>
                    <option value="personal">Nghỉ Cá Nhân</option>
                    <option value="maternity">Nghỉ Sinh Sản</option>
                  </select>
                </div>
                
                <button type="submit" class="btn btn-success">
                  <i class="fas fa-paper-plane"></i> Gửi Yêu Cầu
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="module-card">
            <div class="module-card-header">
              <h2><i class="fas fa-balance-scale"></i> Kiểm Tra Số Ngày Nghỉ</h2>
            </div>
            <div class="module-card-body">
              <form id="balanceForm" class="module-form">
                <div class="module-form-group">
                  <label for="balanceEmpId">Mã Nhân Viên</label>
                  <input type="number" id="balanceEmpId" class="module-form-control" placeholder="Nhập mã nhân viên" required>
                </div>
                <button type="submit" class="btn btn-info">
                  <i class="fas fa-search"></i> Kiểm Tra
                </button>
              </form>
              
              <div id="balanceResult" class="mt-3" style="display: none;">
                <div class="module-alert module-alert-info">
                  <i class="fas fa-info-circle"></i>
                  <div class="module-alert-content">
                    <h5>Số Ngày Nghỉ Còn Lại: <span id="balanceValue"></span> ngày</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="module-card mt-4">
        <div class="module-card-header">
          <h2><i class="fas fa-list"></i> Danh Sách Yêu Cầu Nghỉ Phép</h2>
        </div>
        <div class="module-card-body">
          <div class="module-table-container">
            <table class="module-table">
              <thead>
                <tr>
                  <th>Mã Yêu Cầu</th>
                  <th>Mã Nhân Viên</th>
                  <th>Ngày Bắt Đầu</th>
                  <th>Ngày Kết Thúc</th>
                  <th>Loại</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody id="leavesTable">
                ${getLeaves()
                  .map(
                    (l) =>
                      `<tr>
                        <td>${l.id}</td>
                        <td>${l.employeeId}</td>
                        <td>${formatDate(l.startDate)}</td>
                        <td>${formatDate(l.endDate)}</td>
                        <td>${getLeaveTypeText(l.type)}</td>
                        <td><span class="module-badge module-badge-${getStatusClass(
                          l.status
                        )}">${getStatusText(l.status)}</span></td>
                        <td class="module-table-actions">
                          ${
                            l.status === "pending"
                              ? `<button data-id="${l.id}" class="btn btn-sm btn-success approve-btn">
                              <i class="fas fa-check"></i> Duyệt
                            </button>`
                              : "<span>-</span>"
                          }
                        </td>
                      </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Set default dates to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").value = today;
  document.getElementById("endDate").value = today;

  // Add event listeners
  container.querySelector("#requestForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("leaveEmpId").value);
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    const type = document.getElementById("type").value;
    requestLeave(id, start, end, type);
    showAlert("Yêu cầu nghỉ phép đã được gửi", "success");
    render(container);
  });

  container.querySelector("#balanceForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("balanceEmpId").value);
    const balance = getLeaveBalance(id);
    document.getElementById("balanceValue").textContent = balance;
    document.getElementById("balanceResult").style.display = "block";
  });

  // Approve leave buttons
  container.querySelectorAll(".approve-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest(".approve-btn").dataset.id);
      approveLeave(id);
      render(container);
    });
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function getLeaveTypeText(type) {
  const types = {
    annual: "Nghỉ Phép Năm",
    sick: "Nghỉ Ốm",
    personal: "Nghỉ Cá Nhân",
    maternity: "Nghỉ Sinh Sản",
  };
  return types[type] || type;
}

function getStatusText(status) {
  const statuses = {
    pending: "Chờ Duyệt",
    approved: "Đã Duyệt",
    rejected: "Từ Chối",
  };
  return statuses[status] || status;
}

function getStatusClass(status) {
  const classes = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };
  return classes[status] || "secondary";
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