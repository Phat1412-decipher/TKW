/**
 * ==============================================================================
 * PHỤ TRÁCH: MEMBER 2 (TRẦN QUANG HUY) - TRANG CHỦ & CẢNH BÁO TỒN KHO (index.js)
 * Nhiệm vụ:
 *  1. 4 Thẻ KPI thời gian thực (Tổng mặt hàng, Tổng tài sản kho, Hết hàng, Sắp hết)
 *  2. Sơ đồ mặt bằng kệ kho thông minh (IoT Rack Heatmap 12 ô định vị + Lọc trạng thái)
 *  3. Danh sách vật tư nguy cấp dưới định mức (Desktop Table & Mobile App Card)
 *  4. Điều hướng 1 chạm "➕ Nhập hàng ngay" qua sessionStorage('QUICK_RESTOCK_ITEM_ID')
 *  5. Biểu đồ tròn Donut Canvas HiDPI có hoạt họa mượt, tooltip tương tác & thanh tỷ lệ
 * ==============================================================================
 */

// Trạng thái bộ lọc cục bộ trên Dashboard
let currentHeatmapFilter = 'ALL'; // 'ALL' | 'IN_STOCK' | 'LOW' | 'OUT'
let currentUrgentFilter = 'ALL';  // 'ALL' | 'OUT' | 'LOW'
let cachedAllItems = [];
let cachedUrgentItems = [];

// Biến lưu trạng thái hoạt họa & tương tác Donut Chart
let donutAnimId = null;
let currentDonutHover = -1;
let drawDonutInstant = null;

// Icon dấu cộng SVG sắc nét, tương phản cao trên nền nút xanh #2563EB
const PLUS_ICON_SVG = `<svg class="btn-plus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo Layout chung (Sidebar, Header, IoT Barcode Scanner, Mobile Bottom Nav)
  if (typeof initLayout === 'function') {
    initLayout('index');
  }

  // 2. Thiết lập hàm quickRestock chuẩn Data Contract & chống lỗi 404 khi test độc lập
  setupQuickRestockHandler();

  // 3. Gắn tương tác hai chiều cho các thẻ Legend của Donut Chart
  setupDonutLegendInteractions();

  // 4. Tải và render toàn bộ dữ liệu Dashboard
  loadDashboardData();

  // 5. Đăng ký nhận thông báo Realtime từ hệ thống LocalStorage Event Bus
  if (window.DB && typeof window.DB.onUpdate === 'function') {
    window.DB.onUpdate(() => {
      loadDashboardData();
    });
  }
});

/**
 * Thiết lập điều hướng nhập hàng nhanh:
 * - Lưu QUICK_RESTOCK_ITEM_ID vào sessionStorage theo đúng Data Contract
 * - Nếu operations.html (của Member 1) đã có trong thư mục -> điều hướng mượt sang operations.html
 * - Nếu đang chạy môi trường độc lập chỉ có code của Member 2 -> hiển thị Toast xác nhận & mở Trạm IoT của vật tư đó để không bị lỗi 404
 */
function setupQuickRestockHandler() {
  window.quickRestock = async function (itemId) {
    sessionStorage.setItem('QUICK_RESTOCK_ITEM_ID', itemId);

    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      try {
        const resp = await fetch('operations.html', { method: 'HEAD' });
        if (resp.ok) {
          if (typeof window.smoothNavigate === 'function') {
            window.smoothNavigate('operations.html');
          } else {
            window.location.href = 'operations.html';
          }
          return;
        }
      } catch (e) {
        // Fallback bên dưới nếu không kết nối được
      }

      const item = window.DB && typeof DB.getItemById === 'function' ? DB.getItemById(itemId) : null;
      const itemLabel = item ? `${item.name} (${item.id})` : itemId;
      if (window.DB && typeof DB.showToast === 'function') {
        DB.showToast(`Đã chọn nhập nhanh: ${itemLabel}. Đã lưu QUICK_RESTOCK_ITEM_ID vào sessionStorage!`, 'success');
      }
      return;
    }

    if (typeof window.smoothNavigate === 'function') {
      window.smoothNavigate('operations.html');
    } else {
      window.location.href = 'operations.html';
    }
  };
}

/**
 * Tải dữ liệu từ window.DB và tính toán các chỉ số KPI, bảng cảnh báo, biểu đồ Donut & Heatmap
 */
function loadDashboardData() {
  if (!window.DB || typeof DB.getItems !== 'function') return;

  const items = DB.getItems();
  cachedAllItems = items;

  const totalItems = items.length;
  let totalValue = 0;
  let outOfStockCount = 0;
  let lowStockCount = 0;
  let inStockCount = 0;
  let warehouseACount = 0;
  let warehouseBCount = 0;

  const urgentItems = [];

  items.forEach((item) => {
    const qty = Number(item.quantity) || 0;
    const min = Number(item.minThreshold) || 0;
    const priceImp = Number(item.priceImport) || 0;

    totalValue += qty * priceImp;

    if (item.warehouse && item.warehouse.includes('Kho A')) {
      warehouseACount++;
    } else if (item.warehouse && item.warehouse.includes('Kho B')) {
      warehouseBCount++;
    }

    const status = DB.getItemStatus(qty, min);

    if (status.code === 'OUT') {
      outOfStockCount++;
      urgentItems.push({ ...item, status, ratio: 0, deficit: Math.max(1, min) });
    } else if (status.code === 'LOW') {
      lowStockCount++;
      const ratio = min > 0 ? qty / min : 0;
      urgentItems.push({ ...item, status, ratio, deficit: Math.max(1, min - qty + 5) });
    } else {
      inStockCount++;
    }
  });

  // Sắp xếp danh sách nguy cấp: Hết hàng (OUT) lên đầu, sau đó đến tỷ lệ tồn/định mức thấp nhất
  urgentItems.sort((a, b) => {
    if (a.status.code !== b.status.code) {
      return a.status.code === 'OUT' ? -1 : 1;
    }
    return a.ratio - b.ratio;
  });

  cachedUrgentItems = urgentItems;

  // 1. Render 4 Thẻ KPI Thời Gian Thực
  setText('kpi-total-items', totalItems);
  setText('kpi-total-value', DB.formatCurrency(totalValue));
  setText('kpi-out-stock', outOfStockCount);
  setText('kpi-low-stock', lowStockCount);

  setText('kpi-total-items-meta', `${warehouseACount} mục Kho A • ${warehouseBCount} mục Kho B`);
  setText('kpi-out-stock-meta', outOfStockCount > 0 ? `${outOfStockCount} kệ trống • Cần nhập khẩn` : 'Không có mặt hàng đứt gãy');
  setText('kpi-low-stock-meta', lowStockCount > 0 ? `${lowStockCount} mặt hàng dưới định mức` : 'Định mức an toàn ổn định');

  // 2. Cập nhật số lượng trên bộ lọc Heatmap
  setText('rack-count-all', totalItems);
  setText('rack-count-safe', inStockCount);
  setText('rack-count-low', lowStockCount);
  setText('rack-count-out', outOfStockCount);

  // 3. Cập nhật Legend Donut Chart
  setText('legend-in-stock', inStockCount);
  setText('legend-low-stock', lowStockCount);
  setText('legend-out-stock', outOfStockCount);

  // 4. Cập nhật huy hiệu tổng số mặt hàng nguy cấp
  setText('warning-count-badge', `${urgentItems.length} mặt hàng nguy cấp`);

  // 5. Render Bảng Cảnh Báo Nguy Cấp (Desktop & Mobile)
  renderUrgentTable(urgentItems);

  // 6. Vẽ Biểu đồ Donut Canvas HiDPI kèm Tooltip tương tác
  renderDonutChart(inStockCount, lowStockCount, outOfStockCount);

  // 7. Render Sơ Đồ Kệ Hàng Thời Gian Thực (IoT Rack Heatmap)
  renderRackHeatmap(items);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/**
 * Lọc danh sách cảnh báo nguy cấp theo mức độ: 'ALL' | 'OUT' | 'LOW'
 */
function filterUrgentList(filterCode) {
  currentUrgentFilter = filterCode;

  document.querySelectorAll('[data-urgent-filter]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-urgent-filter') === filterCode);
  });

  renderUrgentTable(cachedUrgentItems);
}
window.filterUrgentList = filterUrgentList;

/**
 * Render Bảng Cảnh Báo Nguy Cấp (Desktop Table) & Danh Sách Thẻ (Mobile App Cards)
 */
function renderUrgentTable(urgentItems) {
  const tbody = document.getElementById('urgent-table-body');
  const mobileList = document.getElementById('urgent-mobile-list');

  const filtered = currentUrgentFilter === 'ALL'
    ? urgentItems
    : urgentItems.filter((item) => item.status.code === currentUrgentFilter);

  // 1. Render Bảng Desktop
  if (tbody) {
    if (filtered.length === 0) {
      const emptyMsg = urgentItems.length === 0
        ? 'Tuyệt vời! Toàn bộ vật tư trong kho đều đạt trên định mức an toàn.'
        : 'Không có mặt hàng nào trong nhóm lọc cảnh báo này.';
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 28px 16px; color: var(--success); font-weight: 600;">
            ✔ ${emptyMsg}
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = filtered.map((item) => {
        const isOut = item.status.code === 'OUT';
        const deficitNeeded = Math.max(1, Number(item.minThreshold) - Number(item.quantity));
        const deficitLabel = isOut
          ? `Cần bù ≥ ${item.minThreshold}`
          : `Thiếu ${deficitNeeded} ${item.unit}`;
        const shortWarehouse = item.warehouse ? item.warehouse.split(' - ')[0] : 'Kho A';

        return `
          <tr class="${isOut ? 'row-out-of-stock' : ''}">
            <td><span class="sku-code-pill">${escapeHtml(item.id)}</span></td>
            <td>
              <div><strong>${escapeHtml(item.name)}</strong></div>
              <small style="color: var(--text-muted);">${escapeHtml(item.category)} • ${escapeHtml(shortWarehouse)}</small>
            </td>
            <td>
              <button type="button" class="rack-locate-btn" onclick="focusRackCell('${escapeHtml(item.id)}')" title="Định vị ${escapeHtml(item.location || 'N/A')} trên sơ đồ Heatmap">
                ${escapeHtml(item.location || 'N/A')}
              </button>
            </td>
            <td>
              <strong class="tabular-nums" style="color: ${item.status.colorHex}; font-size: 13.5px;">${item.quantity}</strong>
              <span class="deficit-subtext">${escapeHtml(item.unit)}</span>
            </td>
            <td class="tabular-nums" style="white-space: nowrap;">
              <strong>${item.minThreshold}</strong>
              <span class="deficit-subtext">${escapeHtml(item.unit)}</span>
            </td>
            <td>
              <span class="badge ${item.status.badgeClass}">
                ${item.status.label}
              </span>
            </td>
            <td class="text-right">
              <button type="button" class="btn btn-primary btn-sm restock-action-btn" onclick="quickRestock('${escapeHtml(item.id)}')">
                ${PLUS_ICON_SVG}
                <span>Nhập hàng ngay</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // 2. Render Danh Sách Thẻ Tối Ưu Cho Smartphone (Tránh tràn bảng, dễ thao tác cảm ứng)
  if (mobileList) {
    if (filtered.length === 0) {
      mobileList.innerHTML = `
        <div style="text-align:center; padding: 22px; background:#f0fdf4; border-radius:10px; border:1px solid #bbf7d0; color:#15803d; font-size:13.5px; font-weight:600;">
          ✔ Tất cả vật tư trong bộ lọc đều ở mức an toàn.
        </div>
      `;
    } else {
      mobileList.innerHTML = filtered.map((item) => {
        const isOut = item.status.code === 'OUT';
        return `
          <div class="mobile-item-card urgent-mobile-card ${isOut ? 'card-status-out' : ''}">
            <div class="mobile-card-header">
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="mobile-sku-badge">${escapeHtml(item.id)}</span>
                <span class="badge ${item.status.badgeClass}">${item.status.label}</span>
              </div>
              <button type="button" class="rack-locate-btn" onclick="focusRackCell('${escapeHtml(item.id)}')" title="Định vị kệ trên sơ đồ Heatmap">
                ${escapeHtml(item.location || 'Kệ N/A')}
              </button>
            </div>

            <h4 class="mobile-item-title">${escapeHtml(item.name)}</h4>
            <div class="mobile-item-sub">${escapeHtml(item.category)} • ${escapeHtml(item.warehouse)}</div>

            <div class="mobile-item-meta-grid">
              <div>Tồn kho: <strong class="tabular-nums" style="color: ${item.status.colorHex}; font-size:14.5px;">${item.quantity} ${escapeHtml(item.unit)}</strong></div>
              <div>Định mức: <strong class="tabular-nums">${item.minThreshold} ${escapeHtml(item.unit)}</strong></div>
            </div>

            <button type="button" class="btn btn-primary restock-action-btn" style="width:100%;" onclick="quickRestock('${escapeHtml(item.id)}')">
              ${PLUS_ICON_SVG}
              <span>Nhập hàng ngay</span>
            </button>
          </div>
        `;
      }).join('');
    }
  }
}

/**
 * Lọc Sơ đồ mặt bằng kệ kho Heatmap theo trạng thái: 'ALL' | 'IN_STOCK' | 'LOW' | 'OUT'
 */
function filterHeatmapByStatus(statusCode) {
  currentHeatmapFilter = statusCode;

  document.querySelectorAll('[data-rack-filter]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-rack-filter') === statusCode);
  });

  document.querySelectorAll('.kpi-card[data-filter-target]').forEach((card) => {
    const target = card.getAttribute('data-filter-target');
    card.classList.toggle('kpi-filter-active', target === statusCode && statusCode !== 'ALL');
  });

  renderRackHeatmap(cachedAllItems);
}
window.filterHeatmapByStatus = filterHeatmapByStatus;

/**
 * Cuộn tới và làm nổi bật ô kệ tương ứng trên Sơ đồ Heatmap khi bấm từ Bảng cảnh báo
 */
function focusRackCell(itemId) {
  if (currentHeatmapFilter !== 'ALL') {
    filterHeatmapByStatus('ALL');
  }

  const rackEl = document.querySelector(`.rack-cell[data-rack-id="${itemId}"]`);
  if (!rackEl) return;

  rackEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  rackEl.classList.add('rack-highlighted');
  rackEl.focus({ preventScroll: true });

  setTimeout(() => {
    rackEl.classList.remove('rack-highlighted');
  }, 1800);
}
window.focusRackCell = focusRackCell;

/**
 * Render Sơ Đồ Mặt Bằng Kệ Kho Thông Minh (IoT Rack Heatmap - 12 Ô Định Vị)
 */
function renderRackHeatmap(items) {
  const container = document.getElementById('rack-heatmap-grid');
  if (!container) return;

  const filteredItems = currentHeatmapFilter === 'ALL'
    ? items
    : items.filter((item) => {
        const st = DB.getItemStatus(item.quantity, item.minThreshold);
        return st.code === currentHeatmapFilter;
      });

  if (filteredItems.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 24px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; color: #64748b; font-size: 13px; font-weight: 500;">
        Không có vị trí kệ nào thuộc trạng thái đang lọc.
        <button type="button" class="btn btn-outline btn-sm" style="margin-left: 10px;" onclick="filterHeatmapByStatus('ALL')">Xem tất cả 12 kệ</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredItems.map((item) => {
    const qty = Number(item.quantity) || 0;
    const min = Number(item.minThreshold) || 1;
    const status = DB.getItemStatus(qty, min);

    let statusClass = 'status-safe';
    let meterClass = 'safe';
    if (status.code === 'OUT') {
      statusClass = 'status-out';
      meterClass = 'out';
    } else if (status.code === 'LOW') {
      statusClass = 'status-low';
      meterClass = 'low';
    }

    // Tính % thanh dung lượng kệ so với ngưỡng an toàn chuẩn (2 * minThreshold)
    const capacityRatio = qty === 0 ? 0 : Math.min(100, Math.max(12, Math.round((qty / (min * 2)) * 100)));
    const shortWarehouse = item.warehouse ? item.warehouse.split(' - ')[0] : 'Kho A';

    return `
      <button
        type="button"
        role="listitem"
        class="rack-cell ${statusClass}"
        data-rack-id="${escapeHtml(item.id)}"
        onclick="quickRestock('${escapeHtml(item.id)}')"
        title="Kệ: ${escapeHtml(item.location || 'N/A')} — ${escapeHtml(item.name)} (Tồn: ${qty} / Định mức: ${min} ${escapeHtml(item.unit)}). Nhấn để nhập hàng nhanh"
      >
        <div class="rack-header-row">
          <span class="rack-code">${escapeHtml(item.location || 'Kệ N/A')}</span>
          <span class="badge ${status.badgeClass} rack-badge">${status.label}</span>
        </div>

        <div class="rack-item-name">${escapeHtml(item.name)}</div>
        <div class="rack-sku-meta">${escapeHtml(item.id)} • ${escapeHtml(shortWarehouse)}</div>

        <div class="rack-capacity-track" aria-hidden="true">
          <div class="rack-capacity-fill ${meterClass}" style="width: ${capacityRatio}%;"></div>
        </div>

        <div class="rack-qty-row">
          <span class="rack-qty-val">
            Tồn: <strong style="color:${status.colorHex};">${qty}</strong><small style="color:#64748b; font-weight:500;">/${min}</small>
          </span>
          <span class="rack-unit-tag">${escapeHtml(item.unit)}</span>
          <span class="rack-quick-cta">+ Nhập nhanh</span>
        </div>
      </button>
    `;
  }).join('');
}

/**
 * Vẽ Biểu đồ Donut bằng HTML5 Canvas HiDPI với Hoạt Họa Quay Mượt, Tooltip Tương Tác & Thanh Tỷ Lệ
 */
function renderDonutChart(inStock, lowStock, outStock) {
  const canvas = document.getElementById('donutChart');
  const tooltip = document.getElementById('donut-tooltip');
  if (!canvas) return;

  const total = inStock + lowStock + outStock;

  // Tính tỷ lệ phần trăm chính xác
  const pctIn = total > 0 ? Math.round((inStock / total) * 100) : 0;
  const pctLow = total > 0 ? Math.round((lowStock / total) * 100) : 0;
  const pctOut = total > 0 ? Math.max(0, 100 - pctIn - pctLow) : 0;

  // Cập nhật nhãn phần trăm và thanh tỷ lệ an toàn kho
  setText('pct-in-stock', `(${pctIn}%)`);
  setText('pct-low-stock', `(${pctLow}%)`);
  setText('pct-out-stock', `(${pctOut}%)`);
  setText('health-score-label', `${pctIn}% an toàn`);

  const barIn = document.getElementById('bar-in-stock');
  const barLow = document.getElementById('bar-low-stock');
  const barOut = document.getElementById('bar-out-stock');
  if (barIn) barIn.style.width = `${pctIn}%`;
  if (barLow) barLow.style.width = `${pctLow}%`;
  if (barOut) barOut.style.width = `${pctOut}%`;

  // Thiết lập Canvas HiDPI sắc nét trên màn hình Retina & Smartphone
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = 210;
  const displayHeight = 210;
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const slices = [
    {
      label: 'Còn hàng',
      subLabel: 'Đạt định mức an toàn',
      filterCode: 'IN_STOCK',
      value: inStock,
      color: '#10b981',
      hoverColor: '#059669',
      pct: pctIn
    },
    {
      label: 'Sắp hết',
      subLabel: 'Chạm ngưỡng cảnh báo',
      filterCode: 'LOW',
      value: lowStock,
      color: '#f59e0b',
      hoverColor: '#d97706',
      pct: pctLow
    },
    {
      label: 'Hết hàng',
      subLabel: 'Cần nhập bổ sung ngay',
      filterCode: 'OUT',
      value: outStock,
      color: '#ef4444',
      hoverColor: '#dc2626',
      pct: pctOut
    }
  ];

  const centerX = displayWidth / 2;
  const centerY = displayHeight / 2;
  const outerRadius = 84;
  const innerRadius = 56;

  if (donutAnimId) cancelAnimationFrame(donutAnimId);

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startTime = performance.now();
  const animDuration = prefersReducedMotion ? 1 : 620;

  function drawFrame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / animDuration);
    const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    if (total === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerRadius, Math.PI * 2, 0, true);
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      return;
    }

    let startAngle = -Math.PI / 2;
    const activeSlicesCount = slices.filter((s) => s.value > 0).length;
    const gapAngle = activeSlicesCount > 1 ? 0.045 : 0;

    slices.forEach((slice, idx) => {
      if (slice.value === 0) {
        slice.startAngle = startAngle;
        slice.endAngle = startAngle;
        return;
      }

      const sliceAngle = (slice.value / total) * 2 * Math.PI * ease;
      const drawSliceAngle = Math.max(0.01, sliceAngle - gapAngle);

      const isHovered = currentDonutHover === idx;
      const currentOuter = isHovered ? outerRadius + 5 : outerRadius;
      const currentInner = isHovered ? innerRadius - 3 : innerRadius;

      const arcStart = startAngle + gapAngle / 2;
      const arcEnd = arcStart + drawSliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, currentOuter, arcStart, arcEnd);
      ctx.arc(centerX, centerY, currentInner, arcEnd, arcStart, true);
      ctx.closePath();

      ctx.fillStyle = isHovered ? slice.hoverColor : slice.color;
      ctx.shadowColor = isHovered ? slice.color : 'transparent';
      ctx.shadowBlur = isHovered ? 12 : 0;
      ctx.fill();
      ctx.shadowBlur = 0;

      slice.startAngle = startAngle;
      slice.endAngle = startAngle + (slice.value / total) * 2 * Math.PI;
      startAngle += sliceAngle;
    });

    // Vẽ Vòng Tròn Tâm
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Hiển thị thông tin động ở tâm biểu đồ Donut
    const hoveredSlice = currentDonutHover >= 0 ? slices[currentDonutHover] : null;
    if (hoveredSlice && hoveredSlice.value > 0) {
      ctx.fillStyle = hoveredSlice.color;
      ctx.font = '700 22px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${hoveredSlice.pct}%`, centerX, centerY - 9);

      ctx.font = '700 11.5px "Plus Jakarta Sans", -apple-system, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(hoveredSlice.label, centerX, centerY + 9);

      ctx.font = '500 10px "Plus Jakarta Sans", -apple-system, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`${hoveredSlice.value} mặt hàng`, centerX, centerY + 23);
    } else {
      const currentCount = Math.round(total * ease);
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 24px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(currentCount), centerX, centerY - 6);

      ctx.font = '600 11.5px "Plus Jakarta Sans", -apple-system, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Mặt hàng', centerX, centerY + 14);
    }

    if (progress < 1) {
      donutAnimId = requestAnimationFrame(drawFrame);
    }
  }

  // Cho phép vẽ lại tức thì khi hover từ Legend hoặc chuột
  drawDonutInstant = function (hoverIndex) {
    currentDonutHover = hoverIndex;
    syncDonutLegendActive(hoverIndex);
    updateDonutTooltip(hoverIndex, slices, tooltip);
    requestAnimationFrame((now) => drawFrame(now + animDuration));
  };

  donutAnimId = requestAnimationFrame(drawFrame);

  // Xử lý tương tác Hover & Touch Tooltip trực tiếp trên Canvas
  function getSliceAtPointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const dx = x - centerX;
    const dy = y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= innerRadius - 4 && dist <= outerRadius + 8 && total > 0) {
      let angle = Math.atan2(dy, dx);
      if (angle < -Math.PI / 2) angle += 2 * Math.PI;

      for (let i = 0; i < slices.length; i++) {
        const s = slices[i];
        if (s.value > 0 && angle >= s.startAngle && angle <= s.endAngle) {
          return i;
        }
      }
    }
    return -1;
  }

  canvas.onmousemove = (e) => {
    const found = getSliceAtPointer(e.clientX, e.clientY);
    if (found !== currentDonutHover) {
      drawDonutInstant(found);
    }
  };

  canvas.onmouseleave = () => {
    if (currentDonutHover !== -1) {
      drawDonutInstant(-1);
    }
  };

  canvas.onclick = (e) => {
    const found = getSliceAtPointer(e.clientX, e.clientY);
    if (found >= 0 && slices[found]) {
      filterHeatmapByStatus(slices[found].filterCode);
    }
  };

  canvas.ontouchstart = (e) => {
    if (e.touches && e.touches[0]) {
      const found = getSliceAtPointer(e.touches[0].clientX, e.touches[0].clientY);
      if (found !== currentDonutHover) {
        drawDonutInstant(found);
      }
    }
  };
}

/**
 * Hiển thị / ẩn Tooltip tương tác neo gọn phía dưới biểu đồ Donut (không che tâm, không tràn viền)
 */
function updateDonutTooltip(hoverIndex, slices, tooltipEl) {
  if (!tooltipEl) return;

  if (hoverIndex < 0 || !slices[hoverIndex] || slices[hoverIndex].value === 0) {
    tooltipEl.hidden = true;
    return;
  }

  const slice = slices[hoverIndex];
  tooltipEl.innerHTML = `
    <span class="donut-tooltip-head">
      <span class="donut-tooltip-dot" style="background:${slice.color};"></span>
      <span>${slice.label}: ${slice.value} mục (${slice.pct}%)</span>
    </span>
  `;
  tooltipEl.hidden = false;
}

/**
 * Đồng bộ trạng thái highlight giữa Legend Pills và các lát cắt Donut Canvas
 */
function setupDonutLegendInteractions() {
  const pills = document.querySelectorAll('.donut-pill[data-slice-index]');
  const filterCodes = ['IN_STOCK', 'LOW', 'OUT'];

  pills.forEach((pill) => {
    const idx = Number(pill.getAttribute('data-slice-index'));

    pill.addEventListener('mouseenter', () => {
      if (typeof drawDonutInstant === 'function') drawDonutInstant(idx);
    });

    pill.addEventListener('mouseleave', () => {
      if (typeof drawDonutInstant === 'function') drawDonutInstant(-1);
    });

    pill.addEventListener('focus', () => {
      if (typeof drawDonutInstant === 'function') drawDonutInstant(idx);
    });

    pill.addEventListener('blur', () => {
      if (typeof drawDonutInstant === 'function') drawDonutInstant(-1);
    });

    pill.addEventListener('click', () => {
      if (filterCodes[idx]) {
        filterHeatmapByStatus(filterCodes[idx]);
      }
    });

    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (filterCodes[idx]) {
          filterHeatmapByStatus(filterCodes[idx]);
        }
      }
    });
  });
}

function syncDonutLegendActive(activeIndex) {
  document.querySelectorAll('.donut-pill[data-slice-index]').forEach((pill) => {
    const idx = Number(pill.getAttribute('data-slice-index'));
    pill.classList.toggle('is-active', idx === activeIndex);
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
