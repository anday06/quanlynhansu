// apiClient.js
// Dynamically determine the API base URL based on the current location
const determineApiBase = () => {
  // Get the current pathname
  const path = window.location.pathname;

  // If we're at the root level (http://localhost/), API should be at /backend/api.php
  if (path === "/" || path === "/index.html") {
    return "/backend/api.php";
  }

  // If we're in a subdirectory like /baiquanlynhansu/,
  // API should be at /baiquanlynhansu/backend/api.php
  // Find the last slash to determine the base path
  const lastSlashIndex = path.lastIndexOf("/");
  if (lastSlashIndex > 0) {
    const basePath = path.substring(0, lastSlashIndex);
    return basePath + "/backend/api.php";
  }

  // Fallback
  return "/backend/api.php";
};

const API_BASE = determineApiBase();

class ApiClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  async request(endpoint, options = {}) {
    // Use query parameter format for routing
    const url = `${this.baseURL}?endpoint=${encodeURIComponent(endpoint)}`;

    // Add default headers
    const config = {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json; charset=utf-8",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get("content-type");

      // Check if response is JSON
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error || "Request failed");
        }

        return data;
      } else {
        // If not JSON, it's probably an HTML error page
        const text = await response.text();
        throw new Error(
          `Server returned ${response.status}: ${text.substring(0, 100)}...`
        );
      }
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error("Network error: Unable to connect to server");
      }
      throw error;
    }
  }

  // Employee API methods
  async getEmployees() {
    const response = await this.request("/employees");
    // API returns object with data property, need to extract it
    return response.data;
  }

  async getEmployee(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid employee ID");
    }
    const response = await this.request(`/employees/${id}`);
    // API returns object with data property, need to extract it
    return response.data;
  }

  async createEmployee(employeeData) {
    // Validate employee data before sending
    this.validateEmployeeData(employeeData, true);
    const response = await this.request("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });
    // API returns object with data property, need to extract it
    return response.data;
  }

  async updateEmployee(id, employeeData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid employee ID");
    }
    // Validate employee data before sending
    this.validateEmployeeData(employeeData, false);
    const response = await this.request(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    });
    // API returns object with data property, need to extract it
    return response.data;
  }

  async deleteEmployee(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid employee ID");
    }
    const response = await this.request(`/employees/${id}`, {
      method: "DELETE",
    });
    return response;
  }

  async searchEmployees(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await this.request(`/employees/search?${queryParams}`);
    // API returns object with data property, need to extract it
    return response.data;
  }

  // Department API methods
  async getDepartments() {
    const response = await this.request("/departments");
    // API returns array directly, not wrapped in data property
    return response;
  }

  async getDepartment(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid department ID");
    }
    const response = await this.request(`/departments/${id}`);
    // API returns object directly, not wrapped in data property
    return response;
  }

  async createDepartment(departmentData) {
    if (!departmentData.name) {
      throw new Error("Department name is required");
    }
    const response = await this.request("/departments", {
      method: "POST",
      body: JSON.stringify(departmentData),
    });
    // API returns object directly, not wrapped in data property
    return response;
  }

  async updateDepartment(id, departmentData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid department ID");
    }
    const response = await this.request(`/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(departmentData),
    });
    // API returns object directly, not wrapped in data property
    return response;
  }

  async deleteDepartment(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid department ID");
    }
    const response = await this.request(`/departments/${id}`, {
      method: "DELETE",
    });
    return response;
  }

  // Position API methods
  async getPositions() {
    const response = await this.request("/positions");
    // API returns array directly, not wrapped in data property
    return response;
  }

  async getPosition(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid position ID");
    }
    const response = await this.request(`/positions/${id}`);
    // API returns object directly, not wrapped in data property
    return response;
  }

  async createPosition(positionData) {
    if (!positionData.title) {
      throw new Error("Position title is required");
    }
    const response = await this.request("/positions", {
      method: "POST",
      body: JSON.stringify(positionData),
    });
    // API returns object directly, not wrapped in data property
    return response;
  }

  async updatePosition(id, positionData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid position ID");
    }
    const response = await this.request(`/positions/${id}`, {
      method: "PUT",
      body: JSON.stringify(positionData),
    });
    // API returns object directly, not wrapped in data property
    return response;
  }

  async deletePosition(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid position ID");
    }
    const response = await this.request(`/positions/${id}`, {
      method: "DELETE",
    });
    return response;
  }

  // Leave Policy API methods
  async getLeavePolicies() {
    const response = await this.request("/leave-policies");
    // API returns object with data property, need to extract it
    return response.data;
  }

  async getLeavePolicy(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid leave policy ID");
    }
    const response = await this.request(`/leave-policies/${id}`);
    // API returns object with data property, need to extract it
    return response.data;
  }

  async createLeavePolicy(policyData) {
    const response = await this.request("/leave-policies", {
      method: "POST",
      body: JSON.stringify(policyData),
    });
    // API returns object with data property, need to extract it
    return response.data;
  }

  async updateLeavePolicy(id, policyData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid leave policy ID");
    }
    const response = await this.request(`/leave-policies/${id}`, {
      method: "PUT",
      body: JSON.stringify(policyData),
    });
    // API returns object with data property, need to extract it
    return response.data;
  }

  async deleteLeavePolicy(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid leave policy ID");
    }
    const response = await this.request(`/leave-policies/${id}`, {
      method: "DELETE",
    });
    return response;
  }

  // Auth API methods
  async register(userData) {
    const response = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response;
  }

  async login(credentials) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response;
  }

  async logout() {
    const response = await this.request("/auth/logout", {
      method: "POST",
    });
    return response;
  }

  /**
   * Validate employee data
   * @param {Object} data - Employee data to validate
   * @param {boolean} isCreate - Whether this is for creation (requires all fields)
   */
  validateEmployeeData(data, isCreate = false) {
    // Required fields for creation
    if (isCreate) {
      if (!data.name) {
        throw new Error("Employee name is required");
      }

      if (!data.department_id || isNaN(data.department_id)) {
        throw new Error("Valid department is required");
      }

      if (!data.position_id || isNaN(data.position_id)) {
        throw new Error("Valid position is required");
      }

      if (!data.hire_date) {
        throw new Error("Hire date is required");
      }
    }

    // Validate salary
    if (data.salary !== undefined && (isNaN(data.salary) || data.salary < 0)) {
      throw new Error("Salary must be a positive number");
    }

    // Validate hire date format
    if (data.hire_date) {
      const date = new Date(data.hire_date);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid hire date format");
      }
    }

    // Validate email format if provided
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error("Invalid email format");
    }

    // Validate bonus and deduction
    if (data.bonus !== undefined && (isNaN(data.bonus) || data.bonus < 0)) {
      throw new Error("Bonus must be a positive number");
    }

    if (
      data.deduction !== undefined &&
      (isNaN(data.deduction) || data.deduction < 0)
    ) {
      throw new Error("Deduction must be a positive number");
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
