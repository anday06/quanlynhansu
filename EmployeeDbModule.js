// EmployeeDbModule.js
import apiClient from "./apiClient.js";

let employees = [];
let isLoaded = false;

export async function init() {
  try {
    console.log("Loading employees from API...");
    const data = await apiClient.getEmployees();
    console.log("Employees data received:", data);
    // Đảm bảo luôn trả về mảng
    employees = Array.isArray(data) ? data : [];
    isLoaded = true;
    console.log("Employees loaded:", employees);
  } catch (error) {
    console.error("Failed to load employees:", error);
    // Cung cấp dữ liệu mặc định nếu không thể tải từ API
    employees = [
      {
        id: 1,
        name: "Lê Khánh An",
        department_id: 1, // IT department
        position_id: 1,
        salary: 50000,
        hire_date: "2023-01-01",
        bonus: 0,
        deduction: 0,
      },
      {
        id: 2,
        name: "Nguyễn Lê Hà Anh",
        department_id: 4, // Marketing department
        position_id: 2,
        salary: 60000,
        hire_date: "2023-02-01",
        bonus: 0,
        deduction: 0,
      },
      {
        id: 3,
        name: "Nguyễn Dương Gia Khánh",
        department_id: 2, // HR department
        position_id: 3,
        salary: 55000,
        hire_date: "2023-03-01",
        bonus: 0,
        deduction: 0,
      },
      {
        id: 4,
        name: "Bob Brown",
        department_id: 1, // IT department
        position_id: 1,
        salary: 52000,
        hire_date: "2023-04-01",
        bonus: 0,
        deduction: 0,
      },
      {
        id: 5,
        name: "Charlie Davis",
        department_id: 4, // Marketing department
        position_id: 2,
        salary: 58000,
        hire_date: "2023-05-01",
        bonus: 0,
        deduction: 0,
      },
    ];
    isLoaded = true;
  }
}

export function getAllEmployees() {
  console.log("Getting all employees:", employees);
  // Luôn trả về mảng hợp lệ
  return Array.isArray(employees) ? employees : [];
}

export function isEmployeesLoaded() {
  return isLoaded;
}

export function getEmployeeById(id) {
  // Handle case where id might be a string
  const employeeId = typeof id === "string" ? parseInt(id) : id;
  const emps = getAllEmployees();
  return emps.find((emp) => emp.id === employeeId);
}

export async function addEmployee(employeeData) {
  try {
    console.log("Adding employee with data:", employeeData);
    const newEmployee = await apiClient.createEmployee(employeeData);
    console.log("New employee created:", newEmployee);
    // Đảm bảo employees là mảng hợp lệ trước khi push
    if (!Array.isArray(employees)) {
      console.warn("Employees is not an array, initializing as empty array");
      employees = [];
    }
    employees.push(newEmployee);
    console.log("Employees after push:", employees);
    return newEmployee;
  } catch (error) {
    console.error("Failed to add employee:", error);
    throw new Error("Failed to add employee: " + error.message);
  }
}

export async function updateEmployee(id, employeeData) {
  try {
    console.log("Updating employee:", id, employeeData);
    const updatedEmployee = await apiClient.updateEmployee(id, employeeData);
    console.log("Updated employee:", updatedEmployee);
    // Đảm bảo employees là mảng hợp lệ trước khi map
    if (!Array.isArray(employees)) {
      console.warn("Employees is not an array, initializing as empty array");
      employees = [];
    }
    employees = employees.map((emp) =>
      emp.id === parseInt(id) ? updatedEmployee : emp
    );
    console.log("Employees after update:", employees);
    return updatedEmployee;
  } catch (error) {
    console.error("Failed to update employee:", error);
    throw new Error("Failed to update employee: " + error.message);
  }
}

export async function deleteEmployee(id) {
  // Validate ID first
  if (!id || isNaN(id)) {
    throw new Error("Invalid employee ID");
  }

  // Check if employee exists in local array before attempting to delete
  const employeeExists =
    Array.isArray(employees) &&
    employees.some((emp) => emp.id === parseInt(id));
  if (!employeeExists) {
    console.warn(
      "Employee not found in local array, may have been already deleted:",
      id
    );
    // Remove from local array if exists (defensive programming)
    if (Array.isArray(employees)) {
      employees = employees.filter((emp) => emp.id !== parseInt(id));
    }
    return true; // Consider as success since it's already deleted
  }

  try {
    console.log("Deleting employee:", id);

    await apiClient.deleteEmployee(id);

    // Đảm bảo employees là mảng hợp lệ trước khi filter
    if (!Array.isArray(employees)) {
      console.warn("Employees is not an array, initializing as empty array");
      employees = [];
    }
    employees = employees.filter((emp) => emp.id !== parseInt(id));
    console.log("Employees after delete:", employees);
    return true;
  } catch (error) {
    console.error("Failed to delete employee:", error);

    // If it's a 404 error, the employee might have been already deleted
    if (error.message && error.message.includes("not found")) {
      // Remove from local array anyway
      if (Array.isArray(employees)) {
        employees = employees.filter((emp) => emp.id !== parseInt(id));
      }
      console.log(
        "Employee was already deleted, removed from local array:",
        id
      );
      return true; // Consider as success
    }

    throw new Error("Failed to delete employee: " + error.message);
  }
}

// Higher-order function for filter
export const filterEmployees = (predicate) => (employees) =>
  employees.filter(predicate);

// Example sort
export function sortBySalary(employees, ascending = true) {
  return [...employees].sort((a, b) =>
    ascending ? a.salary - b.salary : b.salary - a.salary
  );
}
