// AddEmployeeModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

export function render(container) {
  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-user-plus"></i> Thêm Nhân Viên</h1>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-user"></i> Thông Tin Nhân Viên</h2>
        </div>
        <div class="module-card-body">
          <form id="add-employee-form" class="module-form">
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="name">Họ và Tên</label>
                  <input type="text" id="name" class="module-form-control" placeholder="Nhập họ và tên" required>
                </div>
              </div>
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="departmentId">Phòng Ban</label>
                  <select id="departmentId" class="module-form-control" required>
                    <option value="">Chọn phòng ban</option>
                    ${Department.getAllDepartments()
                      .map((d) => `<option value="${d.id}">${d.name}</option>`)
                      .join("")}
                  </select>
                </div>
              </div>
            </div>
            
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="positionId">Chức Vụ</label>
                  <select id="positionId" class="module-form-control" required>
                    <option value="">Chọn chức vụ</option>
                    ${Position.getAllPositions()
                      .map((p) => `<option value="${p.id}">${p.title}</option>`)
                      .join("")}
                  </select>
                </div>
              </div>
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="salary">Mức Lương Cơ Bản</label>
                  <input type="number" id="salary" class="module-form-control" placeholder="Nhập mức lương" required min="0">
                </div>
              </div>
            </div>
            
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="hireDate">Ngày Bắt Đầu Làm Việc</label>
                  <input type="date" id="hireDate" class="module-form-control" required>
                </div>
              </div>
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" class="module-form-control" placeholder="Nhập email">
                </div>
              </div>
            </div>
            
            <div class="module-form-group">
              <label for="address">Địa Chỉ</label>
              <textarea id="address" class="module-form-control" rows="3" placeholder="Nhập địa chỉ"></textarea>
            </div>
            
            <div class="module-btn-group">
              <button type="submit" class="btn btn-success">
                <i class="fas fa-save"></i> Thêm Nhân Viên
              </button>
              <button type="reset" class="btn btn-secondary">
                <i class="fas fa-undo"></i> Nhập Lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector("#add-employee-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const employee = {
      name: document.getElementById("name").value,
      departmentId: parseInt(document.getElementById("departmentId").value),
      positionId: parseInt(document.getElementById("positionId").value),
      salary: parseFloat(document.getElementById("salary").value),
      hireDate: document.getElementById("hireDate").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      bonus: 0,
      deduction: 0,
    };

    if (!validateEmployee(employee)) {
      showAlert("Vui lòng điền đầy đủ thông tin bắt buộc!", "danger");
      return;
    }

    EmployeeDb.addEmployee(employee);
    showAlert("Thêm nhân viên thành công!", "success");
    form.reset();
  });
}

function validateEmployee(emp) {
  return (
    emp.name &&
    emp.departmentId &&
    emp.positionId &&
    emp.salary > 0 &&
    emp.hireDate
  );
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

  // Insert alert before the form
  const form = document.getElementById("add-employee-form");
  form.parentNode.insertBefore(alert, form);

  // Remove alert after 3 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 3000);
}
