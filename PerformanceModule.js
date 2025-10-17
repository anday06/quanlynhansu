// PerformanceModule.js
import * as EmployeeDb from "./EmployeeDbModule.js";

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
    <div class="page-header">
      <h1><i class="fas fa-chart-line"></i> Quản Lý Hiệu Suất</h1>
      <p>Đánh giá và theo dõi hiệu suất làm việc của nhân viên</p>
    </div>
    
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-plus-circle"></i> Thêm Đánh Giá</h3>
          </div>
          <div class="card-body">
            <form id="reviewForm">
              <div class="form-group">
                <label for="revEmpId">Mã Nhân Viên</label>
                <input type="number" id="revEmpId" class="form-control" placeholder="Nhập mã nhân viên" required>
              </div>
              
              <div class="form-group">
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
              
              <div class="form-group">
                <label for="feedback">Phản Hồi</label>
                <textarea id="feedback" class="form-control" rows="3" placeholder="Nhập phản hồi về hiệu suất làm việc"></textarea>
              </div>
              
              <button type="submit" class="btn btn-success">
                <i class="fas fa-save"></i> Lưu Đánh Giá
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3><i class="fas fa-trophy"></i> Thống Kê Hiệu Suất</h3>
          </div>
          <div class="card-body">
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
    
    <div class="card mt-4">
      <div class="card-header">
        <h3><i class="fas fa-users"></i> Bảng Xếp Hạng Nhân Viên</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="thead-dark">
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
    
    <div class="card mt-4">
      <div class="card-header">
        <h3><i class="fas fa-comments"></i> Tất Cả Đánh Giá</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="thead-dark">
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
  `;

  // Add event listeners
  container.querySelector("#reviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("revEmpId").value);
    const rating = document.querySelector('input[name="rating"]:checked');
    const feedback = document.getElementById("feedback").value;

    if (!rating) {
      showAlert("Vui lòng chọn đánh giá sao", "error");
      return;
    }

    addReview(id, parseInt(rating.value), feedback);
    showAlert("Đánh giá đã được thêm thành công", "success");
    container.querySelector("#reviewForm").reset();
    document.getElementById("ratingValue").textContent = "Chưa chọn";
    render(container);
  });

  // Add rating change listeners
  const ratingInputs = container.querySelectorAll('input[name="rating"]');
  ratingInputs.forEach((input) => {
    input.addEventListener("change", function () {
      document.getElementById("ratingValue").textContent = `${this.value} sao`;
    });
  });
}

function getPerformanceReport() {
  const employees = EmployeeDb.getAllEmployees();
  return employees
    .map((emp) => {
      const reviews = getReviews().filter((r) => r.employeeId === emp.id);
      return {
        ...emp,
        average: reviews.length
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0,
        reviewCount: reviews.length,
      };
    })
    .filter((emp) => emp.reviewCount > 0) // Only show employees with reviews
    .sort((a, b) => b.average - a.average); // Sort by average rating descending
}

function getOverallAverageRating() {
  const reviews = getReviews();
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function getTopPerformersCount() {
  const report = getPerformanceReport();
  return report.filter((emp) => emp.average >= 4.5).length;
}

function getDepartmentName(deptId) {
  // This would normally import from DepartmentModule
  const departments = JSON.parse(localStorage.getItem("departments")) || [
    { id: 1, name: "Phòng Kỹ Thuật" },
    { id: 2, name: "Phòng Kinh Doanh" },
    { id: 3, name: "Phòng Nhân Sự" },
  ];
  const dept = departments.find((d) => d.id === deptId);
  return dept ? dept.name : "Không xác định";
}

function getRankBadge(rank) {
  const badges = {
    1: '<span class="badge badge-gold"><i class="fas fa-trophy"></i> Vàng</span>',
    2: '<span class="badge badge-silver"><i class="fas fa-trophy"></i> Bạc</span>',
    3: '<span class="badge badge-bronze"><i class="fas fa-trophy"></i> Đồng</span>',
  };

  if (rank <= 3) {
    return badges[rank];
  }
  return `<span class="badge badge-secondary">${rank}</span>`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
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

function showAlert(message, type) {
  // Create alert element
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.innerHTML = `
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;

  // Insert alert at the top of container
  const container = document.querySelector(".page-header").nextElementSibling;
  container.parentNode.insertBefore(alert, container);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 3000);
}
