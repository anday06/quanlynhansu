// EditEmployeeModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

let currentEditId = null; // Closure for state

export function render(container) {
  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-user-edit"></i> Chỉnh Sửa Nhân Viên</h1>
      </div>
      
      <div class="module-subheader">
        <p>Chỉnh sửa thông tin nhân viên trong hệ thống</p>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-search"></i> Tìm Nhân Viên</h2>
        </div>
        <div class="module-card-body">
          <form id="searchForm" class="module-form">
            <div class="module-form-group">
              <label for="editId">Mã Nhân Viên</label>
              <input type="number" id="editId" class="module-form-control" placeholder="Nhập mã nhân viên" required>
            </div>
            <button type="submit" class="btn btn-primary">Tải Thông Tin</button>
          </form>
        </div>
      </div>
      
      <div id="editFormContainer"></div>
    </div>
  `;

  const searchForm = container.querySelector("#searchForm");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("editId").value);
    const emp = EmployeeDb.getEmployeeById(id);
    if (!emp) {
      showAlert("Không tìm thấy nhân viên", "error");
      return;
    }
    currentEditId = id;

    const editFormContainer = document.getElementById("editFormContainer");
    editFormContainer.innerHTML = `
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-edit"></i> Chỉnh Sửa Thông Tin</h2>
        </div>
        <div class="module-card-body">
          <form id="editForm" class="module-form">
            <div class="module-form-group">
              <label for="editName">Họ Tên</label>
              <input type="text" id="editName" class="module-form-control" value="${
                emp.name
              }" required>
            </div>
            
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="editDepartmentId">Phòng Ban</label>
                  <select id="editDepartmentId" class="module-form-control">
                    ${Department.getAllDepartments()
                      .map(
                        (d) =>
                          `<option value="${d.id}" ${
                            d.id === emp.departmentId ? "selected" : ""
                          }>${d.name}</option>`
                      )
                      .join("")}
                  </select>
                </div>
              </div>
              
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="editPositionId">Chức Vụ</label>
                  <select id="editPositionId" class="module-form-control">
                    ${Position.getAllPositions()
                      .map(
                        (p) =>
                          `<option value="${p.id}" ${
                            p.id === emp.positionId ? "selected" : ""
                          }>${p.title}</option>`
                      )
                      .join("")}
                  </select>
                </div>
              </div>
            </div>
            
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="editSalary">Lương Cơ Bản</label>
                  <input type="number" id="editSalary" class="module-form-control" value="${
                    emp.salary
                  }" required min="0">
                </div>
              </div>
              
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="editHireDate">Ngày Vào Làm</label>
                  <input type="date" id="editHireDate" class="module-form-control" value="${
                    emp.hireDate
                  }" required>
                </div>
              </div>
            </div>
            
            <div class="module-btn-group">
              <button type="submit" class="btn btn-success">Cập Nhật</button>
              <button type="button" id="cancelEdit" class="btn btn-secondary">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const editForm = editFormContainer.querySelector("#editForm");
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const updated = {
        id: currentEditId,
        name: document.getElementById("editName").value,
        departmentId: parseInt(
          document.getElementById("editDepartmentId").value
        ),
        positionId: parseInt(document.getElementById("editPositionId").value),
        salary: parseFloat(document.getElementById("editSalary").value),
        hireDate: document.getElementById("editHireDate").value,
        bonus: emp.bonus,
        deduction: emp.deduction,
      };
      if (!validateEmployee(updated)) {
        showAlert("Thông tin không hợp lệ", "error");
        return;
      }
      if (confirm("Xác nhận cập nhật thông tin nhân viên?")) {
        EmployeeDb.updateEmployee(updated);
        showAlert("Cập nhật thành công", "success");
        editFormContainer.innerHTML = "";
        document.getElementById("searchForm").reset();
      }
    });

    const cancelBtn = editFormContainer.querySelector("#cancelEdit");
    cancelBtn.addEventListener("click", () => {
      editFormContainer.innerHTML = "";
      document.getElementById("searchForm").reset();
    });
  });
}

function validateEmployee(emp) {
  return emp.name && emp.salary > 0 && emp.hireDate;
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

  // Insert alert before the first card
  const firstCard = document.querySelector(".module-card");
  firstCard.parentNode.insertBefore(alert, firstCard);

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
