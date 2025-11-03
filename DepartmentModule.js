// DepartmentModule.js
import apiClient from "./apiClient.js";

let departments = [];
let isLoaded = false;

export function init() {
  return loadDepartments();
}

async function loadDepartments() {
  try {
    console.log("Loading departments...");
    const data = await apiClient.getDepartments();
    console.log("Departments data received:", data);
    // Đảm bảo luôn trả về mảng
    departments = Array.isArray(data) ? data : [];
    isLoaded = true;
    console.log("Departments loaded:", departments);
  } catch (error) {
    console.error("Failed to load departments:", error);
    // Cung cấp dữ liệu mặc định nếu không thể tải từ API
    departments = [
      {
        id: 1,
        name: "Human Resources",
        description: "Quản lý nhân sự và các vấn đề liên quan đến nhân viên",
      },
      {
        id: 2,
        name: "Information Technology",
        description: "Phát triển và bảo trì hệ thống công nghệ thông tin",
      },
      { id: 3, name: "Finance", description: "Quản lý tài chính và kế toán" },
      {
        id: 4,
        name: "Marketing",
        description: "Phát triển thương hiệu và chiến lược marketing",
      },
      {
        id: 5,
        name: "Operations",
        description: "Quản lý hoạt động hàng ngày của công ty",
      },
    ];
    isLoaded = true;
  }
}

export function getAllDepartments() {
  console.log("Getting all departments:", departments);
  // Luôn trả về mảng hợp lệ
  return Array.isArray(departments) ? departments : [];
}

export function isDepartmentsLoaded() {
  return isLoaded;
}

export function getDepartmentById(id) {
  const depts = getAllDepartments();
  // Handle case where id might be a string
  const departmentId = typeof id === "string" ? parseInt(id) : id;
  return depts.find((dept) => dept.id === departmentId);
}

export async function addDepartment(departmentData) {
  try {
    console.log("Adding department with data:", departmentData);
    const newDepartment = await apiClient.createDepartment(departmentData);
    console.log("New department created:", newDepartment);
    // Đảm bảo departments là mảng hợp lệ trước khi push
    if (!Array.isArray(departments)) {
      console.warn("Departments is not an array, initializing as empty array");
      departments = [];
    }
    departments.push(newDepartment);
    console.log("Departments after push:", departments);
    return newDepartment;
  } catch (error) {
    console.error("Failed to add department:", error);
    throw new Error("Failed to add department: " + error.message);
  }
}

export async function updateDepartment(id, departmentData) {
  try {
    console.log("Updating department:", id, departmentData);
    const updatedDepartment = await apiClient.updateDepartment(
      id,
      departmentData
    );
    console.log("Updated department:", updatedDepartment);
    // Đảm bảo departments là mảng hợp lệ trước khi map
    if (!Array.isArray(departments)) {
      console.warn("Departments is not an array, initializing as empty array");
      departments = [];
    }
    departments = departments.map((dept) =>
      dept.id === parseInt(id) ? updatedDepartment : dept
    );
    console.log("Departments after update:", departments);
    return updatedDepartment;
  } catch (error) {
    console.error("Failed to update department:", error);
    throw new Error("Failed to update department: " + error.message);
  }
}

export async function deleteDepartment(id) {
  // Validate ID first
  if (!id || isNaN(id)) {
    throw new Error("Invalid department ID");
  }

  try {
    console.log("Deleting department:", id);

    await apiClient.deleteDepartment(id);

    // Đảm bảo departments là mảng hợp lệ trước khi filter
    if (!Array.isArray(departments)) {
      console.warn("Departments is not an array, initializing as empty array");
      departments = [];
    }
    departments = departments.filter((dept) => dept.id !== parseInt(id));
    console.log("Departments after delete:", departments);
    return true;
  } catch (error) {
    console.error("Failed to delete department:", error);

    // If it's a 404 error, the department might have been already deleted
    if (
      error.message &&
      (error.message.includes("not found") || error.message.includes("404"))
    ) {
      // Remove from local array anyway
      if (Array.isArray(departments)) {
        departments = departments.filter((dept) => dept.id !== parseInt(id));
      }
      console.log(
        "Department was already deleted, removed from local array:",
        id
      );
      showAlert("Phòng ban đã được xóa trước đó hoặc không tồn tại", "warning");
      return true; // Consider as success
    }

    throw new Error("Failed to delete department: " + error.message);
  }
}

export async function render(container) {
  // Wait for departments to be loaded if they're not already
  if (!isLoaded) {
    // Show loading state while data is being fetched
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-sitemap"></i> Quản Lý Phòng Ban</h1>
        </div>
        <div class="module-card">
          <div class="module-card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu phòng ban...</p>
          </div>
        </div>
      </div>
    `;

    // Wait for data to load
    await loadDepartments();
  }

  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-sitemap"></i> Quản Lý Phòng Ban</h1>
        <div class="module-header-actions">
          <button id="addDepartmentBtn" class="btn btn-primary">
            <i class="fas fa-plus"></i> Thêm Phòng Ban
          </button>
        </div>
      </div>
      
      <div class="module-subheader">
        <p>Quản lý các phòng ban trong công ty</p>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-list"></i> Danh Sách Phòng Ban</h2>
        </div>
        <div class="module-card-body">
          <div class="module-table-container">
            <table class="module-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Phòng Ban</th>
                  <th>Mô Tả</th>
                  <th>Ngày Tạo</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody id="departmentTableBody">
                ${
                  departments && departments.length > 0
                    ? departments
                        .map(
                          (dept, index) => `
                  <tr data-id="${dept.id}">
                    <td>${index + 1}</td>
                    <td>${dept.name}</td>
                    <td>${dept.description || ""}</td>
                    <td>${formatDate(dept.created_at)}</td>
                    <td class="module-table-actions">
                      <button class="btn btn-sm btn-warning edit-btn" data-id="${
                        dept.id
                      }">
                        <i class="fas fa-edit"></i> Sửa
                      </button>
                      <button class="btn btn-sm btn-danger delete-btn" data-id="${
                        dept.id
                      }">
                        <i class="fas fa-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : "<tr><td colspan='5' class='text-center'>Không có dữ liệu</td></tr>"
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Department Modal -->
      <div id="departmentModal" class="modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modalTitle">Thêm Phòng Ban</h3>
            <span class="close">&times;</span>
          </div>
          <div class="modal-body">
            <form id="departmentForm" class="module-form">
              <input type="hidden" id="departmentId">
              <div class="module-form-group">
                <label for="departmentName">Tên Phòng Ban</label>
                <input type="text" id="departmentName" class="module-form-control" placeholder="Nhập tên phòng ban" required>
              </div>
              <div class="module-form-group">
                <label for="departmentDescription">Mô Tả</label>
                <textarea id="departmentDescription" class="module-form-control" rows="3" placeholder="Nhập mô tả"></textarea>
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
  document.getElementById("addDepartmentBtn").addEventListener("click", () => {
    openDepartmentModal();
  });

  container.addEventListener("click", async (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.dataset.id;
      console.log("Edit button clicked, department ID:", id);

      // Validate ID
      if (!id || isNaN(id)) {
        showAlert("ID phòng ban không hợp lệ", "danger");
        return;
      }

      try {
        const dept = await apiClient.getDepartment(id);
        openDepartmentModal(dept);
      } catch (error) {
        // Handle 404 error specifically
        if (
          error.message &&
          (error.message.includes("not found") || error.message.includes("404"))
        ) {
          showAlert("Phòng ban không tồn tại hoặc đã bị xóa", "warning");
          // Refresh the module to sync with server
          await render(container);
        } else {
          showAlert(
            "Không thể tải thông tin phòng ban: " + error.message,
            "danger"
          );
        }
      }
    } else if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      console.log("Delete button clicked, department ID:", id);

      // Validate ID
      if (!id || isNaN(id)) {
        showAlert("ID phòng ban không hợp lệ", "danger");
        return;
      }

      if (confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) {
        try {
          await deleteDepartment(id);
          showAlert("Xóa phòng ban thành công!", "success");
          await render(container);
        } catch (error) {
          console.error("Delete department error:", error);
          showAlert("Xóa phòng ban thất bại: " + error.message, "danger");

          // Re-render to refresh the view
          await render(container);
        }
      }
    }
  });

  // Modal event listeners
  const modal = document.getElementById("departmentModal");
  const closeModal = () => {
    modal.style.display = "none";
  };

  if (modal) {
    modal.querySelector(".close").addEventListener("click", closeModal);
    modal.querySelector(".close-modal").addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    modal
      .querySelector("#departmentForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("departmentId").value;
        const departmentData = {
          name: document.getElementById("departmentName").value,
          description: document.getElementById("departmentDescription").value,
        };

        try {
          if (id) {
            await updateDepartment(id, departmentData);
            showAlert("Cập nhật phòng ban thành công!", "success");
          } else {
            await addDepartment(departmentData);
            showAlert("Thêm phòng ban thành công!", "success");
          }
          closeModal();
          await render(container);
        } catch (error) {
          showAlert("Lưu phòng ban thất bại: " + error.message, "danger");
        }
      });
  }
}

function openDepartmentModal(department = null) {
  const modal = document.getElementById("departmentModal");
  const form = document.getElementById("departmentForm");
  const title = document.getElementById("modalTitle");

  if (department) {
    // Edit mode
    title.textContent = "Sửa Phòng Ban";
    document.getElementById("departmentId").value = department.id;
    document.getElementById("departmentName").value = department.name;
    document.getElementById("departmentDescription").value =
      department.description || "";
  } else {
    // Add mode
    title.textContent = "Thêm Phòng Ban";
    form.reset();
    document.getElementById("departmentId").value = "";
  }

  modal.style.display = "block";
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

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}
