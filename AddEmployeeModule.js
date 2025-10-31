// AddEmployeeModule.js
import apiClient from "./apiClient.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

export async function render(container) {
  console.log("Rendering AddEmployeeModule");

  // Always try to load fresh data
  try {
    // Show loading state while data is being fetched
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-user-plus"></i> Thêm Nhân Viên</h1>
        </div>
        <div class="module-card">
          <div class="module-card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu phòng ban và chức vụ...</p>
          </div>
        </div>
      </div>
    `;

    // Force reload the data
    console.log("Loading departments...");
    await Department.init();
    console.log("Loading positions...");
    await Position.init();

    console.log("Departments loaded:", Department.getAllDepartments());
    console.log("Positions loaded:", Position.getAllPositions());
  } catch (error) {
    console.error("Failed to load required data:", error);
    container.innerHTML = `
      <div class="module-container">
        <div class="module-alert module-alert-danger">
          <i class="fas fa-exclamation-circle"></i>
          <div class="module-alert-content">
            <h4>Lỗi Tải Dữ Liệu</h4>
            <p>Không thể tải dữ liệu phòng ban và chức vụ: ${error.message}</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Get fresh data
  const departments = Department.getAllDepartments();
  const positions = Position.getAllPositions();

  // Kiểm tra kỹ hơn dữ liệu
  console.log("Departments data:", departments);
  console.log("Positions data:", positions);
  console.log("Is departments array:", Array.isArray(departments));
  console.log("Is positions array:", Array.isArray(positions));
  console.log("Departments length:", departments ? departments.length : "null");
  console.log("Positions length:", positions ? positions.length : "null");

  if (
    !Array.isArray(departments) ||
    !Array.isArray(positions) ||
    departments.length === 0 ||
    positions.length === 0
  ) {
    container.innerHTML = `
      <div class="module-container">
        <div class="module-alert module-alert-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <div class="module-alert-content">
            <h4>Dữ Liệu Không Hợp Lệ</h4>
            <p>Dữ liệu phòng ban hoặc chức vụ không hợp lệ. Vui lòng thử lại.</p>
            <p>Departments: ${
              Array.isArray(departments) ? departments.length : "Invalid"
            } items</p>
            <p>Positions: ${
              Array.isArray(positions) ? positions.length : "Invalid"
            } items</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

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
                    ${
                      departments.length > 0
                        ? departments
                            .map(
                              (d, index) =>
                                `<option value="${d.id}">[${index + 1}] ${
                                  d.name
                                }</option>`
                            )
                            .join("")
                        : "<option value=''>Không có phòng ban</option>"
                    }
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
                    ${
                      positions.length > 0
                        ? positions
                            .map(
                              (p, index) =>
                                `<option value="${p.id}">[${index + 1}] ${
                                  p.title
                                }</option>`
                            )
                            .join("")
                        : "<option value=''>Không có chức vụ</option>"
                    }
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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const employee = {
      name: document.getElementById("name").value,
      department_id: parseInt(document.getElementById("departmentId").value),
      position_id: parseInt(document.getElementById("positionId").value),
      salary: parseFloat(document.getElementById("salary").value),
      hire_date: document.getElementById("hireDate").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      bonus: 0,
      deduction: 0,
    };

    console.log("Submitting employee data:", employee);

    if (!validateEmployee(employee)) {
      showAlert("Vui lòng điền đầy đủ thông tin bắt buộc!", "danger");
      return;
    }

    try {
      await apiClient.createEmployee(employee);
      showAlert("Thêm nhân viên thành công!", "success");
      form.reset();

      // Refresh department and position data
      await Department.init();
      await Position.init();
    } catch (error) {
      console.error("Failed to add employee:", error);
      showAlert("Thêm nhân viên thất bại: " + error.message, "danger");
    }
  });
}

function validateEmployee(emp) {
  console.log("Validating employee:", emp);
  const isValid =
    emp.name &&
    emp.department_id &&
    emp.position_id &&
    emp.salary !== undefined &&
    emp.hire_date;
  console.log("Employee validation result:", isValid);
  return isValid;
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
