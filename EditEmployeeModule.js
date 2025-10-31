// EditEmployeeModule.js
import apiClient from "./apiClient.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

let currentEditId = null; // Closure for state

export async function render(container) {
  // Force reload department and position data to ensure we have latest data
  try {
    await Department.init();
    await Position.init();
  } catch (error) {
    console.error("Failed to load department/position data:", error);
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
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("editId").value);

    try {
      // Ensure we have fresh department and position data
      await Department.init();
      await Position.init();

      const emp = await apiClient.getEmployee(id);
      if (!emp) {
        showAlert("Không tìm thấy nhân viên", "error");
        return;
      }
      currentEditId = id;

      // Get fresh department and position data
      const departments = Department.getAllDepartments();
      const positions = Position.getAllPositions();

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
                  emp.name || ""
                }" required>
              </div>
              
              <div class="module-form-row">
                <div class="module-form-col">
                  <div class="module-form-group">
                    <label for="editDepartmentId">Phòng Ban</label>
                    <select id="editDepartmentId" class="module-form-control">
                      ${
                        Array.isArray(departments) && departments.length > 0
                          ? departments
                              .map(
                                (d, index) =>
                                  `<option value="${d.id}" ${
                                    parseInt(d.id) ===
                                    parseInt(emp.department_id)
                                      ? "selected"
                                      : ""
                                  }>[${index + 1}] ${d.name}</option>`
                              )
                              .join("")
                          : '<option value="">Không có phòng ban</option>'
                      }
                    </select>
                  </div>
                </div>
                
                <div class="module-form-col">
                  <div class="module-form-group">
                    <label for="editPositionId">Chức Vụ</label>
                    <select id="editPositionId" class="module-form-control">
                      ${
                        Array.isArray(positions) && positions.length > 0
                          ? positions
                              .map(
                                (p, index) =>
                                  `<option value="${p.id}" ${
                                    parseInt(p.id) === parseInt(emp.position_id)
                                      ? "selected"
                                      : ""
                                  }>[${index + 1}] ${p.title}</option>`
                              )
                              .join("")
                          : '<option value="">Không có chức vụ</option>'
                      }
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="module-form-row">
                <div class="module-form-col">
                  <div class="module-form-group">
                    <label for="editSalary">Lương Cơ Bản</label>
                    <input type="number" id="editSalary" class="module-form-control" value="${
                      emp.salary || 0
                    }" required min="0">
                  </div>
                </div>
                
                <div class="module-form-col">
                  <div class="module-form-group">
                    <label for="editHireDate">Ngày Vào Làm</label>
                    <input type="date" id="editHireDate" class="module-form-control" value="${
                      emp.hire_date || ""
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
      editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const updated = {
          name: document.getElementById("editName").value,
          department_id: parseInt(
            document.getElementById("editDepartmentId").value
          ),
          position_id: parseInt(
            document.getElementById("editPositionId").value
          ),
          salary: parseFloat(document.getElementById("editSalary").value),
          hire_date: document.getElementById("editHireDate").value,
          bonus: emp.bonus || 0,
          deduction: emp.deduction || 0,
        };
        if (!validateEmployee(updated)) {
          showAlert("Thông tin không hợp lệ", "error");
          return;
        }
        if (confirm("Xác nhận cập nhật thông tin nhân viên?")) {
          try {
            await apiClient.updateEmployee(currentEditId, updated);
            showAlert("Cập nhật thành công", "success");
            editFormContainer.innerHTML = "";
            document.getElementById("searchForm").reset();

            // Refresh department and position data
            await Department.init();
            await Position.init();
          } catch (error) {
            showAlert("Cập nhật thất bại: " + error.message, "error");
          }
        }
      });

      const cancelBtn = editFormContainer.querySelector("#cancelEdit");
      cancelBtn.addEventListener("click", () => {
        editFormContainer.innerHTML = "";
        document.getElementById("searchForm").reset();
      });
    } catch (error) {
      showAlert("Lỗi khi tải thông tin nhân viên: " + error.message, "error");
    }
  });
}

function validateEmployee(emp) {
  return emp.name && emp.salary > 0 && emp.hire_date;
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
  if (firstCard && firstCard.parentNode) {
    firstCard.parentNode.insertBefore(alert, firstCard);
  } else {
    // Fallback if no card found
    const container = document.querySelector(".module-container");
    if (container) {
      container.appendChild(alert);
    }
  }

  // Add close event
  const closeBtn = alert.querySelector(".module-alert-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      alert.remove();
    });
  }

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}
