// PerformanceModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as Department from "./DepartmentModule.js";

const REVIEWS_KEY = "reviews";

export function init() {
  if (!localStorage.getItem(REVIEWS_KEY)) {
    saveReviews([]);
  }
}

export function addReview(employeeId, rating, feedback) {
  const reviews = getReviews();
  const id = Math.max(...reviews.map((r) => r.id || 0), 0) + 1;
  reviews.push({
    id,
    employeeId,
    date: new Date().toISOString().split("T")[0],
    rating,
    feedback,
  });
  saveReviews(reviews);
}

export function getAverageRating(employeeId) {
  const revs = getReviews().filter((r) => r.employeeId === employeeId);
  if (!revs.length) return 0;
  return revs.reduce((sum, r) => sum + r.rating, 0) / revs.length;
}

function getReviews() {
  return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
}

function saveReviews(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function render(container) {
  container.innerHTML = `
    <div class="module-container">
      <div class="module-header">
        <h1><i class="fas fa-chart-line"></i> Quản Lý Hiệu Suất</h1>
      </div>
      
      <div class="module-subheader">
        <p>Đánh giá và theo dõi hiệu suất làm việc của nhân viên</p>
      </div>
      
      <div class="row">
        <div class="col-md-6">
          <div class="module-card">
            <div class="module-card-header">
              <h2><i class="fas fa-plus-circle"></i> Thêm Đánh Giá</h2>
            </div>
            <div class="module-card-body">
              <form id="reviewForm" class="module-form">
                <div class="module-form-group">
                  <label for="revEmpId">Mã Nhân Viên</label>
                  <input type="number" id="revEmpId" class="module-form-control" placeholder="Nhập mã nhân viên" required>
                </div>
                
                <div class="module-form-group">
                  <label for="rating">Đánh Giá (1-5 sao)</label>
                  <div class="rating-stars">
                    <input type="radio" id="star5" name="rating" value="5" />
                    <label for="star5" title="5 sao">★</label>
                    <input type="radio" id="star4" name="rating" value="4" />
                    <label for="star4" title="4 sao">★</label>
                    <input type="radio" id="star3" name="rating" value="3" />
                    <label for="star3" title="3 sao">★</label>
                    <input type="radio" id="star2" name="rating" value="2" />
                    <label for="star2" title="2 sao">★</label>
                    <input type="radio" id="star1" name="rating" value="1" />
                    <label for="star1" title="1 sao">★</label>
                  </div>
                  <div class="rating-value mt-2">
                    <span id="ratingValue">Chưa chọn</span>
                  </div>
                </div>
                
                <div class="module-form-group">
                  <label for="feedback">Phản Hồi</label>
                  <textarea id="feedback" class="module-form-control" rows="3" placeholder="Nhập phản hồi về hiệu suất làm việc"></textarea>
                </div>
                
                <button type="submit" class="btn btn-success">
                  <i class="fas fa-save"></i> Lưu Đánh Giá
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="module-card">
            <div class="module-card-header">
              <h2><i class="fas fa-trophy"></i> Thống Kê Hiệu Suất</h2>
            </div>
            <div class="module-card-body">
              <div class="performance-stats">
                <div class="stat-item">
                  <h4>Tổng Số Đánh Giá</h4>
                  <p class="stat-number">${getReviews().length}</p>
                </div>
                <div class="stat-item">
                  <h4>Đánh Giá Trung Bình</h4>
                  <p class="stat-number">${getOverallAverageRating().toFixed(
                    2
                  )} <i class="fas fa-star text-warning"></i></p>
                </div>
                <div class="stat-item">
                  <h4>Nhân Viên Xuất Sắc</h4>
                  <p class="stat-number">${getTopPerformersCount()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="module-card mt-4">
        <div class="module-card-header">
          <h2><i class="fas fa-users"></i> Bảng Xếp Hạng Nhân Viên</h2>
        </div>
        <div class="module-card-body">
          <div class="module-table-container">
            <table class="module-table">
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Họ Tên</th>
                  <th>Phòng Ban</th>
                  <th>Đánh Giá Trung Bình</th>
                  <th>Số Lượng Đánh Giá</th>
                  <th>Xếp Hạng</th>
                </tr>
              </thead>
              <tbody>
                ${getPerformanceReport()
                  .map(
                    (emp, index) => `
                    <tr>
                      <td>${emp.id}</td>
                      <td>${emp.name}</td>
                      <td>${getDepartmentName(emp.departmentId)}</td>
                      <td>
                        <span class="rating-badge">
                          ${emp.average.toFixed(
                            2
                          )} <i class="fas fa-star text-warning"></i>
                        </span>
                      </td>
                      <td>${emp.reviewCount}</td>
                      <td>
                        ${getRankBadge(index + 1)}
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
      
      <div class="module-card mt-4">
        <div class="module-card-header">
          <h2><i class="fas fa-comments"></i> Tất Cả Đánh Giá</h2>
        </div>
        <div class="module-card-body">
          <div class="module-table-container">
            <table class="module-table">
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Ngày</th>
                  <th>Đánh Giá</th>
                  <th>Phản Hồi</th>
                </tr>
              </thead>
              <tbody>
                ${getReviews()
                  .map(
                    (r) => `
                    <tr>
                      <td>${r.employeeId}</td>
                      <td>${formatDate(r.date)}</td>
                      <td>
                        ${renderStars(r.rating)}
                      </td>
                      <td>${r.feedback || "Không có phản hồi"}</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add event listeners for rating stars
  const ratingInputs = container.querySelectorAll('input[name="rating"]');
  const ratingValue = container.querySelector("#ratingValue");

  ratingInputs.forEach((input) => {
    input.addEventListener("change", () => {
      ratingValue.textContent = `${input.value} sao`;
    });
  });

  // Add event listener for form submission
  container.querySelector("#reviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const employeeId = parseInt(document.getElementById("revEmpId").value);
    const rating = document.querySelector('input[name="rating"]:checked');
    const feedback = document.getElementById("feedback").value;

    if (!employeeId) {
      showAlert("Vui lòng nhập mã nhân viên", "danger");
      return;
    }

    if (!rating) {
      showAlert("Vui lòng chọn đánh giá", "danger");
      return;
    }

    addReview(employeeId, parseInt(rating.value), feedback);
    showAlert("Đánh giá đã được lưu", "success");
    render(container);
  });
}

function getPerformanceReport() {
  const employees = EmployeeDb.getAllEmployees();
  return employees
    .map((emp) => {
      const average = getAverageRating(emp.id);
      const reviewCount = getReviews().filter(
        (r) => r.employeeId === emp.id
      ).length;
      return {
        ...emp,
        average,
        reviewCount,
      };
    })
    .sort((a, b) => b.average - a.average);
}

function getOverallAverageRating() {
  const reviews = getReviews();
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function getTopPerformersCount() {
  const report = getPerformanceReport();
  return report.filter((emp) => emp.average >= 4.0).length;
}

function getDepartmentName(deptId) {
  const departments = Department.getAllDepartments();
  const dept = departments.find((d) => d.id === deptId);
  return dept ? dept.name : "Không xác định";
}

function getRankBadge(rank) {
  const ranks = {
    1: { text: "Vàng", class: "badge-warning" },
    2: { text: "Bạc", class: "badge-secondary" },
    3: { text: "Đồng", class: "badge-danger" },
  };

  if (ranks[rank]) {
    return `<span class="module-badge ${ranks[rank].class}">${ranks[rank].text}</span>`;
  }
  return `<span class="module-badge module-badge-info">#${rank}</span>`;
}

function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star text-warning"></i>';
    } else {
      stars += '<i class="far fa-star text-warning"></i>';
    }
  }
  return stars;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
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

  // Insert alert at the top of the container
  const container = document.querySelector(".module-container");
  container.insertBefore(alert, container.firstChild.nextSibling);

  // Add close event
  const closeBtn = alert.querySelector(".module-alert-close");
  closeBtn.addEventListener("click", () => {
    alert.remove();
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}
