// SalaryModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";

export function calculateNetSalary(employee) {
  return employee.salary + (employee.bonus || 0) - (employee.deduction || 0);
}

export function generatePayrollReport() {
  return EmployeeDb.getAllEmployees().map((emp) => ({
    ...emp,
    netSalary: calculateNetSalary(emp),
  }));
}

// Higher-order with map/reduce
export const totalPayroll = () =>
  generatePayrollReport().reduce((sum, emp) => sum + emp.netSalary, 0);

export function render(container) {
  const report = generatePayrollReport();
  const total = totalPayroll();
  const avgSalary = total / report.length || 0;

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
                        <td>${emp.id}</td>
                        <td>${emp.name}</td>
                        <td>${formatCurrency(emp.salary)}</td>
                        <td>${formatCurrency(emp.bonus || 0)}</td>
                        <td>${formatCurrency(emp.deduction || 0)}</td>
                        <td>${formatCurrency(emp.netSalary)}</td>
                        <td class="module-table-actions">
                          <button data-id="${
                            emp.id
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
      const emp = EmployeeDb.getEmployeeById(id);
      openSalaryModal(emp);
    });
  });

  // Modal event listeners
  const modal = container.querySelector("#salary-modal");
  const closeModal = () => {
    modal.style.display = "none";
  };

  container.querySelector(".close").addEventListener("click", closeModal);
  container.querySelector(".close-modal").addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  container.querySelector("#salary-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("employee-id").value);
    const bonus = parseFloat(document.getElementById("bonus").value) || 0;
    const deduction =
      parseFloat(document.getElementById("deduction").value) || 0;

    let emp = EmployeeDb.getEmployeeById(id);
    emp = { ...emp, bonus, deduction };
    EmployeeDb.updateEmployee(emp);

    closeModal();
    render(container);
  });
}

function openSalaryModal(employee) {
  const modal = document.getElementById("salary-modal");
  document.getElementById("employee-id").value = employee.id;
  document.getElementById("employee-name").value = employee.name;
  document.getElementById("bonus").value = employee.bonus || 0;
  document.getElementById("deduction").value = employee.deduction || 0;

  modal.style.display = "block";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
