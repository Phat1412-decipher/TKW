/**
 * ==============================================================================
 * PHỤ TRÁCH: MEMBER 3 - QUẢN LÝ VẬT TƯ (inventory.js)
 * Tinh chỉnh Senior Frontend: Live Search Debounce, Không dấu, Phân trang, Sắp xếp,
 * Validation tại chỗ tiếng Việt, Format Intl.NumberFormat('vi-VN'), Icon action buttons.
 * ==============================================================================
 */

// State quản lý danh mục vật tư
const inventoryState = {
  keyword: '',
  warehouse: '',
  status: '',
  sortField: 'id',
  sortOrder: 'asc', // 'asc' | 'desc'
  page: 1,
  pageSize: 10,
  highlightId: null,
  isLoading: false
};

// Định dạng tiền tệ VND chuẩn
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
});

// Định dạng số chuẩn
const numberFormatter = new Intl.NumberFormat('vi-VN');

// Hàm loại bỏ dấu tiếng Việt để tìm kiếm thông minh
function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str.trim();
}

// Hàm debounce
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initLayout === 'function') {
    initLayout('inventory');
  }
  setupEventListeners();
  renderInventoryTable();

  // Đăng ký nhận thông báo Realtime từ hệ thống nếu có
  if (window.DB && typeof window.DB.onUpdate === 'function') {
    window.DB.onUpdate(() => {
      renderInventoryTable();
    });
  }
});

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    const handleSearch = debounce((e) => {
      inventoryState.keyword = e.target.value;
      inventoryState.page = 1;
      renderInventoryTable();
    }, 300);
    searchInput.addEventListener('input', handleSearch);
  }

  const filterWarehouse = document.getElementById('filter-warehouse');
  if (filterWarehouse) {
    filterWarehouse.addEventListener('change', (e) => {
      inventoryState.warehouse = e.target.value;
      inventoryState.page = 1;
      renderInventoryTable();
    });
  }

  const filterStatus = document.getElementById('filter-status');
  if (filterStatus) {
    filterStatus.addEventListener('change', (e) => {
      inventoryState.status = e.target.value;
      inventoryState.page = 1;
      renderInventoryTable();
    });
  }

  const pageSizeSelect = document.getElementById('filter-page-size');
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', (e) => {
      inventoryState.pageSize = parseInt(e.target.value, 10);
      inventoryState.page = 1;
      renderInventoryTable();
    });
  }

  // Barcode scanner simulator
  const barcodeInput = document.getElementById('barcode-input');
  if (barcodeInput) {
    barcodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const code = barcodeInput.value.trim();
        if (!code) return;
        const items = DB.getItems();
        const item = items.find(i => i.barcode === code || i.id === code);
        if (item) {
          DB.showToast(`Tìm thấy: ${item.name} (Tồn: ${item.quantity} ${item.unit})`, 'success');
          if (searchInput) searchInput.value = item.id;
          inventoryState.keyword = item.id;
          inventoryState.page = 1;
          renderInventoryTable(item.id);
          barcodeInput.value = '';
        } else {
          DB.showToast(`Không tìm thấy mã vạch: ${code}`, 'error');
        }
      }
    });
  }
}

// Xóa tất cả bộ lọc
function resetFilters() {
  inventoryState.keyword = '';
  inventoryState.warehouse = '';
  inventoryState.status = '';
  inventoryState.page = 1;

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  const filterWarehouse = document.getElementById('filter-warehouse');
  if (filterWarehouse) filterWarehouse.value = '';
  const filterStatus = document.getElementById('filter-status');
  if (filterStatus) filterStatus.value = '';

  renderInventoryTable();
}

// Hàm đổi cột sắp xếp
function handleSort(field) {
  if (inventoryState.sortField === field) {
    inventoryState.sortOrder = inventoryState.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    inventoryState.sortField = field;
    inventoryState.sortOrder = 'asc';
  }
  renderInventoryTable();
}

function updateSortIcons() {
  const headers = document.querySelectorAll('.vt-table th[data-sort]');
  headers.forEach(th => {
    const field = th.getAttribute('data-sort');
    const icon = th.querySelector('.vt-sort-icon');
    if (!icon) return;
    if (field === inventoryState.sortField) {
      icon.textContent = inventoryState.sortOrder === 'asc' ? '▲' : '▼';
      icon.className = 'vt-sort-icon active';
    } else {
      icon.textContent = '⇅';
      icon.className = 'vt-sort-icon';
    }
  });
}

// Tính trạng thái tồn kho chuẩn xác
function computeItemStatus(quantity, minThreshold) {
  const qty = Number(quantity) || 0;
  const min = Number(minThreshold) || 0;

  if (qty === 0) {
    return {
      code: 'OUT',
      label: 'Hết hàng',
      badgeClass: 'vt-badge-danger',
      colorHex: '#ef4444'
    };
  } else if (qty <= min) {
    return {
      code: 'LOW',
      label: 'Sắp hết',
      badgeClass: 'vt-badge-warning',
      colorHex: '#f59e0b'
    };
  } else {
    return {
      code: 'IN_STOCK',
      label: 'Còn hàng',
      badgeClass: 'vt-badge-success',
      colorHex: '#10b981'
    };
  }
}

function renderInventoryTable(highlightId = null) {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;

  updateSortIcons();

  const items = DB.getItems();
  const rawKeyword = inventoryState.keyword;
  const normalizedKeyword = removeVietnameseTones(rawKeyword);

  // 1. Lọc dữ liệu
  const filtered = items.filter(item => {
    const status = computeItemStatus(item.quantity, item.minThreshold);

    const matchWarehouse = !inventoryState.warehouse || item.warehouse === inventoryState.warehouse;
    const matchStatus = !inventoryState.status || status.code === inventoryState.status;

    if (!matchWarehouse || !matchStatus) return false;

    if (!normalizedKeyword) return true;

    const normName = removeVietnameseTones(item.name);
    const normId = (item.id || '').toLowerCase();
    const normBarcode = (item.barcode || '').toLowerCase();
    const normLocation = removeVietnameseTones(item.location || '');
    const normCategory = removeVietnameseTones(item.category || '');

    return normName.includes(normalizedKeyword) ||
           normId.includes(normalizedKeyword) ||
           normBarcode.includes(normalizedKeyword) ||
           normLocation.includes(normalizedKeyword) ||
           normCategory.includes(normalizedKeyword);
  });

  // 2. Sắp xếp dữ liệu
  const sortField = inventoryState.sortField;
  const sortOrder = inventoryState.sortOrder === 'asc' ? 1 : -1;

  filtered.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'quantity' || sortField === 'minThreshold' || sortField === 'priceExport' || sortField === 'priceImport') {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
      return (valA - valB) * sortOrder;
    }

    valA = (valA || '').toString().toLowerCase();
    valB = (valB || '').toString().toLowerCase();
    return valA.localeCompare(valB, 'vi') * sortOrder;
  });

  // 3. Phân trang
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / inventoryState.pageSize) || 1;
  if (inventoryState.page > totalPages) inventoryState.page = totalPages;
  if (inventoryState.page < 1) inventoryState.page = 1;

  const startIndex = (inventoryState.page - 1) * inventoryState.pageSize;
  const endIndex = Math.min(startIndex + inventoryState.pageSize, totalItems);
  const pagedItems = filtered.slice(startIndex, endIndex);

  // Cập nhật văn bản chỉ số
  const recordCountText = document.getElementById('record-count-text');
  if (recordCountText) {
    if (totalItems === 0) {
      recordCountText.textContent = `Hiển thị 0 trên tổng số ${items.length} vật tư`;
    } else {
      recordCountText.textContent = `Hiển thị ${startIndex + 1}-${endIndex} trên tổng số ${totalItems} vật tư (Tổng kho: ${items.length})`;
    }
  }

  // 4. Render trạng thái rỗng nếu không tìm thấy
  if (totalItems === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11" class="vt-empty-state">
          <div class="vt-empty-icon">📦</div>
          <div style="font-weight: 600; font-size: 15px; color: var(--vt-text-main); margin-bottom: 4px;">
            Không tìm thấy vật tư nào
          </div>
          <div style="font-size: 13px;">Thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Xóa bộ lọc".</div>
        </td>
      </tr>
    `;
    renderPagination(0, 1, 1);
    renderMobileCards([], highlightId);
    return;
  }

  // 5. Render dữ liệu bảng Desktop
  tbody.innerHTML = pagedItems.map(item => {
    const status = computeItemStatus(item.quantity, item.minThreshold);
    const isHighlighted = highlightId && (item.id === highlightId || item.barcode === highlightId);

    return `
      <tr class="${isHighlighted ? 'highlight-row' : ''}">
        <td class="vt-col-sku">
          <span class="vt-sku-code">${item.id}</span>
          <span class="vt-barcode-code" title="Mã vạch Barcode">${item.barcode || '---'}</span>
        </td>
        <td class="vt-col-name">${item.name}</td>
        <td class="vt-col-cat"><span class="vt-badge vt-badge-category">${item.category}</span></td>
        <td class="vt-col-wh">${item.warehouse}</td>
        <td class="vt-col-unit">${item.unit}</td>
        <td class="vt-col-qty vt-text-right">
          <strong style="color: ${status.colorHex}; font-size: 14.5px;">${numberFormatter.format(item.quantity)}</strong>
        </td>
        <td class="vt-col-min vt-text-right">${numberFormatter.format(item.minThreshold)}</td>
        <td class="vt-col-price vt-text-right">${currencyFormatter.format(item.priceExport)}</td>
        <td class="vt-col-loc"><code>${item.location || 'N/A'}</code></td>
        <td class="vt-col-status">
          <span class="vt-badge ${status.badgeClass}">${status.label}</span>
        </td>
        <td class="vt-col-actions vt-text-right">
          <div class="vt-action-btns">
            <button class="vt-btn-icon" onclick="openEditModal('${item.id}')" title="Sửa thông tin" aria-label="Sửa vật tư ${item.id}">
              ✏️
            </button>
            <button class="vt-btn-icon vt-btn-delete" onclick="confirmDeleteItem('${item.id}')" title="${item.quantity > 0 ? 'Không thể xóa khi còn tồn kho' : 'Xóa vật tư'}" aria-label="Xóa vật tư ${item.id}">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // 6. Render phân trang
  renderPagination(totalItems, inventoryState.page, totalPages);

  // 7. Render danh sách mobile
  renderMobileCards(pagedItems, highlightId);
}

function renderMobileCards(items, highlightId) {
  const mobileList = document.getElementById('inventory-mobile-list');
  if (!mobileList) return;

  if (items.length === 0) {
    mobileList.innerHTML = `
      <div class="vt-empty-state">
        <div class="vt-empty-icon">📦</div>
        <div>Không tìm thấy vật tư nào</div>
      </div>
    `;
    return;
  }

  mobileList.innerHTML = items.map(item => {
    const status = computeItemStatus(item.quantity, item.minThreshold);
    const isHighlighted = highlightId && (item.id === highlightId || item.barcode === highlightId);
    return `
      <div class="mobile-item-card ${isHighlighted ? 'highlight-row' : ''}">
        <div class="mobile-card-header">
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="mobile-sku-badge">${item.id}</span>
            <span class="vt-badge ${status.badgeClass}">${status.label}</span>
          </div>
          <span class="mobile-location-tag">📍 ${item.location || 'Kệ A'}</span>
        </div>
        <h4 class="mobile-item-title">${item.name}</h4>
        <div class="mobile-item-sub">${item.category} • ${item.warehouse}</div>
        <div class="mobile-item-meta-grid">
          <div>Tồn: <strong style="color: ${status.colorHex};">${numberFormatter.format(item.quantity)} ${item.unit}</strong></div>
          <div>Định mức: <strong>${numberFormatter.format(item.minThreshold)} ${item.unit}</strong></div>
          <div>Giá bán: <strong>${currencyFormatter.format(item.priceExport)}</strong></div>
          <div>Mã vạch: <strong>${item.barcode || 'N/A'}</strong></div>
        </div>
        <div class="mobile-item-actions">
          <button class="btn btn-outline btn-sm" onclick="openEditModal('${item.id}')" aria-label="Sửa ${item.id}">✏️ Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDeleteItem('${item.id}')" ${item.quantity > 0 ? 'disabled' : ''} aria-label="Xóa ${item.id}">🗑️ Xóa</button>
          <button class="btn btn-primary btn-sm" onclick="triggerScanItem('${item.barcode || item.id}')" aria-label="Quét ${item.id}">📷 Quét</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderPagination(totalItems, currentPage, totalPages) {
  const container = document.getElementById('vt-pagination-controls');
  if (!container) return;

  if (totalItems === 0 || totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <button class="vt-page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})" aria-label="Trang trước">
      &laquo; Trước
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    // Chỉ hiển thị trang lân cận nếu quá nhiều trang
    if (totalPages > 6 && Math.abs(i - currentPage) > 2 && i !== 1 && i !== totalPages) {
      if (i === 2 || i === totalPages - 1) {
        html += `<span style="padding: 0 4px; color: var(--vt-text-muted);">...</span>`;
      }
      continue;
    }
    html += `
      <button class="vt-page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})" aria-label="Trang ${i}">
        ${i}
      </button>
    `;
  }

  html += `
    <button class="vt-page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})" aria-label="Trang sau">
      Sau &raquo;
    </button>
  `;

  container.innerHTML = html;
}

function changePage(page) {
  inventoryState.page = page;
  renderInventoryTable();
}

// 7. FORM THÊM / SỬA VÀ VALIDATION
function clearFormErrors() {
  const groups = document.querySelectorAll('.form-group');
  groups.forEach(g => {
    g.classList.remove('vt-has-error');
    const msg = g.querySelector('.vt-error-msg');
    if (msg) msg.textContent = '';
  });
}

function setFieldError(fieldId, errorMsg) {
  const input = document.getElementById(fieldId);
  if (!input) return;
  const group = input.closest('.form-group');
  if (group) {
    group.classList.add('vt-has-error');
    let msg = group.querySelector('.vt-error-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'vt-error-msg';
      group.appendChild(msg);
    }
    msg.textContent = errorMsg;
  }
}

function openAddModal() {
  clearFormErrors();
  document.getElementById('modal-title').textContent = 'Thêm Vật Tư Mới';
  document.getElementById('item-form').reset();
  document.getElementById('form-item-id').value = '';
  const skuInput = document.getElementById('form-sku');
  skuInput.disabled = false;
  skuInput.placeholder = 'Nhập mã SKU (VD: VT099)';
  document.getElementById('item-modal').classList.add('active');
  document.getElementById('form-sku').focus();
}

function openEditModal(id) {
  clearFormErrors();
  const item = DB.getItemById(id);
  if (!item) return;

  document.getElementById('modal-title').textContent = 'Cập Nhật Vật Tư: ' + item.id;
  document.getElementById('form-item-id').value = item.id;
  const skuInput = document.getElementById('form-sku');
  skuInput.value = item.id;
  skuInput.disabled = true;

  document.getElementById('form-barcode').value = item.barcode || '';
  document.getElementById('form-name').value = item.name;
  document.getElementById('form-category').value = item.category;
  document.getElementById('form-warehouse').value = item.warehouse;
  document.getElementById('form-unit').value = item.unit;
  document.getElementById('form-quantity').value = item.quantity;
  document.getElementById('form-min').value = item.minThreshold;
  document.getElementById('form-price-import').value = item.priceImport;
  document.getElementById('form-price-export').value = item.priceExport;
  document.getElementById('form-location').value = item.location || '';

  document.getElementById('item-modal').classList.add('active');
  document.getElementById('form-name').focus();
}

function closeModal() {
  clearFormErrors();
  document.getElementById('item-modal').classList.remove('active');
}

function handleSaveItem(e) {
  e.preventDefault();
  clearFormErrors();

  const id = document.getElementById('form-item-id').value.trim();
  const sku = document.getElementById('form-sku').value.trim().toUpperCase();
  const barcode = document.getElementById('form-barcode').value.trim();
  const name = document.getElementById('form-name').value.trim();
  const category = document.getElementById('form-category').value;
  const warehouse = document.getElementById('form-warehouse').value;
  const unit = document.getElementById('form-unit').value.trim();
  const quantity = parseInt(document.getElementById('form-quantity').value, 10);
  const minThreshold = parseInt(document.getElementById('form-min').value, 10);
  const priceImport = parseInt(document.getElementById('form-price-import').value, 10);
  const priceExport = parseInt(document.getElementById('form-price-export').value, 10);
  const location = document.getElementById('form-location').value.trim();

  let hasError = false;

  // Validate SKU
  if (!id) {
    if (!sku) {
      setFieldError('form-sku', 'Vui lòng nhập mã SKU cho vật tư.');
      hasError = true;
    } else {
      const exists = DB.getItems().some(i => i.id.toUpperCase() === sku);
      if (exists) {
        setFieldError('form-sku', `Mã SKU "${sku}" đã tồn tại trong hệ thống.`);
        hasError = true;
      }
    }
  }

  // Validate Tên
  if (!name) {
    setFieldError('form-name', 'Tên vật tư không được để trống.');
    hasError = true;
  }

  // Validate Barcode
  if (!barcode) {
    setFieldError('form-barcode', 'Mã vạch Barcode không được để trống.');
    hasError = true;
  }

  // Validate Danh mục & Kho
  if (!category) {
    setFieldError('form-category', 'Vui lòng chọn danh mục vật tư.');
    hasError = true;
  }
  if (!warehouse) {
    setFieldError('form-warehouse', 'Vui lòng chọn kho lưu trữ.');
    hasError = true;
  }

  // Validate Đơn vị
  if (!unit) {
    setFieldError('form-unit', 'Vui lòng nhập đơn vị tính.');
    hasError = true;
  }

  // Validate Số lượng & Định mức
  if (isNaN(quantity) || quantity < 0) {
    setFieldError('form-quantity', 'Số lượng tồn phải là số nguyên lớn hơn hoặc bằng 0.');
    hasError = true;
  }
  if (isNaN(minThreshold) || minThreshold < 0) {
    setFieldError('form-min', 'Định mức tối thiểu phải là số nguyên lớn hơn hoặc bằng 0.');
    hasError = true;
  }

  // Validate Giá
  if (isNaN(priceImport) || priceImport < 0) {
    setFieldError('form-price-import', 'Giá nhập phải lớn hơn hoặc bằng 0.');
    hasError = true;
  }
  if (isNaN(priceExport) || priceExport < 0) {
    setFieldError('form-price-export', 'Giá xuất phải lớn hơn hoặc bằng 0.');
    hasError = true;
  }

  if (hasError) return;

  const itemData = {
    id: id || sku,
    barcode,
    name,
    category,
    warehouse,
    unit,
    quantity,
    minThreshold,
    priceImport,
    priceExport,
    location
  };

  const isNew = !id;
  const saved = DB.saveItem(itemData);

  if (isNew && quantity > 0) {
    DB.addLog({
      type: 'IMPORT',
      itemId: saved.id,
      itemName: saved.name,
      changeQty: quantity,
      balanceAfter: quantity,
      price: priceImport,
      partnerName: 'Tồn đầu kỳ / Nhập ban đầu',
      reason: 'Khởi tạo danh mục vật tư mới',
      operator: 'Nguyễn Hoàng Anh'
    });
  }

  DB.showToast(id ? 'Cập nhật thông tin vật tư thành công!' : 'Thêm vật tư mới thành công!', 'success');
  closeModal();
  renderInventoryTable(saved.id);
}

// 5. XÓA AN TOÀN
function confirmDeleteItem(id) {
  const item = DB.getItemById(id);
  if (!item) return;

  if (item.quantity > 0) {
    alert(`CẢNH BÁO AN TOÀN KHO:\n\nMặt hàng "${item.name}" (${item.id}) hiện vẫn còn tồn kho: ${numberFormatter.format(item.quantity)} ${item.unit}.\n\nTheo quy định an toàn kho, bạn KHÔNG ĐƯỢC PHÉP xóa mặt hàng khi còn tồn kho! Vui lòng thực hiện xuất kho hết về 0 trước khi xóa.`);
    return;
  }

  // Hộp thoại xác nhận bắt buộc đúng định dạng
  const isConfirmed = confirm(`Bạn có chắc muốn xóa vật tư ${item.id} ("${item.name}") không?\nThao tác này sẽ xóa vĩnh viễn khỏi danh mục.`);
  if (isConfirmed) {
    const res = DB.deleteItem(id);
    if (res.success) {
      DB.showToast(res.message, 'success');
      renderInventoryTable();
    } else {
      DB.showToast(res.message, 'error');
    }
  }
}
