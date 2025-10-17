// SearchEmployeeModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

export function render(container) {
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
                    ${Department.getAllDepartments()
                      .map((d) => `<option value="${d.id}">${d.name}</option>`)
                      .join("")}
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
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    performSearch(container);
  });

  // Clear search button
  container.querySelector("#clearSearch").addEventListener("click", () => {
    form.reset();
    document.getElementById("searchResults").innerHTML = "";
  });
}

function performSearch(container) {
  const nameRegex = new RegExp(
    document.getElementById("searchName").value || ".*",
    "i"
  );
  const deptId =
    parseInt(document.getElementById("searchDepartment").value) || null;
  const minSal = parseFloat(document.getElementById("minSalary").value) || 0;
  const maxSal =
    parseFloat(document.getElementById("maxSalary").value) || Infinity;

  const filterFn = (emp) =>
    nameRegex.test(emp.name) &&
    (!deptId || emp.departmentId === deptId) &&
    emp.salary >= minSal &&
    emp.salary <= maxSal;

  let results = EmployeeDb.getAllEmployees().filter(filterFn);
  results = EmployeeDb.sortBySalary(results);

  displayResults(results, container);
}

function displayResults(employees, container) {
  const resultsContainer = document.getElementById("searchResults");

  if (employees.length === 0) {
    resultsContainer.innerHTML = `
      <div class="module-alert module-alert-info">
        <i class="fas fa-info-circle"></i>
        <div class="module-alert-content">
          <h4>Không Tìm Thấy Kết Quả</h4>
          <p>Không có nhân viên nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
        </div>
      </div>
    `;
    return;
  }

  // Create summary
  const totalEmployees = employees.length;
  const avgSalary =
    employees.reduce((sum, emp) => sum + emp.salary, 0) / totalEmployees;

  resultsContainer.innerHTML = `
    <div class="stats-container mb-4">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <h4>${totalEmployees}</h4>
          <p>Tổng Số Nhân Viên</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="stat-info">
          <h4>${formatCurrency(avgSalary)}</h4>
          <p>Lương Trung Bình</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="fas fa-coins"></i>
        </div>
        <div class="stat-info">
          <h4>${formatCurrency(
            employees[employees.length - 1]?.salary || 0
          )}</h4>
          <p>Lương Cao Nhất</p>
        </div>
      </div>
    </div>
    
    <div class="module-card">
      <div class="module-card-header">
        <h2><i class="fas fa-list"></i> Kết Quả Tìm Kiếm</h2>
        <span class="module-badge module-badge-primary">${
          employees.length
        } nhân viên</span>
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
                <th>Lương Cơ Bản</th>
                <th>Ngày Vào Làm</th>
              </tr>
            </thead>
            <tbody>
              ${employees
                .map(
                  (emp) => `
                <tr>
                  <td>${emp.id}</td>
                  <td>${emp.name}</td>
                  <td>${getDepartmentName(emp.departmentId)}</td>
                  <td>${getPositionName(emp.positionId)}</td>
                  <td>${formatCurrency(emp.salary)}</td>
                  <td>${formatDate(emp.hireDate)}</td>
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
}

function getDepartmentName(deptId) {
  const departments = Department.getAllDepartments();
  const dept = departments.find((d) => d.id === deptId);
  return dept ? dept.name : "Không xác định";
}

function getPositionName(posId) {
  const positions = Position.getAllPositions();
  const pos = positions.find((p) => p.id === posId);
  return pos ? pos.title : "Không xác định";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}
