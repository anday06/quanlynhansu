// AuthModule.js
import apiClient from "./apiClient.js";

export async function register(username, email, password) {
  try {
    const response = await apiClient.register({ username, email, password });
    return response;
  } catch (error) {
    // Kiểm tra thông báo lỗi cụ thể từ API
    if (error.message.includes("Username already exists")) {
      throw new Error("Tên Người Dùng Đã Tồn Tại");
    } else if (error.message.includes("Email already exists")) {
      throw new Error("Email Đã Tồn Tại");
    }
    throw new Error(error.message);
  }
}

export async function login(username, password) {
  try {
    const response = await apiClient.login({ username, password });

    // Store token in localStorage
    localStorage.setItem("authToken", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");

  // Call backend logout endpoint
  apiClient.logout().catch(() => {
    // Ignore errors in logout
  });
}

export async function checkSession() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return false;
  }

  // In a real app, you would verify the token with the backend
  // For now, we'll just check if it exists
  return true;
}

// Get current user
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
