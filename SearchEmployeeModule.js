// SearchEmployeeModule.js
import apiClient from "./apiClient.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

export async function render(container) {
  console.log("Rendering SearchEmployeeModule");

  // Always try to load fresh data
  try {
    // Show loading state while data is being fetched
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-search"></i> Tìm Kiếm Nhân Viên</h1>
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
  console.log("Search - Departments data:", departments);
  console.log("Search - Positions data:", positions);
  console.log("Search - Is departments array:", Array.isArray(departments));
  console.log("Search - Is positions array:", Array.isArray(positions));
  console.log(
    "Search - Departments length:",
    departments ? departments.length : "null"
  );
  console.log(
    "Search - Positions length:",
    positions ? positions.length : "null"
  );

  // Kiểm tra kỹ hơn dữ liệu
  if (!Array.isArray(departments)) {
    console.error("Departments is not an array:", departments);
    container.innerHTML = `
      <div class="module-container">
        <div class="module-alert module-alert-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <div class="module-alert-content">
            <h4>Dữ Liệu Không Hợp Lệ</h4>
            <p>Dữ liệu phòng ban không hợp lệ. Vui lòng thử lại.</p>
            <p>Departments type: ${typeof departments}</p>
            <p>Departments value: ${JSON.stringify(departments)}</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (!Array.isArray(positions)) {
    console.error("Positions is not an array:", positions);
    container.innerHTML = `
      <div class="module-container">
        <div class="module-alert module-alert-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <div class="module-alert-content">
            <h4>Dữ Liệu Không Hợp Lệ</h4>
            <p>Dữ liệu chức vụ không hợp lệ. Vui lòng thử lại.</p>
            <p>Positions type: ${typeof positions}</p>
            <p>Positions value: ${JSON.stringify(positions)}</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-search"></i> Tìm Kiếm Nhân Viên</h1>
      </div>
      
      <div class="module-subheader">
        <p>Tìm kiếm và lọc nhân viên theo các tiêu chí khác nhau</p>
      </div>
      
      <div class="module-card">
        <div class="module-card-header">
          <h2><i class="fas fa-filter"></i> Bộ Lọc Tìm Kiếm</h2>
        </div>
        <div class="module-card-body">
          <form id="searchForm" class="module-form">
            <div class="module-form-row">
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="searchName">Tên Nhân Viên</label>
                  <input type="text" id="searchName" class="module-form-control" placeholder="Nhập tên hoặc từ khóa">
                </div>
              </div>
              
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="searchDepartment">Phòng Ban</label>
                  <select id="searchDepartment" class="module-form-control">
                    <option value="">Tất Cả Phòng Ban</option>
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
                  <label for="minSalary">Lương Tối Thiểu</label>
                  <input type="number" id="minSalary" class="module-form-control" placeholder="Nhập mức lương tối thiểu">
                </div>
              </div>
              
              <div class="module-form-col">
                <div class="module-form-group">
                  <label for="maxSalary">Lương Tối Đa</label>
                  <input type="number" id="maxSalary" class="module-form-control" placeholder="Nhập mức lương tối đa">
                </div>
              </div>
            </div>
            
            <div class="module-btn-group">
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-search"></i> Tìm Kiếm
              </button>
              <button type="button" id="clearSearch" class="btn btn-secondary">
                <i class="fas fa-times"></i> Xóa Bộ Lọc
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div id="searchResults" class="mt-4"></div>
    </div>
  `;

  const form = container.querySelector("#searchForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await performSearch(container);
  });

  // Clear search button
  container.querySelector("#clearSearch").addEventListener("click", () => {
    form.reset();
    document.getElementById("searchResults").innerHTML = "";
  });
}

async function performSearch(container) {
  const filters = {};

  const name = document.getElementById("searchName").value;
  const deptId = document.getElementById("searchDepartment").value;
  const minSal = document.getElementById("minSalary").value;
  const maxSal = document.getElementById("maxSalary").value;

  if (name) filters.name = name;
  if (deptId) filters.department_id = deptId;
  if (minSal) filters.min_salary = minSal;
  if (maxSal) filters.max_salary = maxSal;

  try {
    console.log("Performing search with filters:", filters);
    let results = await apiClient.searchEmployees(filters);
    console.log("Search results received:", results);
    console.log("Is results array:", Array.isArray(results));
    console.log("Results type:", typeof results);

    // Kiểm tra kỹ hơn kết quả
    if (results === undefined) {
      throw new Error("Dữ liệu trả về không hợp lệ: Kết quả là undefined");
    }

    if (results === null) {
      throw new Error("Dữ liệu trả về không hợp lệ: Kết quả là null");
    }

    // Đảm bảo results là mảng trước khi gọi sortBySalary
    if (Array.isArray(results)) {
      console.log("Sorting results by salary...");
      results = sortBySalary(results);
      console.log("Displaying results:", results);
      displayResults(results, container);
    } else {
      console.error("Invalid search results format:", results);
      console.error("Results constructor:", results.constructor.name);
      throw new Error(
        "Dữ liệu trả về không hợp lệ: Không phải là mảng. Kiểu dữ liệu: " +
          typeof results
      );
    }
  } catch (error) {
    console.error("Search error:", error);
    console.error("Search error stack:", error.stack);
    document.getElementById("searchResults").innerHTML = `
      <div class="module-alert module-alert-danger">
        <i class="fas fa-exclamation-circle"></i>
        <div class="module-alert-content">
          <h4>Lỗi Tìm Kiếm</h4>
          <p>${error.message}</p>
          <p>Chi tiết: ${error.stack || "No stack trace"}</p>
        </div>
      </div>
    `;
  }
}

function displayResults(employees, container) {
  const resultsContainer = document.getElementById("searchResults");

  // Kiểm tra employees có phải là mảng hợp lệ không
  if (!Array.isArray(employees)) {
    resultsContainer.innerHTML = `
      <div class="module-alert module-alert-danger">
        <i class="fas fa-exclamation-circle"></i>
        <div class="module-alert-content">
          <h4>Lỗi Hiển Thị</h4>
          <p>Dữ liệu nhân viên không hợp lệ.</p>
        </div>
      </div>
    `;
    return;
  }

  if (employees.length === 0) {
    resultsContainer.innerHTML = `
      <div class="module-alert module-alert-info">
        <i class="fas fa-info-circle"></i>
        <div class="module-alert-content">
          <h4>Không Tìm Thấy</h4>
          <p>Không tìm thấy nhân viên nào phù hợp với tiêu chí tìm kiếm.</p>
        </div>
      </div>
    `;
    return;
  }

  // Function to get department name
  function getDepartmentName(deptId) {
    // Handle case where deptId might be a string
    const departmentId = typeof deptId === "string" ? parseInt(deptId) : deptId;
    const departments = Department.getAllDepartments();
    // Kiểm tra departments có tồn tại và là mảng trước khi gọi find
    if (Array.isArray(departments) && departments.length > 0) {
      const dept = departments.find((d) => d.id === departmentId);
      return dept ? dept.name : "Không xác định";
    }
    return "Không xác định";
  }

  // Function to get position name
  function getPositionName(posId) {
    // Handle case where posId might be a string
    const positionId = typeof posId === "string" ? parseInt(posId) : posId;
    const positions = Position.getAllPositions();
    // Kiểm tra positions có tồn tại và là mảng trước khi gọi find
    if (Array.isArray(positions) && positions.length > 0) {
      const pos = positions.find((p) => p.id === positionId);
      return pos ? pos.title : "Không xác định";
    }
    return "Không xác định";
  }

  // Function to get department STT
  function getDepartmentSTT(deptId) {
    // Handle case where deptId might be a string
    const departmentId = typeof deptId === "string" ? parseInt(deptId) : deptId;
    const departments = Department.getAllDepartments();
    // Kiểm tra departments có tồn tại và là mảng trước khi gọi find
    if (Array.isArray(departments) && departments.length > 0) {
      const index = departments.findIndex((d) => d.id === departmentId);
      return index >= 0 ? index + 1 : "Không xác định";
    }
    return "Không xác định";
  }

  // Function to get position STT
  function getPositionSTT(posId) {
    // Handle case where posId might be a string
    const positionId = typeof posId === "string" ? parseInt(posId) : posId;
    const positions = Position.getAllPositions();
    // Kiểm tra positions có tồn tại và là mảng trước khi gọi find
    if (Array.isArray(positions) && positions.length > 0) {
      const index = positions.findIndex((p) => p.id === positionId);
      return index >= 0 ? index + 1 : "Không xác định";
    }
    return "Không xác định";
  }

  const tableHtml = `
    <div class="module-card">
      <div class="module-card-header">
        <h2><i class="fas fa-list"></i> Kết Quả Tìm Kiếm</h2>
        <div class="module-card-header-actions">
          <span class="module-badge module-badge-info">${
            employees.length
          } nhân viên</span>
        </div>
      </div>
      <div class="module-card-body">
        <div class="module-table-container">
          <table class="module-table">
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Họ Tên</th>
                <th>Phòng Ban</th>
                <th>Chức Vụ</th>
                <th>Lương</th>
                <th>Ngày Bắt Đầu</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              ${employees
                .map(
                  (emp) => `
                <tr>
                  <td>${emp.id}</td>
                  <td>${emp.name}</td>
                  <td>[${getDepartmentSTT(
                    emp.department_id
                  )}] ${getDepartmentName(emp.department_id)}</td>
                  <td>[${getPositionSTT(emp.position_id)}] ${getPositionName(
                    emp.position_id
                  )}</td>
                  <td>${formatCurrency(emp.salary)}</td>
                  <td>${formatDate(emp.hire_date)}</td>
                  <td class="module-table-actions">
                    <button class="btn btn-sm btn-info view-btn" data-id="${
                      emp.id
                    }">
                      <i class="fas fa-eye"></i> Xem
                    </button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  resultsContainer.innerHTML = tableHtml;

  // Add event listeners for view buttons
  resultsContainer.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      // In a real app, you would show employee details here
      alert(`Xem chi tiết nhân viên ID: ${id}`);
    });
  });
}

// Utility functions
function sortBySalary(employees) {
  return employees.sort((a, b) => b.salary - a.salary);
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
