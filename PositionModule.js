// PositionModule.js
import apiClient from "./apiClient.js";

let positions = [];
let isLoaded = false;

export function init() {
  return loadPositions();
}

async function loadPositions() {
  try {
    console.log("Loading positions...");
    const data = await apiClient.getPositions();
    console.log("Positions data received:", data);
    // Đảm bảo luôn trả về mảng
    positions = Array.isArray(data) ? data : [];
    isLoaded = true;
    console.log("Positions loaded:", positions);
  } catch (error) {
    console.error("Failed to load positions:", error);
    // Cung cấp dữ liệu mặc định nếu không thể tải từ API
    positions = [
      {
        id: 1,
        title: "Manager",
        description: "Quản lý phòng ban",
        salary_base: 15000000,
      },
      {
        id: 2,
        title: "Senior Staff",
        description: "Nhân viên cấp cao",
        salary_base: 12000000,
      },
      { id: 3, title: "Staff", description: "Nhân viên", salary_base: 8000000 },
      {
        id: 4,
        title: "Intern",
        description: "Thực tập sinh",
        salary_base: 3000000,
      },
    ];
    isLoaded = true;
  }
}

export function getAllPositions() {
  console.log("Getting all positions:", positions);
  // Luôn trả về mảng hợp lệ
  return Array.isArray(positions) ? positions : [];
}

export function isPositionsLoaded() {
  return isLoaded;
}

export function getPositionById(id) {
  const poss = getAllPositions();
  return poss.find((pos) => pos.id === parseInt(id));
}

export async function addPosition(positionData) {
  try {
    console.log("Adding position with data:", positionData);
    const newPosition = await apiClient.createPosition(positionData);
    console.log("New position created:", newPosition);
    // Đảm bảo positions là mảng hợp lệ trước khi push
    if (!Array.isArray(positions)) {
      console.warn("Positions is not an array, initializing as empty array");
      positions = [];
    }
    positions.push(newPosition);
    console.log("Positions after push:", positions);
    return newPosition;
  } catch (error) {
    console.error("Failed to add position:", error);
    throw new Error("Failed to add position: " + error.message);
  }
}

export async function updatePosition(id, positionData) {
  try {
    console.log("Updating position:", id, positionData);
    const updatedPosition = await apiClient.updatePosition(id, positionData);
    console.log("Updated position:", updatedPosition);
    // Đảm bảo positions là mảng hợp lệ trước khi map
    if (!Array.isArray(positions)) {
      console.warn("Positions is not an array, initializing as empty array");
      positions = [];
    }
    positions = positions.map((pos) =>
      pos.id === parseInt(id) ? updatedPosition : pos
    );
    console.log("Positions after update:", positions);
    return updatedPosition;
  } catch (error) {
    console.error("Failed to update position:", error);
    throw new Error("Failed to update position: " + error.message);
  }
}

export async function deletePosition(id) {
  // Validate ID first
  if (!id || isNaN(id)) {
    throw new Error("Invalid position ID");
  }

  // Check if position exists in local array before attempting to delete
  const positionExists =
    Array.isArray(positions) &&
    positions.some((pos) => pos.id === parseInt(id));
  if (!positionExists) {
    console.warn(
      "Position not found in local array, may have been already deleted:",
      id
    );
    // Remove from local array if exists (defensive programming)
    if (Array.isArray(positions)) {
      positions = positions.filter((pos) => pos.id !== parseInt(id));
    }
    return true; // Consider as success since it's already deleted
  }

  try {
    console.log("Deleting position:", id);

    await apiClient.deletePosition(id);

    // Đảm bảo positions là mảng hợp lệ trước khi filter
    if (!Array.isArray(positions)) {
      console.warn("Positions is not an array, initializing as empty array");
      positions = [];
    }
    positions = positions.filter((pos) => pos.id !== parseInt(id));
    console.log("Positions after delete:", positions);
    return true;
  } catch (error) {
    console.error("Failed to delete position:", error);

    // If it's a 404 error, the position might have been already deleted
    if (error.message && error.message.includes("not found")) {
      // Remove from local array anyway
      if (Array.isArray(positions)) {
        positions = positions.filter((pos) => pos.id !== parseInt(id));
      }
      console.log(
        "Position was already deleted, removed from local array:",
        id
      );
      return true; // Consider as success
    }

    throw new Error("Failed to delete position: " + error.message);
  }
}

export async function render(container) {
  // Wait for positions to be loaded if they're not already
  if (!isLoaded) {
    // Show loading state while data is being fetched
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-briefcase"></i> Quản Lý Chức Vụ</h1>
        </div>
        <div class="module-card">
          <div class="module-card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu chức vụ...</p>
          </div>
        </div>
      </div>
    `;

    // Wait for data to load
    await loadPositions();
  }

  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-briefcase"></i> Quản Lý Chức Vụ</h1>
        <div class="module-header-actions">
          <button id="addPositionBtn" class="btn btn-primary">
            <i class="fas fa-plus"></i> Thêm Chức Vụ
          </button>
        </div>
      </div>
      
      <div class="module-subheader">
        <p>Quản lý các chức vụ trong công ty</p>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-list"></i> Danh Sách Chức Vụ</h2>
        </div>
        <div class="module-card-body">
          <div class="module-table-container">
            <table class="module-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Chức Vụ</th>
                  <th>Mô Tả</th>
                  <th>Lương Cơ Bản</th>
                  <th>Ngày Tạo</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody id="positionTableBody">
                ${
                  positions && positions.length > 0
                    ? positions
                        .map(
                          (pos, index) => `
                  <tr data-id="${pos.id}">
                    <td>${index + 1}</td>
                    <td>${pos.title}</td>
                    <td>${pos.description || ""}</td>
                    <td>${formatCurrency(pos.salary_base || 0)}</td>
                    <td>${formatDate(pos.created_at)}</td>
                    <td class="module-table-actions">
                      <button class="btn btn-sm btn-warning edit-btn" data-id="${
                        pos.id
                      }">
                        <i class="fas fa-edit"></i> Sửa
                      </button>
                      <button class="btn btn-sm btn-danger delete-btn" data-id="${
                        pos.id
                      }">
                        <i class="fas fa-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : "<tr><td colspan='6' class='text-center'>Không có dữ liệu</td></tr>"
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Position Modal -->
      <div id="positionModal" class="modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modalTitle">Thêm Chức Vụ</h3>
            <span class="close">&times;</span>
          </div>
          <div class="modal-body">
            <form id="positionForm" class="module-form">
              <input type="hidden" id="positionId">
              <div class="module-form-group">
                <label for="positionTitle">Tên Chức Vụ</label>
                <input type="text" id="positionTitle" class="module-form-control" placeholder="Nhập tên chức vụ" required>
              </div>
              <div class="module-form-group">
                <label for="positionDescription">Mô Tả</label>
                <textarea id="positionDescription" class="module-form-control" rows="3" placeholder="Nhập mô tả"></textarea>
              </div>
              <div class="module-form-group">
                <label for="positionSalaryBase">Lương Cơ Bản</label>
                <input type="number" id="positionSalaryBase" class="module-form-control" placeholder="Nhập lương cơ bản" min="0">
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
  document.getElementById("addPositionBtn").addEventListener("click", () => {
    openPositionModal();
  });

  container.addEventListener("click", async (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.dataset.id;
      console.log("Edit button clicked, position ID:", id);

      // Validate ID
      if (!id || isNaN(id)) {
        showAlert("ID chức vụ không hợp lệ", "danger");
        return;
      }

      try {
        const pos = await apiClient.getPosition(id);
        openPositionModal(pos);
      } catch (error) {
        // Handle 404 error specifically
        if (
          error.message &&
          (error.message.includes("not found") || error.message.includes("404"))
        ) {
          showAlert("Chức vụ không tồn tại hoặc đã bị xóa", "warning");
          // Refresh the module to sync with server
          await render(container);
        } else {
          showAlert(
            "Không thể tải thông tin chức vụ: " + error.message,
            "danger"
          );
        }
      }
    } else if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      console.log("Delete button clicked, position ID:", id);

      // Validate ID
      if (!id || isNaN(id)) {
        showAlert("ID chức vụ không hợp lệ", "danger");
        return;
      }

      // Check if position exists in local array
      const positionExists =
        Array.isArray(positions) &&
        positions.some((pos) => pos.id === parseInt(id));
      if (!positionExists) {
        showAlert("Chức vụ không tồn tại hoặc đã bị xóa", "warning");
        // Refresh the module to sync with server
        await render(container);
        return;
      }

      if (confirm("Bạn có chắc chắn muốn xóa chức vụ này?")) {
        try {
          await deletePosition(id);
          showAlert("Xóa chức vụ thành công!", "success");
          await render(container);
        } catch (error) {
          console.error("Delete position error:", error);
          showAlert("Xóa chức vụ thất bại: " + error.message, "danger");

          // Re-render to refresh the view
          await render(container);
        }
      }
    }
  });

  // Modal event listeners
  const modal = document.getElementById("positionModal");
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
      .querySelector("#positionForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("positionId").value;
        const positionData = {
          title: document.getElementById("positionTitle").value,
          description: document.getElementById("positionDescription").value,
          salary_base: document.getElementById("positionSalaryBase").value || 0,
        };

        try {
          if (id) {
            await updatePosition(id, positionData);
            showAlert("Cập nhật chức vụ thành công!", "success");
          } else {
            await addPosition(positionData);
            showAlert("Thêm chức vụ thành công!", "success");
          }
          closeModal();
          await render(container);
        } catch (error) {
          showAlert("Lưu chức vụ thất bại: " + error.message, "danger");
        }
      });
  }
}

function openPositionModal(position = null) {
  const modal = document.getElementById("positionModal");
  const form = document.getElementById("positionForm");
  const title = document.getElementById("modalTitle");

  if (position) {
    // Edit mode
    title.textContent = "Sửa Chức Vụ";
    document.getElementById("positionId").value = position.id;
    document.getElementById("positionTitle").value = position.title;
    document.getElementById("positionDescription").value =
      position.description || "";
    document.getElementById("positionSalaryBase").value =
      position.salary_base || 0;
  } else {
    // Add mode
    title.textContent = "Thêm Chức Vụ";
    form.reset();
    document.getElementById("positionId").value = "";
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}
