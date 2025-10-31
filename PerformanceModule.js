// PerformanceModule.js
import apiClient from "./apiClient.js";
import * as Department from "./DepartmentModule.js";

let performanceReviews = [];
let isLoaded = false;

export async function init() {
  try {
    console.log("Loading performance reviews from API...");
    const response = await apiClient.request("/performance");
    console.log("Performance data received:", response);
    // Đảm bảo luôn trả về mảng
    performanceReviews = Array.isArray(response.data) ? response.data : [];
    isLoaded = true;
    console.log("Performance reviews loaded:", performanceReviews);
  } catch (error) {
    console.error("Failed to load performance reviews:", error);
    // Cung cấp dữ liệu mặc định nếu không thể tải từ API
    performanceReviews = [];
    isLoaded = true;
  }

  // Initialize departments
  try {
    await Department.init();
  } catch (error) {
    console.error("Failed to initialize departments:", error);
  }
}

export async function addReview(employeeId, rating, feedback) {
  try {
    const reviewData = {
      employee_id: employeeId,
      date: new Date().toISOString().split("T")[0],
      rating: rating,
      feedback: feedback,
      reviewer: "Admin", // In a real app, this would be the current user
    };

    const response = await apiClient.request("/performance", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });

    // Reload performance reviews
    await init();

    return response;
  } catch (error) {
    console.error("Failed to add review:", error);
    throw new Error("Failed to add review: " + error.message);
  }
}

export async function getAverageRating(employeeId) {
  try {
    const response = await apiClient.request(
      `/performance/average/${employeeId}`
    );
    return response.data ? parseFloat(response.data.average) : 0;
  } catch (error) {
    console.error("Failed to get average rating:", error);
    // Calculate from local data if API fails
    const revs = performanceReviews.filter((r) => r.employee_id === employeeId);
    if (!revs.length) return 0;
    return revs.reduce((sum, r) => sum + r.rating, 0) / revs.length;
  }
}

export async function render(container) {
  // Ensure departments are loaded
  try {
    await Department.init();
  } catch (error) {
    console.error("Failed to load departments:", error);
  }

  // Ensure performance reviews are loaded
  if (!isLoaded) {
    // Show loading state while data is being fetched
    container.innerHTML = `
      <div class="module-container">
        <div class="module-header">
          <h1><i class="fas fa-chart-line"></i> Quản Lý Hiệu Suất</h1>
        </div>
        <div class="module-card">
          <div class="module-card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Đang tải...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu hiệu suất...</p>
          </div>
        </div>
      </div>
    `;

    // Wait for data to load
    await init();
  }

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
                  <p class="stat-number">${performanceReviews.length}</p>
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
                      <td>${getDepartmentName(emp.department_id)}</td>
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
                ${performanceReviews
                  .map(
                    (r) => `
                    <tr>
                      <td>${r.employee_id}</td>
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

  // Add event listener for review form
  container
    .querySelector("#reviewForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = parseInt(document.getElementById("revEmpId").value);
      const rating = parseInt(
        document.querySelector('input[name="rating"]:checked')?.value
      );
      const feedback = document.getElementById("feedback").value;

      if (!id || !rating) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }

      try {
        await addReview(id, rating, feedback);
        alert("Đánh giá đã được lưu thành công!");
        document.getElementById("reviewForm").reset();
        ratingValue.textContent = "Chưa chọn";
        await render(container);
      } catch (error) {
        alert("Lưu đánh giá thất bại: " + error.message);
      }
    });
}

function getPerformanceReport() {
  // Get employees from EmployeeDb module
  const employees = []; // This would normally come from EmployeeDb.getAllEmployees()

  return employees
    .map((emp) => {
      const average = getAverageRatingSync(emp.id); // Use sync version for rendering
      const reviewCount = performanceReviews.filter(
        (r) => r.employee_id === emp.id
      ).length;
      return {
        ...emp,
        average,
        reviewCount,
      };
    })
    .sort((a, b) => b.average - a.average);
}

function getAverageRatingSync(employeeId) {
  const revs = performanceReviews.filter((r) => r.employee_id === employeeId);
  if (!revs.length) return 0;
  return revs.reduce((sum, r) => sum + r.rating, 0) / revs.length;
}

function getOverallAverageRating() {
  if (!performanceReviews.length) return 0;
  return (
    performanceReviews.reduce((sum, r) => sum + r.rating, 0) /
    performanceReviews.length
  );
}

function getTopPerformersCount() {
  const report = getPerformanceReport();
  return report.filter((emp) => emp.average >= 4.0).length;
}

function getDepartmentName(deptId) {
  const departments = Department.getAllDepartments();
  const dept = departments.find((d) => d.id === parseInt(deptId));
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
  return "";
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
