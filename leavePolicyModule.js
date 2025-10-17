// leavePolicyModule.js
export function render(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1><i class="fas fa-book"></i> Chính Sách Nghỉ Phép</h1>
      <div class="page-header-actions">
        <button class="btn btn-success">
          <i class="fas fa-plus"></i> Thêm chính sách
        </button>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-edit"></i> Form Chính Sách Nghỉ Phép</h3>
      </div>
      <form>
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="policyName">Tên chính sách</label>
              <input type="text" id="policyName" class="form-control" placeholder="Nhập tên chính sách">
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="leaveType">Loại nghỉ phép</label>
              <select id="leaveType" class="form-control">
                <option value="">Chọn loại nghỉ phép</option>
                <option value="annual">Nghỉ phép hàng năm</option>
                <option value="sick">Nghỉ ốm</option>
                <option value="personal">Nghỉ cá nhân</option>
                <option value="maternity">Nghỉ thai sản</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-col">
            <div class="form-group">
              <label for="daysAllowed">Số ngày cho phép</label>
              <input type="number" id="daysAllowed" class="form-control" placeholder="Nhập số ngày">
            </div>
          </div>
          <div class="form-col">
            <div class="form-group">
              <label for="eligibilityPeriod">Thời gian đủ điều kiện (tháng)</label>
              <input type="number" id="eligibilityPeriod" class="form-control" placeholder="Nhập số tháng">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="policyDescription">Mô tả chính sách</label>
          <textarea id="policyDescription" class="form-control" rows="3" placeholder="Nhập mô tả chính sách"></textarea>
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> Lưu Chính Sách
          </button>
          <button type="button" class="btn btn-secondary">
            <i class="fas fa-times"></i> Hủy
          </button>
        </div>
      </form>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3><i class="fas fa-list"></i> Danh Sách Chính Sách</h3>
        <div class="card-actions">
          <button class="btn btn-sm btn-info">
            <i class="fas fa-search"></i> Tìm kiếm
          </button>
        </div>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Tên chính sách</th>
              <th>Loại nghỉ phép</th>
              <th>Số ngày</th>
              <th>Thời gian đủ điều kiện</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nghỉ phép hàng năm</td>
              <td>Nghỉ phép hàng năm</td>
              <td>12 ngày</td>
              <td>6 tháng</td>
              <td><span class="badge badge-success">Hoạt động</span></td>
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
              <td>Nghỉ ốm</td>
              <td>Nghỉ ốm</td>
              <td>30 ngày</td>
              <td>0 tháng</td>
              <td><span class="badge badge-success">Hoạt động</span></td>
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
              <td>Nghỉ thai sản</td>
              <td>Nghỉ thai sản</td>
              <td>6 tháng</td>
              <td>12 tháng</td>
              <td><span class="badge badge-warning">Tạm ngưng</span></td>
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
