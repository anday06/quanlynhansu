// DeleteEmployeeModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";

export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <h2>Xóa Nhân Viên</h2>
      <p>Xóa thông tin nhân viên khỏi hệ thống</p>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3>Thông Tin Xóa Nhân Viên</h3>
      </div>
      <div class="card-body">
        <form id="deleteForm">
          <div class="form-group">
            <label for="deleteId">Mã Nhân Viên</label>
            <input type="number" id="deleteId" class="form-control" placeholder="Nhập mã nhân viên cần xóa" required>
          </div>
          <button type="submit" class="btn btn-danger">Xóa Nhân Viên</button>
        </form>
      </div>
    </div>
    
    <div id="employeeInfo" class="card mt-4" style="display: none;">
      <div class="card-header">
        <h3>Thông Tin Nhân Viên</h3>
      </div>
      <div class="card-body">
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
        <button id="confirmDelete" class="btn btn-danger">Xác Nhận Xóa</button>
        <button id="cancelDelete" class="btn btn-secondary">Hủy</button>
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
  // Remove existing alerts
  const existingAlert = document.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }

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
  const container = document
    .querySelector("#deleteForm")
    .closest(".card").parentNode;
  container.insertBefore(alert, container.firstChild);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 3000);
}

// Helper functions to get department and position names
function getDepartmentName(deptId) {
  // This would normally import from DepartmentModule
  const departments = JSON.parse(localStorage.getItem("departments")) || [
    { id: 1, name: "Phòng Kỹ Thuật" },
    { id: 2, name: "Phòng Kinh Doanh" },
    { id: 3, name: "Phòng Nhân Sự" },
  ];
  const dept = departments.find((d) => d.id === deptId);
  return dept ? dept.name : "Không xác định";
}

function getPositionName(posId) {
  // This would normally import from PositionModule
  const positions = JSON.parse(localStorage.getItem("positions")) || [
    { id: 1, title: "Nhân Viên" },
    { id: 2, title: "Trưởng Phòng" },
    { id: 3, title: "Phó Phòng" },
  ];
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
