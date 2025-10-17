// SalaryAdjustmentDbModule.js
const SALARY_ADJUSTMENTS_KEY = "salaryAdjustments";

export function init() {
  if (!localStorage.getItem(SALARY_ADJUSTMENTS_KEY)) {
    const defaultAdjustments = [
      {
        id: 1,
        employeeId: 1,
        type: "increase",
        amount: 500000,
        effectiveDate: "2024-01-01",
        reason: "Thưởng hiệu suất",
        createdBy: "Admin",
        createdAt: "2024-01-01",
      },
      {
        id: 2,
        employeeId: 2,
        type: "decrease",
        amount: 300000,
        effectiveDate: "2024-01-15",
        reason: "Vi phạm kỷ luật",
        createdBy: "Admin",
        createdAt: "2024-01-15",
      },
      {
        id: 3,
        employeeId: 3,
        type: "increase",
        amount: 1000000,
        effectiveDate: "2024-03-01",
        reason: "Thăng chức",
        createdBy: "Manager",
        createdAt: "2024-03-01",
      },
    ];
    saveAdjustments(defaultAdjustments);
  }
}

export function getAllAdjustments() {
  return JSON.parse(localStorage.getItem(SALARY_ADJUSTMENTS_KEY)) || [];
}

export function getAdjustmentsByEmployeeId(employeeId) {
  return getAllAdjustments().filter((adj) => adj.employeeId === employeeId);
}

export function saveAdjustments(adjustments) {
  localStorage.setItem(SALARY_ADJUSTMENTS_KEY, JSON.stringify(adjustments));
}

export function addAdjustment(adjustment) {
  const adjustments = getAllAdjustments();
  adjustment.id = Math.max(...adjustments.map((a) => a.id), 0) + 1;
  adjustments.push(adjustment);
  saveAdjustments(adjustments);
  return adjustment;
}

export function deleteAdjustment(id) {
  let adjustments = getAllAdjustments();
  adjustments = adjustments.filter((adj) => adj.id !== id);
  saveAdjustments(adjustments);
}
