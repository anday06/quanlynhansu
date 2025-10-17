// DeleteEmployeeModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

export function render(container) {
  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-user-times"></i> Xóa Nhân Viên</h1>
      </div>
      
      <div class="module-subheader">
        <p>Xóa thông tin nhân viên khỏi hệ thống</p>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-search"></i> Thông Tin Xóa Nhân Viên</h2>
        </div>
        <div class="module-card-body">
          <form id="deleteForm" class="module-form">
            <div class="module-form-group">
              <label for="deleteId">Mã Nhân Viên</label>
              <input type="number" id="deleteId" class="module-form-control" placeholder="Nhập mã nhân viên cần xóa" required>
            </div>
            <button type="submit" class="btn btn-danger">
              <i class="fas fa-search"></i> Tìm Nhân Viên
            </button>
          </form>
        </div>
      </div>
      
      <div id="employeeInfo" class="module-card mt-4" style="display: none;">
        <div class="module-card-header">
          <h2><i class="fas fa-info-circle"></i> Thông Tin Nhân Viên</h2>
        </div>
        <div class="module-card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Mã Nhân Viên:</strong> <span id="infoId"></span></p>
              <p><strong>Họ Tên:</strong> <span id="infoName"></span></p>
              <p><strong>Phòng Ban:</strong> <span id="infoDepartment"></span></p>
            </div>
            <div class="col-md-6">
              <p><strong>Chức Vụ:</strong> <span id="infoPosition"></span></p>
              <p><strong>Lương Cơ Bản:</strong> <span id="infoSalary"></span></p>
              <p><strong>Ngày Vào Làm:</strong> <span id="infoHireDate"></span></p>
            </div>
          </div>
          <div class="module-btn-group">
            <button id="confirmDelete" class="btn btn-danger">
              <i class="fas fa-trash"></i> Xác Nhận Xóa
            </button>
            <button id="cancelDelete" class="btn btn-secondary">
              <i class="fas fa-times"></i> Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector("#deleteForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("deleteId").value);
    const emp = EmployeeDb.getEmployeeById(id);
    if (!emp) {
      showAlert("Không tìm thấy nhân viên", "error");
      return;
    }

    // Display employee info
    document.getElementById("infoId").textContent = emp.id;
    document.getElementById("infoName").textContent = emp.name;
    document.getElementById("infoDepartment").textContent = getDepartmentName(
      emp.departmentId
    );
    document.getElementById("infoPosition").textContent = getPositionName(
      emp.positionId
    );
    document.getElementById("infoSalary").textContent = formatCurrency(
      emp.salary
    );
    document.getElementById("infoHireDate").textContent = formatDate(
      emp.hireDate
    );

    document.getElementById("employeeInfo").style.display = "block";

    // Scroll to employee info
    document
      .getElementById("employeeInfo")
      .scrollIntoView({ behavior: "smooth" });
  });

  // Confirm delete button
  container.addEventListener("click", (e) => {
    if (e.target.id === "confirmDelete") {
      const id = parseInt(document.getElementById("deleteId").value);
      const emp = EmployeeDb.getEmployeeById(id);
      if (emp && confirm(`Bạn có chắc chắn muốn xóa nhân viên ${emp.name}?`)) {
        EmployeeDb.deleteEmployee(id);
        showAlert("Xóa nhân viên thành công", "success");
        form.reset();
        document.getElementById("employeeInfo").style.display = "none";
      }
    }

    if (e.target.id === "cancelDelete") {
      document.getElementById("employeeInfo").style.display = "none";
      document.getElementById("deleteId").focus();
    }
  });
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

// Helper functions to get department and position names
function getDepartmentName(deptId) {
  const departments = Department.getAllDepartments();
  const dept = departments.find((d) => d.id === deptId);
  return dept ? dept.name : "Không xác định";
}

function getPositionName(posId) {
  const positions = Position.getAllPositions();
  const pos = positions.find((p) => p.id === posId);
  return pos ? pos.title : "Không xác định";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}
