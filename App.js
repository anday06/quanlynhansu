// app.js
import * as Auth from "./AuthModule.js";
import * as EmployeeDb from "./EmployeeDbModule.js";
import * as AddEmployee from "./addEmployeeModule.js";
import * as EditEmployee from "./EditEmployeeModule.js";
import * as DeleteEmployee from "./DeleteEmployeeModule.js";
import * as SearchEmployee from "./SearchEmployeeModule.js";
import * as Department from "./DepartmentModule.js";
import * as Position from "./PositionModule.js";
import * as Salary from "./SalaryModule.js";
import * as Attendance from "./AttendanceModule.js";
import * as Leave from "./LeaveModule.js";
import * as Performance from "./PerformanceModule.js";
import * as Dashboard from "./DashboardModule.js";
import * as SalaryAdjustment from "./salaryAdjustmentModule.js";
import * as LeavePolicy from "./leavePolicyModule.js";
import * as SalaryAdjustmentDb from "./SalaryAdjustmentDbModule.js";

const appContainer = document.getElementById("app");
const authSection = document.getElementById("auth-section");
const dashboardSection = document.getElementById("dashboard-section");
const mainContentArea = document.getElementById("main-content-area");
const logoutBtn = document.getElementById("logout");

// Get login and register sections
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const showRegisterLink = document.getElementById("show-register");
const showLoginLink = document.getElementById("show-login");

// Initialize databases
EmployeeDb.init();
Department.init();
Position.init();
Attendance.init();
Leave.init();
Performance.init();
SalaryAdjustmentDb.init();

// Routing map
const routes = {
  dashboard: Dashboard.render,
  addEmployee: AddEmployee.render,
  editEmployee: EditEmployee.render,
  deleteEmployee: DeleteEmployee.render,
  searchEmployee: SearchEmployee.render,
  department: Department.render,
  position: Position.render,
  salary: Salary.render,
  salaryAdjustment: SalaryAdjustment.render,
  attendance: Attendance.render,
  leave: Leave.render,
  leavePolicy: LeavePolicy.render,
  performance: Performance.render,
};

async function initApp() {
  const isLoggedIn = await Auth.checkSession();
  if (isLoggedIn) {
    showDashboard();
  } else {
    showAuth();
  }
}

function showAuth() {
  authSection.style.display = "block";
  dashboardSection.style.display = "none";

  // Show login section by default
  showLoginSection();

  // Set up navigation between login and register
  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", (e) => {
      e.preventDefault();
      showRegisterSection();
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      showLoginSection();
    });
  }

  // Login form submission
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const success = await Auth.login(username, password);
      if (success) {
        showDashboard();
      } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    });
  }

  // Registration form submission
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("reg-username").value;
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById(
        "reg-confirm-password"
      ).value;

      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      try {
        await Auth.register(username, password);
        alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
        // Switch to login form
        showLoginSection();
      } catch (error) {
        alert("Đăng ký thất bại: " + error.message);
      }
    });
  }
}

function showLoginSection() {
  loginSection.style.display = "block";
  registerSection.style.display = "none";
}

function showRegisterSection() {
  loginSection.style.display = "none";
  registerSection.style.display = "block";
}

function showDashboard() {
  authSection.style.display = "none";
  dashboardSection.style.display = "flex";

  // Set up sidebar toggle
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // Set up submenu toggles
  const submenuToggles = document.querySelectorAll(".submenu-toggle");
  submenuToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const parentItem = toggle.parentElement;
      parentItem.classList.toggle("active");
    });
  });

  // Set up menu item clicks
  const menuLinks = document.querySelectorAll(".sidebar-menu a[data-module]");
  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Get the module from the link element
      const module = link.dataset.module;

      // Check if module exists in routes
      if (routes[module]) {
        mainContentArea.innerHTML = "";
        routes[module](mainContentArea);

        // Update page title
        const pageTitle = document.getElementById("page-title");
        if (pageTitle) {
          const titleMap = {
            dashboard: "Bảng Điều Khiển",
            addEmployee: "Thêm Nhân Viên",
            editEmployee: "Sửa Thông Tin Nhân Viên",
            deleteEmployee: "Xóa Nhân Viên",
            searchEmployee: "Tìm Kiếm Nhân Viên",
            department: "Quản Lý Phòng Ban",
            position: "Quản Lý Chức Vụ",
            salary: "Bảng Lương",
            salaryAdjustment: "Điều Chỉnh Lương",
            attendance: "Chấm Công",
            leave: "Danh Sách Nghỉ Phép",
            leavePolicy: "Chính Sách Nghỉ Phép",
            performance: "Đánh Giá Hiệu Suất",
          };
          pageTitle.textContent = titleMap[module] || module;
        }
      } else {
        console.error("Module not found:", module);
        mainContentArea.innerHTML = `<div class="card"><div class="card-body"><h3>Module not found: ${module}</h3></div></div>`;
      }

      // Update active state for all menu items
      document.querySelectorAll(".sidebar-menu a").forEach((a) => {
        a.classList.remove("active");
      });
      link.classList.add("active");

      // Also activate parent menu item if this is a submenu item
      const parentMenuItem = link.closest(".has-submenu");
      if (parentMenuItem) {
        parentMenuItem.classList.add("active");
      }

      // Close sidebar on mobile after selection
      if (window.innerWidth < 992) {
        sidebar.classList.remove("active");
      }
    });
  });

  // Set up logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      Auth.logout();
      showAuth();
    });
  }

  // Default route
  routes["dashboard"](mainContentArea);
}

// Initialize the app when the DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
