// AddEmployeeModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-user-plus"></i> Thêm Nhân Viên</h1>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-user"></i> Thông Tin Nhân Viên</h3>
      </div>
      <form id="add-employee-form">
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="name">Họ và Tên</label>
              <input type="text" id="name" class="form-control" placeholder="Nhập họ và tên" required>
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="departmentId">Phòng Ban</label>
              <select id="departmentId" class="form-control" required>
                <option value="">Chọn phòng ban</option>
                ${Department.getAllDepartments()
                  .map((d) => `<option value="${d.id}">${d.name}</option>`)
                  .join("")}
              </select>
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="positionId">Chức Vụ</label>
              <select id="positionId" class="form-control" required>
                <option value="">Chọn chức vụ</option>
                ${Position.getAllPositions()
                  .map((p) => `<option value="${p.id}">${p.title}</option>`)
                  .join("")}
              </select>
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="salary">Mức Lương Cơ Bản</label>
              <input type="number" id="salary" class="form-control" placeholder="Nhập mức lương" required min="0">
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="hireDate">Ngày Bắt Đầu Làm Việc</label>
              <input type="date" id="hireDate" class="form-control" required>
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-control" placeholder="Nhập email">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="address">Địa Chỉ</label>
          <textarea id="address" class="form-control" rows="3" placeholder="Nhập địa chỉ"></textarea>
        </div>
        
        <div class="btn-group">
          <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> Thêm Nhân Viên
          </button>
          <button type="reset" class="btn btn-secondary">
            <i class="fas fa-undo"></i> Nhập Lại
          </button>
        </div>
      </form>
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
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <i class="fas fa-${
      type === "success" ? "check-circle" : "exclamation-circle"
    }"></i>
    <div>${message}</div>
  `;

  // Insert alert before the form
  const form = document.getElementById("add-employee-form");
  form.parentNode.insertBefore(alert, form);

  // Remove alert after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}
