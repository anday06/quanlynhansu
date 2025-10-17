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
    <div class="page-header">
      <h1><i class="fas fa-file-invoice-dollar"></i> Quản Lý Lương</h1>
      <p>Quản lý và theo dõi bảng lương nhân viên</p>
    </div>
    
    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card stat-card bg-primary text-white">
          <div class="card-body text-center">
            <h3>Tổng Lương</h3>
            <div class="value">${formatCurrency(total)}</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card stat-card bg-success text-white">
          <div class="card-body text-center">
            <h3>Tổng Nhân Viên</h3>
            <div class="value">${report.length}</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card stat-card bg-info text-white">
          <div class="card-body text-center">
            <h3>Lương Trung Bình</h3>
            <div class="value">${formatCurrency(avgSalary)}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-list"></i> Bảng Lương Nhân Viên</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="thead-dark">
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
                      <td>
                        <button data-id="${emp.id}" class="btn btn-sm btn-warning update-btn">
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
          <form id="salary-form">
            <input type="hidden" id="employee-id">
            <div class="form-group">
              <label for="employee-name">Họ Tên Nhân Viên</label>
              <input type="text" id="employee-name" class="form-control" readonly>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="bonus">Thưởng</label>
                <input type="number" id="bonus" class="form-control" placeholder="Nhập số tiền thưởng" min="0" step="1000">
              </div>
              <div class="form-group col-md-6">
                <label for="deduction">Khấu Trừ</label>
                <input type="number" id="deduction" class="form-control" placeholder="Nhập số tiền khấu trừ" min="0" step="1000">
              </div>
            </div>
            <div class="btn-group">
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
  `;
  
  // Add event listeners
  container.querySelectorAll(".update-btn").forEach(btn => {
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
    const deduction = parseFloat(document.getElementById("deduction").value) || 0;
    
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
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}