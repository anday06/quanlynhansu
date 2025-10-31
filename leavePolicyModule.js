// leavePolicyModule.js
import apiClient from "./apiClient.js";

export async function render(container) {
  try {
    // Show loading state
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-file-contract"></i> Chính Sách Nghỉ Phép</h1>
        </div>
        <div class="module-card">
          <div class="module-card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu chính sách nghỉ phép...</p>
          </div>
        </div>
      </div>
    `;

    // Fetch policies from API
    const policiesResponse = await apiClient.request("/leave-policies");
    const policies = policiesResponse.data || [];

    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-file-contract"></i> Chính Sách Nghỉ Phép</h1>
          <div class="module-header-actions">
            <button id="add-policy-btn" class="btn btn-success">
              <i class="fas fa-plus"></i> Thêm Chính Sách
            </button>
          </div>
        </div>
        
        <div class="module-card">
          <div class="module-card-header">
            <h2><i class="fas fa-list"></i> Danh Sách Chính Sách</h2>
          </div>
          <div class="module-card-body">
            <div class="module-table-container">
              <table class="module-table">
                <thead>
                  <tr>
                    <th>Loại</th>
                    <th>Tên</th>
                    <th>Số Ngày Tối Đa</th>
                    <th>Chuyển Tiếp</th>
                    <th>Cần Phê Duyệt</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  ${policies
                    .map(
                      (policy) =>
                        `<tr data-id="${policy.id}">
                          <td>${policy.type}</td>
                          <td>${policy.name}</td>
                          <td>${policy.max_days}</td>
                          <td>
                            <span class="module-badge ${
                              policy.carry_over
                                ? "module-badge-success"
                                : "module-badge-danger"
                            }">
                              ${policy.carry_over ? "Có" : "Không"}
                            </span>
                          </td>
                          <td>
                            <span class="module-badge ${
                              policy.requires_approval
                                ? "module-badge-success"
                                : "module-badge-danger"
                            }">
                              ${policy.requires_approval ? "Có" : "Không"}
                            </span>
                          </td>
                          <td class="module-table-actions">
                            <button class="btn btn-sm btn-warning edit-btn">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-btn">
                              <i class="fas fa-trash"></i>
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
        
        <!-- Add/Edit Policy Modal -->
        <div id="policy-modal" class="modal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h3 id="modal-title">Thêm Chính Sách Nghỉ Phép</h3>
              <span class="close">&times;</span>
            </div>
            <div class="modal-body">
              <form id="policy-form" class="module-form">
                <input type="hidden" id="policy-id">
                <div class="module-form-group">
                  <label for="policy-type">Loại Chính Sách</label>
                  <input type="text" id="policy-type" class="module-form-control" placeholder="Ví dụ: annual, sick" required>
                </div>
                <div class="module-form-group">
                  <label for="policy-name">Tên Chính Sách</label>
                  <input type="text" id="policy-name" class="module-form-control" placeholder="Tên hiển thị" required>
                </div>
                <div class="module-form-group">
                  <label for="policy-description">Mô Tả</label>
                  <textarea id="policy-description" class="module-form-control" rows="3" placeholder="Mô tả chính sách"></textarea>
                </div>
                <div class="module-form-row">
                  <div class="module-form-col">
                    <div class="module-form-group">
                      <label for="policy-max-days">Số Ngày Tối Đa</label>
                      <input type="number" id="policy-max-days" class="module-form-control" placeholder="Số ngày" min="0" required>
                    </div>
                  </div>
                </div>
                <div class="module-form-row">
                  <div class="module-form-col">
                    <div class="module-form-group">
                      <label>
                        <input type="checkbox" id="policy-carry-over" class="module-form-checkbox">
                        Cho phép chuyển tiếp ngày nghỉ sang năm sau
                      </label>
                    </div>
                  </div>
                  <div class="module-form-col">
                    <div class="module-form-group">
                      <label>
                        <input type="checkbox" id="policy-requires-approval" class="module-form-checkbox" checked>
                        Cần phê duyệt
                      </label>
                    </div>
                  </div>
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
    container.querySelector("#add-policy-btn").addEventListener("click", () => {
      openPolicyModal();
    });

    container.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        const id = parseInt(row.dataset.id);
        const policy = policies.find((p) => p.id === id);
        if (policy) {
          openPolicyModal(policy);
        }
      });
    });

    container.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", handleDelete);
    });

    // Modal event listeners
    const modal = container.querySelector("#policy-modal");
    const closeModal = () => {
      modal.style.display = "none";
    };

    container.querySelector(".close").addEventListener("click", closeModal);
    container
      .querySelector(".close-modal")
      .addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    container
      .querySelector("#policy-form")
      .addEventListener("submit", handleFormSubmit);
  } catch (error) {
    container.innerHTML = `
      <div class="module-container">
        <div class="module-alert module-alert-danger">
          <i class="fas fa-exclamation-circle"></i>
          <div class="module-alert-content">
            <h4>Lỗi Tải Dữ Liệu</h4>
            <p>Không thể tải dữ liệu chính sách nghỉ phép: ${error.message}</p>
          </div>
        </div>
      </div>
    `;
  }
}

function openPolicyModal(policy = null) {
  const modal = document.getElementById("policy-modal");
  const title = document.getElementById("modal-title");
  const form = document.getElementById("policy-form");

  if (policy) {
    // Edit mode
    title.textContent = "Sửa Chính Sách Nghỉ Phép";
    document.getElementById("policy-id").value = policy.id;
    document.getElementById("policy-type").value = policy.type;
    document.getElementById("policy-name").value = policy.name;
    document.getElementById("policy-description").value =
      policy.description || "";
    document.getElementById("policy-max-days").value = policy.max_days;
    document.getElementById("policy-carry-over").checked =
      policy.carry_over === 1;
    document.getElementById("policy-requires-approval").checked =
      policy.requires_approval === 1;
  } else {
    // Add mode
    title.textContent = "Thêm Chính Sách Nghỉ Phép";
    form.reset();
    document.getElementById("policy-id").value = "";
    document.getElementById("policy-requires-approval").checked = true;
  }

  modal.style.display = "block";
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const id = document.getElementById("policy-id").value;
  const type = document.getElementById("policy-type").value;
  const name = document.getElementById("policy-name").value;
  const description = document.getElementById("policy-description").value;
  const maxDays = parseInt(document.getElementById("policy-max-days").value);
  const carryOver = document.getElementById("policy-carry-over").checked
    ? 1
    : 0;
  const requiresApproval = document.getElementById("policy-requires-approval")
    .checked
    ? 1
    : 0;

  if (!type || !name || isNaN(maxDays) || maxDays < 0) {
    showAlert("Vui lòng điền đầy đủ thông tin!", "danger");
    return;
  }

  try {
    const policyData = {
      type,
      name,
      description,
      max_days: maxDays,
      carry_over: carryOver,
      requires_approval: requiresApproval,
    };

    if (id) {
      // Update existing policy
      await apiClient.request(`/leave-policies/${id}`, {
        method: "PUT",
        body: JSON.stringify(policyData),
      });
      showAlert("Cập nhật chính sách thành công!", "success");
    } else {
      // Create new policy
      await apiClient.request("/leave-policies", {
        method: "POST",
        body: JSON.stringify(policyData),
      });
      showAlert("Thêm chính sách thành công!", "success");
    }

    // Close modal and refresh
    document.querySelector("#policy-modal").style.display = "none";

    // Re-render the module to update the table
    const container = form.closest(".module-container").parentElement;
    setTimeout(() => {
      render(container);
    }, 1000);
  } catch (error) {
    showAlert("Lưu chính sách thất bại: " + error.message, "danger");
  }
}

function handleDelete(e) {
  if (confirm("Bạn có chắc chắn muốn xóa chính sách này?")) {
    const row = e.target.closest("tr");
    const id = parseInt(row.dataset.id);

    // Delete policy via API
    apiClient
      .request(`/leave-policies/${id}`, {
        method: "DELETE",
      })
      .then(() => {
        showAlert("Chính sách đã được xóa thành công!", "success");

        // Re-render the module to update the table
        const container = row.closest(".module-container").parentElement;
        setTimeout(() => {
          render(container);
        }, 1000);
      })
      .catch((error) => {
        showAlert("Xóa chính sách thất bại: " + error.message, "danger");
      });
  }
}

function showAlert(message, type) {
  // Create alert element
  const alert = document.createElement("div");
  alert.className = `module-alert module-alert-${type}`;
  alert.innerHTML = `
    <i class="fas fa-${
      type === "success"
        ? "check-circle"
        : type === "info"
        ? "info-circle"
        : "exclamation-circle"
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
