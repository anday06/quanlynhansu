// salaryAdjustmentModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as SalaryAdjustmentDb from "./SalaryAdjustmentDbModule.js";

export function render(container) {
  // Initialize the salary adjustment database
  SalaryAdjustmentDb.init();

  // Get all employees for the dropdown
  const employees = EmployeeDb.getAllEmployees();

  // Get all salary adjustments for the history table
  const adjustments = SalaryAdjustmentDb.getAllAdjustments();

  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-percentage"></i> Điều Chỉnh Lương</h1>
        <div class="module-header-actions">
          <button class="btn btn-info">
            <i class="fas fa-download"></i> Xuất báo cáo
          </button>
        </div>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-edit"></i> Form Điều Chỉnh Lương</h2>
        </div>
        <div class="module-card-body">
          <form id="salary-adjustment-form" class="module-form">
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="employeeSelect">Nhân viên</label>
                  <select id="employeeSelect" class="module-form-control" required>
                    <option value="">Chọn nhân viên</option>
                    ${employees
                      .map(
                        (emp) =>
                          `<option value="${emp.id}">${emp.name}</option>`
                      )
                      .join("")}
                  </select>
                </div>
              </div>
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="adjustmentType">Loại điều chỉnh</label>
                  <select id="adjustmentType" class="module-form-control">
                    <option value="increase">Tăng lương</option>
                    <option value="decrease">Giảm lương</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="adjustmentAmount">Số tiền điều chỉnh</label>
                  <input type="number" id="adjustmentAmount" class="module-form-control" placeholder="Nhập số tiền" required min="0">
                </div>
              </div>
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="effectiveDate">Ngày hiệu lực</label>
                  <input type="date" id="effectiveDate" class="module-form-control" required>
                </div>
              </div>
            </div>
            <div class="module-form-group">
              <label for="reason">Lý do điều chỉnh</label>
              <textarea id="reason" class="module-form-control" rows="3" placeholder="Nhập lý do điều chỉnh lương" required></textarea>
            </div>
            <div class="module-btn-group">
              <button type="submit" class="btn btn-success">
                <i class="fas fa-save"></i> Lưu Điều Chỉnh
              </button>
              <button type="button" class="btn btn-secondary" id="cancelBtn">
                <i class="fas fa-times"></i> Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-history"></i> Lịch Sử Điều Chỉnh</h2>
          <div class="module-card-actions">
            <button class="btn btn-sm btn-info">
              <i class="fas fa-filter"></i> Bộ lọc
            </button>
          </div>
        </div>
        <div class="module-card-body">
          <div class="module-table-container">
            <table class="module-table">
              <thead>
                <tr>
                  <th>Nhân viên</th>
                  <th>Loại điều chỉnh</th>
                  <th>Số tiền</th>
                  <th>Ngày hiệu lực</th>
                  <th>Lý do</th>
                  <th>Người thực hiện</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                ${adjustments
                  .map((adj) => {
                    const employee = EmployeeDb.getEmployeeById(adj.employeeId);
                    const employeeName = employee ? employee.name : "Unknown";
                    const typeText =
                      adj.type === "increase" ? "Tăng lương" : "Giảm lương";
                    const typeClass =
                      adj.type === "increase"
                        ? "module-badge-success"
                        : "module-badge-danger";
                    const formattedAmount = new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(adj.amount);

                    return `
                    <tr data-id="${adj.id}">
                      <td>${employeeName}</td>
                      <td><span class="module-badge ${typeClass}">${typeText}</span></td>
                      <td>${formattedAmount}</td>
                      <td>${formatDate(adj.effectiveDate)}</td>
                      <td>${adj.reason}</td>
                      <td>${adj.createdBy || "Admin"}</td>
                      <td class="module-table-actions">
                        <button class="btn btn-sm btn-info view-btn">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning edit-btn">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn">
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add event listeners
  const form = container.querySelector("#salary-adjustment-form");
  form.addEventListener("submit", handleFormSubmit);

  const cancelBtn = container.querySelector("#cancelBtn");
  cancelBtn.addEventListener("click", handleCancel);

  // Add event listeners for action buttons
  container.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", handleView);
  });

  container.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", handleEdit);
  });

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const employeeId = parseInt(form.employeeSelect.value);
  const type = form.adjustmentType.value;
  const amount = parseFloat(form.adjustmentAmount.value);
  const effectiveDate = form.effectiveDate.value;
  const reason = form.reason.value;

  if (!employeeId || !amount || !effectiveDate || !reason) {
    showAlert("Vui lòng điền đầy đủ thông tin!", "danger");
    return;
  }

  const adjustment = {
    employeeId,
    type,
    amount,
    effectiveDate,
    reason,
    createdBy: "Admin", // In a real app, this would be the current user
    createdAt: new Date().toISOString().split("T")[0],
  };

  SalaryAdjustmentDb.addAdjustment(adjustment);
  showAlert("Điều chỉnh lương đã được lưu thành công!", "success");
  form.reset();

  // Re-render the module to update the table
  const container = form.closest(".module-container").parentElement;
  render(container);
}

function handleCancel() {
  const form = document.getElementById("salary-adjustment-form");
  form.reset();
}

function handleView(e) {
  const row = e.target.closest("tr");
  const id = parseInt(row.dataset.id);
  const adjustments = SalaryAdjustmentDb.getAllAdjustments();
  const adjustment = adjustments.find((adj) => adj.id === id);

  if (adjustment) {
    const employee = EmployeeDb.getEmployeeById(adjustment.employeeId);
    const employeeName = employee ? employee.name : "Unknown";
    const typeText =
      adjustment.type === "increase" ? "Tăng lương" : "Giảm lương";
    const formattedAmount = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(adjustment.amount);

    alert(`Chi tiết điều chỉnh lương:
      Nhân viên: ${employeeName}
      Loại: ${typeText}
      Số tiền: ${formattedAmount}
      Ngày hiệu lực: ${formatDate(adjustment.effectiveDate)}
      Lý do: ${adjustment.reason}
      Người thực hiện: ${adjustment.createdBy || "Admin"}
      Ngày tạo: ${formatDate(adjustment.createdAt)}`);
  }
}

function handleEdit(e) {
  showAlert("Chức năng chỉnh sửa đang được phát triển!", "info");
}

function handleDelete(e) {
  if (confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
    const row = e.target.closest("tr");
    const id = parseInt(row.dataset.id);

    SalaryAdjustmentDb.deleteAdjustment(id);
    showAlert("Bản ghi đã được xóa thành công!", "success");

    // Re-render the module to update the table
    const container = row.closest(".module-container").parentElement;
    render(container);
  }
}

function showAlert(message, type) {
  // Create alert element
  const alert = document.createElement("div");
  alert.className = `module-alert module-alert-${type}`;
  alert.innerHTML = `
    <i class="fas fa-${
      type === "success"
        ? "check-circle"
        : type === "info"
        ? "info-circle"
        : "exclamation-circle"
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

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}
