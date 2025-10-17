// SearchEmployeeModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";

export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <h2>Tìm Kiếm Nhân Viên</h2>
      <p>Tìm kiếm và lọc nhân viên theo các tiêu chí khác nhau</p>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3>Bộ Lọc Tìm Kiếm</h3>
      </div>
      <div class="card-body">
        <form id="searchForm">
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="searchName">Tên Nhân Viên</label>
              <input type="text" id="searchName" class="form-control" placeholder="Nhập tên hoặc từ khóa">
            </div>
            
            <div class="form-group col-md-6">
              <label for="searchDepartment">Phòng Ban</label>
              <select id="searchDepartment" class="form-control">
                <option value="">Tất Cả Phòng Ban</option>
                ${Department.getAllDepartments()
                  .map((d) => `<option value="${d.id}">${d.name}</option>`)
                  .join("")}
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="minSalary">Lương Tối Thiểu</label>
              <input type="number" id="minSalary" class="form-control" placeholder="Nhập mức lương tối thiểu">
            </div>
            
            <div class="form-group col-md-6">
              <label for="maxSalary">Lương Tối Đa</label>
              <input type="number" id="maxSalary" class="form-control" placeholder="Nhập mức lương tối đa">
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary">Tìm Kiếm</button>
          <button type="button" id="clearSearch" class="btn btn-secondary">Xóa Bộ Lọc</button>
        </form>
      </div>
    </div>
    
    <div id="searchResults" class="mt-4"></div>
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
      <div class="alert alert-info">
        <h4>Không Tìm Thấy Kết Quả</h4>
        <p>Không có nhân viên nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
      </div>
    `;
    return;
  }

  // Create summary
  const totalEmployees = employees.length;
  const avgSalary =
    employees.reduce((sum, emp) => sum + emp.salary, 0) / totalEmployees;

  resultsContainer.innerHTML = `
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h5>Tổng Số Nhân Viên</h5>
            <h2>${totalEmployees}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h5>Lương Trung Bình</h5>
            <h2>${formatCurrency(avgSalary)}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h5>Lương Cao Nhất</h5>
            <h2>${formatCurrency(
              employees[employees.length - 1]?.salary || 0
            )}</h2>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3>Kết Quả Tìm Kiếm</h3>
        <span class="badge badge-primary">${employees.length} nhân viên</span>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="thead-dark">
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
