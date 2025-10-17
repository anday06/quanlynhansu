// EditEmployeeModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

let currentEditId = null; // Closure for state

export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <h2>Chỉnh Sửa Nhân Viên</h2>
      <p>Chỉnh sửa thông tin nhân viên trong hệ thống</p>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3>Tìm Nhân Viên</h3>
      </div>
      <div class="card-body">
        <form id="searchForm" class="form-inline">
          <div class="form-group">
            <label for="editId">Mã Nhân Viên</label>
            <input type="number" id="editId" class="form-control" placeholder="Nhập mã nhân viên" required>
          </div>
          <button type="submit" class="btn btn-primary">Tải Thông Tin</button>
        </form>
      </div>
    </div>
    
    <div id="editFormContainer"></div>
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
      <div class="card mt-4">
        <div class="card-header">
          <h3>Chỉnh Sửa Thông Tin</h3>
        </div>
        <div class="card-body">
          <form id="editForm">
            <div class="form-group">
              <label for="editName">Họ Tên</label>
              <input type="text" id="editName" class="form-control" value="${
                emp.name
              }" required>
            </div>
            
            <div class="form-group">
              <label for="editDepartmentId">Phòng Ban</label>
              <select id="editDepartmentId" class="form-control">
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
            
            <div class="form-group">
              <label for="editPositionId">Chức Vụ</label>
              <select id="editPositionId" class="form-control">
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
            
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="editSalary">Lương Cơ Bản</label>
                <input type="number" id="editSalary" class="form-control" value="${
                  emp.salary
                }" required min="0">
              </div>
              
              <div class="form-group col-md-6">
                <label for="editHireDate">Ngày Vào Làm</label>
                <input type="date" id="editHireDate" class="form-control" value="${
                  emp.hireDate
                }" required>
              </div>
            </div>
            
            <button type="submit" class="btn btn-success">Cập Nhật</button>
            <button type="button" id="cancelEdit" class="btn btn-secondary">Hủy</button>
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
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;

  // Insert alert before the first card
  const firstCard = document.querySelector(".card");
  firstCard.parentNode.insertBefore(alert, firstCard);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 3000);
}
