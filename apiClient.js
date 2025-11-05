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
        // Check if it's an error page
        if (response.status >= 400) {
          throw new Error(
            `Server returned ${response.status}: ${text.substring(0, 100)}...`
          );
        }
        // For non-error non-JSON responses, return as text
        return text;
      }
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Network error: Unable to connect to server. Please check your internet connection and ensure the server is running."
        );
      }
      throw error;
    }
  }

  // Employee API methods
  async getEmployees() {
    try {
      const response = await this.request("/employees");
      // Handle different response formats
      if (Array.isArray(response)) {
        return response; // Direct array response
      } else if (response && Array.isArray(response.data)) {
        return response.data; // Wrapped in data property
      } else if (response && response.data === undefined) {
        console.warn("Received undefined data from employees API");
        return []; // Return empty array as fallback
      } else {
        console.error("Unexpected employees response format:", response);
        return []; // Return empty array as fallback
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  }

  async getEmployee(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid employee ID");
    }
    try {
      const response = await this.request(`/employees/${id}`);
      // Handle different response formats
      if (response && response.data !== undefined) {
        return response.data; // Wrapped in data property
      } else if (response) {
        return response; // Direct response
      } else {
        throw new Error("Employee not found");
      }
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      throw error;
    }
  }

  async createEmployee(employeeData) {
    // Validate employee data before sending
    this.validateEmployeeData(employeeData, true);
    try {
      const response = await this.request("/employees", {
        method: "POST",
        body: JSON.stringify(employeeData),
      });
      // Handle different response formats
      if (response && response.data !== undefined) {
        return response.data; // Wrapped in data property
      } else {
        return response; // Direct response
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  }

  async updateEmployee(id, employeeData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid employee ID");
    }
    // Validate employee data before sending
    this.validateEmployeeData(employeeData, false);
    try {
      const response = await this.request(`/employees/${id}`, {
        method: "PUT",
        body: JSON.stringify(employeeData),
      });
      // Handle different response formats
      if (response && response.data !== undefined) {
        return response.data; // Wrapped in data property
      } else {
        return response; // Direct response
      }
    } catch (error) {
      console.error(`Error updating employee ${id}:`, error);
      throw error;
    }
  }

  async deleteEmployee(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid employee ID");
    }
    try {
      const response = await this.request(`/employees/${id}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error(`Error deleting employee ${id}:`, error);
      throw error;
    }
  }

  async searchEmployees(filters) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await this.request(`/employees/search?${queryParams}`);
      // Handle different response formats
      if (Array.isArray(response)) {
        return response; // Direct array response
      } else if (response && Array.isArray(response.data)) {
        return response.data; // Wrapped in data property
      } else {
        console.error("Unexpected search response format:", response);
        return []; // Return empty array as fallback
      }
    } catch (error) {
      console.error("Error searching employees:", error);
      throw error;
    }
  }

  // Department API methods
  async getDepartments() {
    try {
      const response = await this.request("/departments");
      // Handle different response formats
      if (Array.isArray(response)) {
        return response; // Direct array response
      } else if (response && Array.isArray(response.data)) {
        return response.data; // Wrapped in data property
      } else if (response && response.data === undefined) {
        console.warn("Received undefined data from departments API");
        return []; // Return empty array as fallback
      } else {
        console.error("Unexpected departments response format:", response);
        return []; // Return empty array as fallback
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      // Return empty array as fallback to prevent app crash
      return [];
    }
  }

  async getDepartment(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid department ID");
    }
    try {
      const response = await this.request(`/departments/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error);
      throw error;
    }
  }

  async createDepartment(departmentData) {
    if (!departmentData.name) {
      throw new Error("Department name is required");
    }
    try {
      const response = await this.request("/departments", {
        method: "POST",
        body: JSON.stringify(departmentData),
      });
      return response;
    } catch (error) {
      console.error("Error creating department:", error);
      throw error;
    }
  }

  async updateDepartment(id, departmentData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid department ID");
    }
    try {
      const response = await this.request(`/departments/${id}`, {
        method: "PUT",
        body: JSON.stringify(departmentData),
      });
      return response;
    } catch (error) {
      console.error(`Error updating department ${id}:`, error);
      throw error;
    }
  }

  async deleteDepartment(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid department ID");
    }
    try {
      const response = await this.request(`/departments/${id}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error(`Error deleting department ${id}:`, error);
      throw error;
    }
  }

  // Position API methods
  async getPositions() {
    try {
      const response = await this.request("/positions");
      // Handle different response formats
      if (Array.isArray(response)) {
        return response; // Direct array response
      } else if (response && Array.isArray(response.data)) {
        return response.data; // Wrapped in data property
      } else if (response && response.data === undefined) {
        console.warn("Received undefined data from positions API");
        return []; // Return empty array as fallback
      } else {
        console.error("Unexpected positions response format:", response);
        return []; // Return empty array as fallback
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
      // Return empty array as fallback to prevent app crash
      return [];
    }
  }

  async getPosition(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid position ID");
    }
    try {
      const response = await this.request(`/positions/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching position ${id}:`, error);
      throw error;
    }
  }

  async createPosition(positionData) {
    if (!positionData.title) {
      throw new Error("Position title is required");
    }
    try {
      const response = await this.request("/positions", {
        method: "POST",
        body: JSON.stringify(positionData),
      });
      return response;
    } catch (error) {
      console.error("Error creating position:", error);
      throw error;
    }
  }

  async updatePosition(id, positionData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid position ID");
    }
    try {
      const response = await this.request(`/positions/${id}`, {
        method: "PUT",
        body: JSON.stringify(positionData),
      });
      return response;
    } catch (error) {
      console.error(`Error updating position ${id}:`, error);
      throw error;
    }
  }

  async deletePosition(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid position ID");
    }
    try {
      const response = await this.request(`/positions/${id}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error(`Error deleting position ${id}:`, error);
      throw error;
    }
  }

  // Leave Policy API methods
  async getLeavePolicies() {
    try {
      const response = await this.request("/leave-policies");
      // Handle different response formats
      if (Array.isArray(response)) {
        return response; // Direct array response
      } else if (response && Array.isArray(response.data)) {
        return response.data; // Wrapped in data property
      } else if (response && response.data === undefined) {
        console.warn("Received undefined data from leave policies API");
        return []; // Return empty array as fallback
      } else {
        console.error("Unexpected leave policies response format:", response);
        return []; // Return empty array as fallback
      }
    } catch (error) {
      console.error("Error fetching leave policies:", error);
      // Return empty array as fallback to prevent app crash
      return [];
    }
  }

  async getLeavePolicy(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid leave policy ID");
    }
    try {
      const response = await this.request(`/leave-policies/${id}`);
      // Handle different response formats
      if (response && response.data !== undefined) {
        return response.data; // Wrapped in data property
      } else {
        return response; // Direct response
      }
    } catch (error) {
      console.error(`Error fetching leave policy ${id}:`, error);
      throw error;
    }
  }

  async createLeavePolicy(policyData) {
    try {
      const response = await this.request("/leave-policies", {
        method: "POST",
        body: JSON.stringify(policyData),
      });
      // Handle different response formats
      if (response && response.data !== undefined) {
        return response.data; // Wrapped in data property
      } else {
        return response; // Direct response
      }
    } catch (error) {
      console.error("Error creating leave policy:", error);
      throw error;
    }
  }

  async updateLeavePolicy(id, policyData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid leave policy ID");
    }
    try {
      const response = await this.request(`/leave-policies/${id}`, {
        method: "PUT",
        body: JSON.stringify(policyData),
      });
      // Handle different response formats
      if (response && response.data !== undefined) {
        return response.data; // Wrapped in data property
      } else {
        return response; // Direct response
      }
    } catch (error) {
      console.error(`Error updating leave policy ${id}:`, error);
      throw error;
    }
  }

  async deleteLeavePolicy(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid leave policy ID");
    }
    try {
      const response = await this.request(`/leave-policies/${id}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error(`Error deleting leave policy ${id}:`, error);
      throw error;
    }
  }

  // Auth API methods
  async register(userData) {
    try {
      const response = await this.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return response;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.request("/auth/logout", {
        method: "POST",
      });
      return response;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
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
