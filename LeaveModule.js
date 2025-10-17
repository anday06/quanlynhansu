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
    <div class="page-header">
      <h1><i class="fas fa-calendar-alt"></i> Quản Lý Nghỉ Phép</h1>
      <p>Quản lý yêu cầu nghỉ phép và ngày nghỉ còn lại của nhân viên</p>
    </div>
    
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-plus-circle"></i> Yêu Cầu Nghỉ Phép</h3>
          </div>
          <div class="card-body">
            <form id="requestForm">
              <div class="form-group">
                <label for="leaveEmpId">Mã Nhân Viên</label>
                <input type="number" id="leaveEmpId" class="form-control" placeholder="Nhập mã nhân viên" required>
              </div>
              
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="startDate">Ngày Bắt Đầu</label>
                  <input type="date" id="startDate" class="form-control" required>
                </div>
                <div class="form-group col-md-6">
                  <label for="endDate">Ngày Kết Thúc</label>
                  <input type="date" id="endDate" class="form-control" required>
                </div>
              </div>
              
              <div class="form-group">
                <label for="type">Loại Nghỉ Phép</label>
                <select id="type" class="form-control">
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
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-balance-scale"></i> Kiểm Tra Số Ngày Nghỉ</h3>
          </div>
          <div class="card-body">
            <form id="balanceForm">
              <div class="form-group">
                <label for="balanceEmpId">Mã Nhân Viên</label>
                <input type="number" id="balanceEmpId" class="form-control" placeholder="Nhập mã nhân viên" required>
              </div>
              <button type="submit" class="btn btn-info">
                <i class="fas fa-search"></i> Kiểm Tra
              </button>
            </form>
            
            <div id="balanceResult" class="mt-3" style="display: none;">
              <div class="alert alert-info">
                <h5>Số Ngày Nghỉ Còn Lại: <span id="balanceValue"></span> ngày</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card mt-4">
      <div class="card-header">
        <h3><i class="fas fa-list"></i> Danh Sách Yêu Cầu Nghỉ Phép</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="thead-dark">
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
                      <td><span class="badge badge-${getStatusClass(
                        l.status
                      )}">${getStatusText(l.status)}</span></td>
                      <td>
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
      if (confirm("Bạn có chắc chắn muốn duyệt yêu cầu nghỉ phép này?")) {
        approveLeave(id);
        showAlert("Yêu cầu nghỉ phép đã được duyệt", "success");
        render(container);
      }
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
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;

  // Insert alert at the top of container
  const container = document.querySelector(".page-header").nextElementSibling;
  container.parentNode.insertBefore(alert, container);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 3000);
}
