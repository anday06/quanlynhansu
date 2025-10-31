// LeaveModule.js
import apiClient from "./apiClient.js";

let leaveRecords = [];
let leavePolicies = null;
let isLoaded = false;

export async function init() {
  try {
    console.log("Loading leave records from API...");
    const response = await apiClient.request("/leaves");
    console.log("Leave data received:", response);
    // Đảm bảo luôn trả về mảng
    leaveRecords = Array.isArray(response.data) ? response.data : [];
    isLoaded = true;
    console.log("Leave records loaded:", leaveRecords);
  } catch (error) {
    console.error("Failed to load leave records:", error);
    // Cung cấp dữ liệu mặc định nếu không thể tải từ API
    leaveRecords = [];
    isLoaded = true;
  }

  // Load leave policies from API
  try {
    const policiesResponse = await apiClient.getLeavePolicies();
    leavePolicies = Array.isArray(policiesResponse.data)
      ? policiesResponse.data
      : [];
  } catch (error) {
    console.error("Failed to load leave policies:", error);
    // Fallback to default policies if API fails
    leavePolicies = [
      { type: "annual", name: "Nghỉ phép năm" },
      { type: "sick", name: "Nghỉ ốm" },
      { type: "personal", name: "Nghỉ cá nhân" },
      { type: "maternity", name: "Nghỉ thai sản" },
      { type: "paternity", name: "Nghỉ chăm con nhỏ" },
    ];
  }
}

export async function requestLeave(employeeId, startDate, endDate, type) {
  try {
    const leaveData = {
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate,
      type: type,
      status: "pending",
    };

    const response = await apiClient.request("/leaves", {
      method: "POST",
      body: JSON.stringify(leaveData),
    });

    // Reload leave records
    await init();

    return response;
  } catch (error) {
    console.error("Failed to request leave:", error);
    throw new Error("Failed to request leave: " + error.message);
  }
}

export async function approveLeave(leaveId) {
  try {
    const updateData = {
      status: "approved",
    };

    const response = await apiClient.request(`/leaves/${leaveId}/status`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });

    // Reload leave records
    await init();

    return response;
  } catch (error) {
    console.error("Failed to approve leave:", error);
    throw new Error("Failed to approve leave: " + error.message);
  }
}

export async function getLeaveBalance(employeeId) {
  try {
    const response = await apiClient.request(`/leaves/balance/${employeeId}`);
    return response.data || { annual: 0, sick: 0 };
  } catch (error) {
    console.error("Failed to get leave balance:", error);
    // Return default balance if API fails
    return { annual: 20, sick: 10 };
  }
}

export async function render(container) {
  // Ensure leave records and policies are loaded
  if (!isLoaded) {
    // Show loading state while data is being fetched
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-calendar-alt"></i> Quản Lý Nghỉ Phép</h1>
        </div>
        <div class="module-card">
          <div class="module-card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu nghỉ phép...</p>
          </div>
        </div>
      </div>
    `;

    // Wait for data to load
    await init();
  }

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
                    ${leavePolicies
                      .map(
                        (policy) =>
                          `<option value="${policy.type}">${policy.name}</option>`
                      )
                      .join("")}
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
                ${leaveRecords
                  .map(
                    (l) =>
                      `<tr>
                        <td>${l.id}</td>
                        <td>${l.employee_id}</td>
                        <td>${formatDate(l.start_date)}</td>
                        <td>${formatDate(l.end_date)}</td>
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
  container
    .querySelector("#requestForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = parseInt(document.getElementById("leaveEmpId").value);
      const start = document.getElementById("startDate").value;
      const end = document.getElementById("endDate").value;
      const type = document.getElementById("type").value;

      try {
        await requestLeave(id, start, end, type);
        showAlert("Yêu cầu nghỉ phép đã được gửi", "success");
        await render(container);
      } catch (error) {
        showAlert("Gửi yêu cầu thất bại: " + error.message, "danger");
      }
    });

  container
    .querySelector("#balanceForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = parseInt(document.getElementById("balanceEmpId").value);

      try {
        const balance = await getLeaveBalance(id);
        document.getElementById("balanceValue").textContent =
          JSON.stringify(balance);
        document.getElementById("balanceResult").style.display = "block";
      } catch (error) {
        showAlert(
          "Lấy thông tin số ngày nghỉ thất bại: " + error.message,
          "danger"
        );
      }
    });

  // Approve leave buttons
  container.querySelectorAll(".approve-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = parseInt(e.target.closest(".approve-btn").dataset.id);
      try {
        await approveLeave(id);
        showAlert("Duyệt yêu cầu thành công", "success");
        await render(container);
      } catch (error) {
        showAlert("Duyệt yêu cầu thất bại: " + error.message, "danger");
      }
    });
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function getLeaveTypeText(type) {
  // Use the leave policies data to get the proper name
  if (leavePolicies) {
    const policy = leavePolicies.find((p) => p.type === type);
    if (policy) {
      return policy.name;
    }
  }

  // Fallback to hardcoded translations
  const types = {
    annual: "Nghỉ Phép Năm",
    sick: "Nghỉ Ốm",
    personal: "Nghỉ Cá Nhân",
    maternity: "Nghỉ Thai Sản",
    paternity: "Nghỉ Chăm Con Nhỏ",
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
  `;

  // Insert alert at the top of the container
  const container = document.querySelector(".module-container");
  container.insertBefore(alert, container.firstChild.nextSibling);

  // Remove alert after 3 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 3000);
}
