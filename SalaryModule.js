// SalaryModule.js
import apiClient from "./apiClient.js";

export async function render(container) {
  try {
    // Show loading state
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-file-invoice-dollar"></i> Quản Lý Lương</h1>
        </div>
        <div class="module-card">
          <div class="module-card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu lương...</p>
          </div>
        </div>
      </div>
    `;

    // Fetch salary data from API
    const salaryData = await apiClient.request("/salary");
    const summaryData = await apiClient.request("/salary/summary");

    const report = salaryData.data || [];
    const summary = summaryData.data || {};

    const total = parseFloat(summary.total_net_salary) || 0;
    const avgSalary = report.length > 0 ? total / report.length : 0;

    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-file-invoice-dollar"></i> Quản Lý Lương</h1>
        </div>
        
        <div class="module-subheader">
          <p>Quản lý và theo dõi bảng lương nhân viên</p>
        </div>
        
        <!-- Stats Cards -->
        <div class="stats-container mb-4">
          <div class="stat-card">
            <div class="stat-icon blue">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="stat-info">
              <h4>${formatCurrency(total)}</h4>
              <p>Tổng Lương</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <h4>${report.length}</h4>
              <p>Tổng Nhân Viên</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple">
              <i class="fas fa-coins"></i>
            </div>
            <div class="stat-info">
              <h4>${formatCurrency(avgSalary)}</h4>
              <p>Lương Trung Bình</p>
            </div>
          </div>
        </div>
        
        <div class="module-card">
          <div class="module-card-header">
            <h2><i class="fas fa-list"></i> Bảng Lương Nhân Viên</h2>
          </div>
          <div class="module-card-body">
            <div class="module-table-container">
              <table class="module-table">
                <thead>
                  <tr>
                    <th>Mã NV</th>
                    <th>Họ Tên</th>
                    <th>Phòng Ban</th>
                    <th>Chức Vụ</th>
                    <th>Lương Cơ Bản</th>
                    <th>Thưởng</th>
                    <th>Khấu Trừ</th>
                    <th>Thực Nhận</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  ${report
                    .map(
                      (emp) =>
                        `<tr>
                          <td>${emp.employee_id}</td>
                          <td>${emp.name}</td>
                          <td>${emp.department_name || ""}</td>
                          <td>${emp.position_name || ""}</td>
                          <td>${formatCurrency(emp.base_salary || 0)}</td>
                          <td>${formatCurrency(emp.bonus || 0)}</td>
                          <td>${formatCurrency(emp.deduction || 0)}</td>
                          <td>${formatCurrency(emp.net_salary || 0)}</td>
                          <td class="module-table-actions">
                            <button data-id="${
                              emp.employee_id
                            }" class="btn btn-sm btn-warning update-btn">
                              <i class="fas fa-edit"></i> Điều Chỉnh
                            </button>
                          </td>
                        </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Update Salary Modal -->
        <div id="salary-modal" class="modal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Điều Chỉnh Lương</h3>
              <span class="close">&times;</span>
            </div>
            <div class="modal-body">
              <form id="salary-form" class="module-form">
                <input type="hidden" id="employee-id">
                <div class="module-form-group">
                  <label for="employee-name">Họ Tên Nhân Viên</label>
                  <input type="text" id="employee-name" class="module-form-control" readonly>
                </div>
                <div class="module-form-row">
                  <div class="module-form-col">
                    <div class="module-form-group">
                      <label for="bonus">Thưởng</label>
                      <input type="number" id="bonus" class="module-form-control" placeholder="Nhập số tiền thưởng" min="0" step="1000">
                    </div>
                  </div>
                  <div class="module-form-col">
                    <div class="module-form-group">
                      <label for="deduction">Khấu Trừ</label>
                      <input type="number" id="deduction" class="module-form-control" placeholder="Nhập số tiền khấu trừ" min="0" step="1000">
                    </div>
                  </div>
                </div>
                <div class="module-btn-group">
                  <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> Lưu
                  </button>
                  <button type="button" class="btn btn-secondary close-modal">
                    <i class="fas fa-times"></i> Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    container.querySelectorAll(".update-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.closest(".update-btn").dataset.id);
        const emp = report.find((employee) => employee.employee_id === id);
        if (emp) {
          openSalaryModal(emp);
        }
      });
    });

    // Modal event listeners
    const modal = container.querySelector("#salary-modal");
    const closeModal = () => {
      modal.style.display = "none";
    };

    container.querySelector(".close").addEventListener("click", closeModal);
    container
      .querySelector(".close-modal")
      .addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    container
      .querySelector("#salary-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById("employee-id").value);
        const bonus = parseFloat(document.getElementById("bonus").value) || 0;
        const deduction =
          parseFloat(document.getElementById("deduction").value) || 0;

        try {
          // Update salary via API
          await apiClient.request(`/salary/${id}`, {
            method: "PUT",
            body: JSON.stringify({
              bonus: bonus,
              deduction: deduction,
            }),
          });

          closeModal();
          showAlert("Cập nhật lương thành công!", "success");

          // Re-render the module to update the table
          setTimeout(() => {
            render(container);
          }, 1000);
        } catch (error) {
          showAlert("Cập nhật lương thất bại: " + error.message, "danger");
        }
      });
  } catch (error) {
    container.innerHTML = `
      <div class="module-container">
        <div class="module-alert module-alert-danger">
          <i class="fas fa-exclamation-circle"></i>
          <div class="module-alert-content">
            <h4>Lỗi Tải Dữ Liệu</h4>
            <p>Không thể tải dữ liệu lương: ${error.message}</p>
          </div>
        </div>
      </div>
    `;
  }
}

function openSalaryModal(employee) {
  const modal = document.getElementById("salary-modal");
  document.getElementById("employee-id").value = employee.employee_id;
  document.getElementById("employee-name").value = employee.name;
  document.getElementById("bonus").value = employee.bonus || 0;
  document.getElementById("deduction").value = employee.deduction || 0;

  modal.style.display = "block";
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
