// PositionModule.js
const POSITIONS_KEY = "positions";

export function init() {
  if (!localStorage.getItem(POSITIONS_KEY)) {
    const defaults = [
      {
        id: 1,
        title: "Giám Đốc",
        description: "Quản lý toàn bộ hoạt động của công ty",
        salaryBase: 60000,
      },
      {
        id: 2,
        title: "Lập Trình Viên",
        description: "Phát triển và bảo trì phần mềm",
        salaryBase: 50000,
      },
      {
        id: 3,
        title: "Chuyên Viên Phân Tích",
        description: "Phân tích dữ liệu và đưa ra insights",
        salaryBase: 55000,
      },
    ];
    savePositions(defaults);
  }
}

export function getAllPositions() {
  return JSON.parse(localStorage.getItem(POSITIONS_KEY)) || [];
}

export async function addPosition(title, desc, salaryBase) {
  await simulateDelay();
  const positions = getAllPositions();
  const id = Math.max(...positions.map((p) => p.id), 0) + 1;
  positions.push({
    id,
    title,
    description: desc,
    salaryBase: parseFloat(salaryBase) || 0,
  });
  savePositions(positions);
}

export async function editPosition(id, updates) {
  await simulateDelay();
  let positions = getAllPositions();
  positions = positions.map((p) => (p.id === id ? { ...p, ...updates } : p));
  savePositions(positions);
}

export async function deletePosition(id) {
  await simulateDelay();
  let positions = getAllPositions();
  positions = positions.filter((p) => p.id !== id);
  savePositions(positions);
}

function savePositions(positions) {
  localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
}

export function render(container) {
  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-briefcase"></i> Quản Lý Chức Vụ</h1>
        <div class="module-header-actions">
          <button id="add-position-btn" class="btn btn-success">
            <i class="fas fa-plus"></i> Thêm Chức Vụ
          </button>
        </div>
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
                  <th>ID</th>
                  <th>Tên Chức Vụ</th>
                  <th>Mô Tả</th>
                  <th>Lương Cơ Bản</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                ${getAllPositions()
                  .map(
                    (p) => `
                    <tr>
                      <td>${p.id}</td>
                      <td>${p.title}</td>
                      <td>${p.description}</td>
                      <td>${formatCurrency(p.salaryBase)}</td>
                      <td class="module-table-actions">
                        <button data-id="${
                          p.id
                        }" class="btn btn-sm btn-warning edit-btn">
                          <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button data-id="${
                          p.id
                        }" class="btn btn-sm btn-danger delete-btn">
                          <i class="fas fa-trash"></i> Xóa
                        </button>
                      </td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Add/Edit Position Modal -->
      <div id="position-modal" class="modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modal-title">Thêm Chức Vụ</h3>
            <span class="close">&times;</span>
          </div>
          <div class="modal-body">
            <form id="position-form" class="module-form">
              <input type="hidden" id="position-id">
              <div class="module-form-group">
                <label for="position-title">Tên Chức Vụ</label>
                <input type="text" id="position-title" class="module-form-control" placeholder="Nhập tên chức vụ" required>
              </div>
              <div class="module-form-group">
                <label for="position-description">Mô Tả</label>
                <textarea id="position-description" class="module-form-control" rows="3" placeholder="Nhập mô tả chức vụ"></textarea>
              </div>
              <div class="module-form-group">
                <label for="position-salary">Lương Cơ Bản</label>
                <input type="number" id="position-salary" class="module-form-control" placeholder="Nhập lương cơ bản" min="0">
              </div>
              <div class="module-btn-group">
                <button type="submit" class="btn btn-success">
                  <i class="fas fa-save"></i> <span id="save-btn-text">Lưu</span>
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
  container.querySelector("#add-position-btn").addEventListener("click", () => {
    openModal("add");
  });

  container.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest(".edit-btn").dataset.id);
      const position = getAllPositions().find((p) => p.id === id);
      if (position) {
        openModal("edit", position);
      }
    });
  });

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest(".delete-btn").dataset.id);
      if (confirm("Bạn có chắc chắn muốn xóa chức vụ này?")) {
        deletePosition(id);
        render(container);
      }
    });
  });

  // Modal event listeners
  const modal = container.querySelector("#position-modal");
  const closeModal = () => {
    modal.style.display = "none";
  };

  container.querySelector(".close").addEventListener("click", closeModal);
  container.querySelector(".close-modal").addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  container
    .querySelector("#position-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("position-id").value;
      const title = document.getElementById("position-title").value;
      const description = document.getElementById("position-description").value;
      const salaryBase = document.getElementById("position-salary").value;

      if (id) {
        await editPosition(parseInt(id), {
          title,
          description,
          salaryBase: parseFloat(salaryBase) || 0,
        });
      } else {
        await addPosition(title, description, salaryBase);
      }

      closeModal();
      render(container);
    });
}

function openModal(mode, position = null) {
  const modal = document.getElementById("position-modal");
  const title = document.getElementById("modal-title");
  const saveBtnText = document.getElementById("save-btn-text");
  const idInput = document.getElementById("position-id");
  const titleInput = document.getElementById("position-title");
  const descriptionInput = document.getElementById("position-description");
  const salaryInput = document.getElementById("position-salary");

  if (mode === "add") {
    title.textContent = "Thêm Chức Vụ";
    saveBtnText.textContent = "Thêm";
    idInput.value = "";
    titleInput.value = "";
    descriptionInput.value = "";
    salaryInput.value = "";
  } else {
    title.textContent = "Sửa Chức Vụ";
    saveBtnText.textContent = "Lưu";
    idInput.value = position.id;
    titleInput.value = position.title;
    descriptionInput.value = position.description;
    salaryInput.value = position.salaryBase;
  }

  modal.style.display = "block";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function simulateDelay() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}
