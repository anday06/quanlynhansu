// salaryAdjustmentModule.js
export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-percentage"></i> Điều Chỉnh Lương</h1>
      <div class="page-header-actions">
        <button class="btn btn-info">
          <i class="fas fa-download"></i> Xuất báo cáo
        </button>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-edit"></i> Form Điều Chỉnh Lương</h3>
      </div>
      <form>
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="employeeSelect">Nhân viên</label>
              <select id="employeeSelect" class="form-control">
                <option value="">Chọn nhân viên</option>
                <option value="1">Nguyễn Văn A</option>
                <option value="2">Trần Thị B</option>
                <option value="3">Lê Văn C</option>
              </select>
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="adjustmentType">Loại điều chỉnh</label>
              <select id="adjustmentType" class="form-control">
                <option value="increase">Tăng lương</option>
                <option value="decrease">Giảm lương</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="adjustmentAmount">Số tiền điều chỉnh</label>
              <input type="number" id="adjustmentAmount" class="form-control" placeholder="Nhập số tiền">
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="effectiveDate">Ngày hiệu lực</label>
              <input type="date" id="effectiveDate" class="form-control">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="reason">Lý do điều chỉnh</label>
          <textarea id="reason" class="form-control" rows="3" placeholder="Nhập lý do điều chỉnh lương"></textarea>
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> Lưu Điều Chỉnh
          </button>
          <button type="button" class="btn btn-secondary">
            <i class="fas fa-times"></i> Hủy
          </button>
        </div>
      </form>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-history"></i> Lịch Sử Điều Chỉnh</h3>
        <div class="card-actions">
          <button class="btn btn-sm btn-info">
            <i class="fas fa-filter"></i> Bộ lọc
          </button>
        </div>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Loại điều chỉnh</th>
              <th>Số tiền</th>
              <th>Ngày hiệu lực</th>
              <th>Lý do</th>
              <th>Người thực hiện</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nguyễn Văn A</td>
              <td><span class="badge badge-success">Tăng lương</span></td>
              <td>500,000 VNĐ</td>
              <td>01/01/2024</td>
              <td>Thưởng hiệu suất</td>
              <td>Admin</td>
              <td class="table-actions">
                <button class="btn btn-sm btn-info">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>Trần Thị B</td>
              <td><span class="badge badge-danger">Giảm lương</span></td>
              <td>300,000 VNĐ</td>
              <td>15/01/2024</td>
              <td>Vi phạm kỷ luật</td>
              <td>Admin</td>
              <td class="table-actions">
                <button class="btn btn-sm btn-info">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>Lê Văn C</td>
              <td><span class="badge badge-success">Tăng lương</span></td>
              <td>1,000,000 VNĐ</td>
              <td>01/03/2024</td>
              <td>Thăng chức</td>
              <td>Manager</td>
              <td class="table-actions">
                <button class="btn btn-sm btn-info">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}
