// SalaryAdjustmentDbModule.js
import apiClient from "./apiClient.js";

let salaryAdjustments = [];
let isLoaded = false;

export async function init() {
  try {
    console.log("Loading salary adjustments from API...");
    const response = await apiClient.request("/salary-adjustments");
    console.log("Salary adjustments data received:", response);
    // Đảm bảo luôn trả về mảng
    salaryAdjustments = Array.isArray(response.data) ? response.data : [];
    isLoaded = true;
    console.log("Salary adjustments loaded:", salaryAdjustments);
  } catch (error) {
    console.error("Failed to load salary adjustments:", error);
    // Cung cấp dữ liệu mặc định nếu không thể tải từ API
    salaryAdjustments = [
      {
        id: 1,
        employee_id: 1,
        type: "increase",
        amount: 500000,
        effective_date: "2024-01-01",
        reason: "Thưởng hiệu suất",
        created_by: "Admin",
        created_at: "2024-01-01",
      },
      {
        id: 2,
        employee_id: 2,
        type: "decrease",
        amount: 300000,
        effective_date: "2024-01-15",
        reason: "Vi phạm kỷ luật",
        created_by: "Admin",
        created_at: "2024-01-15",
      },
      {
        id: 3,
        employee_id: 3,
        type: "increase",
        amount: 1000000,
        effective_date: "2024-03-01",
        reason: "Thăng chức",
        created_by: "Manager",
        created_at: "2024-03-01",
      },
    ];
    isLoaded = true;
  }
}

export function getAllAdjustments() {
  console.log("Getting all salary adjustments:", salaryAdjustments);
  // Luôn trả về mảng hợp lệ
  return Array.isArray(salaryAdjustments) ? salaryAdjustments : [];
}

export function isAdjustmentsLoaded() {
  return isLoaded;
}

export function getAdjustmentsByEmployeeId(employeeId) {
  return getAllAdjustments().filter((adj) => adj.employee_id === employeeId);
}

export async function addAdjustment(adjustmentData) {
  try {
    console.log("Adding salary adjustment with data:", adjustmentData);
    const response = await apiClient.request("/salary-adjustments", {
      method: "POST",
      body: JSON.stringify(adjustmentData),
    });
    console.log("New salary adjustment created:", response);
    // Đảm bảo salaryAdjustments là mảng hợp lệ trước khi push
    if (!Array.isArray(salaryAdjustments)) {
      console.warn(
        "Salary adjustments is not an array, initializing as empty array"
      );
      salaryAdjustments = [];
    }
    salaryAdjustments.push(response.data);
    console.log("Salary adjustments after push:", salaryAdjustments);
    return response.data;
  } catch (error) {
    console.error("Failed to add salary adjustment:", error);
    throw new Error("Failed to add salary adjustment: " + error.message);
  }
}

export async function deleteAdjustment(id) {
  // Validate ID first
  if (!id || isNaN(id)) {
    throw new Error("Invalid salary adjustment ID");
  }

  try {
    console.log("Deleting salary adjustment:", id);

    await apiClient.request(`/salary-adjustments/${id}`, {
      method: "DELETE",
    });

    // Đảm bảo salaryAdjustments là mảng hợp lệ trước khi filter
    if (!Array.isArray(salaryAdjustments)) {
      console.warn(
        "Salary adjustments is not an array, initializing as empty array"
      );
      salaryAdjustments = [];
    }
    salaryAdjustments = salaryAdjustments.filter(
      (adj) => adj.id !== parseInt(id)
    );
    console.log("Salary adjustments after delete:", salaryAdjustments);
    return true;
  } catch (error) {
    console.error("Failed to delete salary adjustment:", error);

    // If it's a 404 error, the adjustment might have been already deleted
    if (error.message && error.message.includes("not found")) {
      // Remove from local array anyway
      if (Array.isArray(salaryAdjustments)) {
        salaryAdjustments = salaryAdjustments.filter(
          (adj) => adj.id !== parseInt(id)
        );
      }
      console.log(
        "Salary adjustment was already deleted, removed from local array:",
        id
      );
      return true; // Consider as success
    }

    throw new Error("Failed to delete salary adjustment: " + error.message);
  }
}
