// DepartmentModule.js
const DEPARTMENTS_KEY = "departments";

export function init() {
  if (!localStorage.getItem(DEPARTMENTS_KEY)) {
    const defaults = [
      { id: 1, name: "Nhân Sự", managerId: 1 },
      { id: 2, name: "Công Nghệ Thông Tin", managerId: 2 },
    ];
    saveDepartments(defaults);
  }
}

export function getAllDepartments() {
  return JSON.parse(localStorage.getItem(DEPARTMENTS_KEY)) || [];
}

export function addDepartment(name) {
  const depts = getAllDepartments();
  const id = Math.max(...depts.map((d) => d.id), 0) + 1;
  depts.push({ id, name, managerId: null });
  saveDepartments(depts);
}

export function editDepartment(id, newName) {
  let depts = getAllDepartments();
  depts = depts.map((d) => (d.id === id ? { ...d, name: newName } : d));
  saveDepartments(depts);
}

export function deleteDepartment(id) {
  let depts = getAllDepartments();
  depts = depts.filter((d) => d.id !== id);
  saveDepartments(depts);
}

function saveDepartments(depts) {
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(depts));
}

export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-sitemap"></i> Quản Lý Phòng Ban</h1>
      <div class="page-header-actions">
        <button id="add-department-btn" class="btn btn-success">
          <i class="fas fa-plus"></i> Thêm Phòng Ban
        </button>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-list"></i> Danh Sách Phòng Ban</h3>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Phòng Ban</th>
              <th>Số Nhân Viên</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            ${getAllDepartments()
              .map(
                (d) => `
                <tr>
                  <td>${d.id}</td>
                  <td>${d.name}</td>
                  <td>0</td>
                  <td class="table-actions">
                    <button data-id="${d.id}" class="btn btn-sm btn-warning edit-btn">
                      <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button data-id="${d.id}" class="btn btn-sm btn-danger delete-btn">
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
    
    <!-- Add/Edit Department Modal -->
    <div id="department-modal" class="modal" style="display: none;">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-title">Thêm Phòng Ban</h3>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="department-form">
            <input type="hidden" id="department-id">
            <div class="form-group">
              <label for="department-name">Tên Phòng Ban</label>
              <input type="text" id="department-name" class="form-control" placeholder="Nhập tên phòng ban" required>
            </div>
            <div class="btn-group">
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
  `;

  // Add event listeners
  container
    .querySelector("#add-department-btn")
    .addEventListener("click", () => {
      openModal("add");
    });

  container.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest(".edit-btn").dataset.id);
      const dept = getAllDepartments().find((d) => d.id === id);
      if (dept) {
        openModal("edit", dept);
      }
    });
  });

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest(".delete-btn").dataset.id);
      if (confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) {
        deleteDepartment(id);
        render(container);
      }
    });
  });

  // Modal event listeners
  const modal = container.querySelector("#department-modal");
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
    .querySelector("#department-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("department-id").value;
      const name = document.getElementById("department-name").value;

      if (id) {
        editDepartment(parseInt(id), name);
      } else {
        addDepartment(name);
      }

      closeModal();
      render(container);
    });
}

function openModal(mode, department = null) {
  const modal = document.getElementById("department-modal");
  const title = document.getElementById("modal-title");
  const saveBtnText = document.getElementById("save-btn-text");
  const idInput = document.getElementById("department-id");
  const nameInput = document.getElementById("department-name");

  if (mode === "add") {
    title.textContent = "Thêm Phòng Ban";
    saveBtnText.textContent = "Thêm";
    idInput.value = "";
    nameInput.value = "";
  } else {
    title.textContent = "Sửa Phòng Ban";
    saveBtnText.textContent = "Lưu";
    idInput.value = department.id;
    nameInput.value = department.name;
  }

  modal.style.display = "block";
}
