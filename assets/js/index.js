/**
 * ==============================================================================
 * PHỤ TRÁCH: MEMBER 2 - TRANG CHỦ & CẢNH BÁO TỒN KHO (index.js)
 * Tinh chỉnh Senior Frontend: Đồng bộ format tiền tệ Intl.NumberFormat,
 * Bảng cảnh báo sticky header, line-clamp tên vật tư, tính toán trạng thái chuẩn.
 * ==============================================================================
 */

// Định dạng tiền tệ VND chuẩn
const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
});

// Định dạng số chuẩn
const qtyFormatter = new Intl.NumberFormat('vi-VN');

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo Layout chung
  if (typeof initLayout === 'function') {
    initLayout('index');
  }

  // 2. Tải và render dữ liệu
  loadDashboardData();

  // 3. Đăng ký nhận thông báo Realtime từ hệ thống
  if (window.DB && typeof window.DB.onUpdate === 'function') {
    window.DB.onUpdate(() => {
      loadDashboardData();
    });
  }
});

function loadDashboardData() {
  const items = DB.getItems();

  let totalItems = items.length;
  let totalValue = 0;
  let outOfStockCount = 0;
  let lowStockCount = 0;
  let inStockCount = 0;

  const urgentItems = [];

  items.forEach(item => {
    const qty = Number(item.quantity) || 0;
    const min = Number(item.minThreshold) || 0;
    totalValue += qty * Number(item.priceImport || 0);

    const status = DB.getItemStatus(qty, min);

    if (status.code === 'OUT') {
      outOfStockCount++;
      urgentItems.push({ ...item, status, qty, min });
    } else if (status.code === 'LOW') {
      lowStockCount++;
      urgentItems.push({ ...item, status, qty, min });
    } else {
      inStockCount++;
    }
  });

  // Render KPIs
  const elTotalItems = document.getElementById('kpi-total-items');
  const elTotalValue = document.getElementById('kpi-total-value');
  const elOutStock = document.getElementById('kpi-out-stock');
  const elLowStock = document.getElementById('kpi-low-stock');

  if (elTotalItems) elTotalItems.textContent = qtyFormatter.format(totalItems);
  if (elTotalValue) elTotalValue.textContent = vndFormatter.format(totalValue);
  if (elOutStock) elOutStock.textContent = qtyFormatter.format(outOfStockCount);
  if (elLowStock) elLowStock.textContent = qtyFormatter.format(lowStockCount);

  const elLegendIn = document.getElementById('legend-in-stock');
  const elLegendLow = document.getElementById('legend-low-stock');
  const elLegendOut = document.getElementById('legend-out-stock');
  if (elLegendIn) elLegendIn.textContent = qtyFormatter.format(inStockCount);
  if (elLegendLow) elLegendLow.textContent = qtyFormatter.format(lowStockCount);
  if (elLegendOut) elLegendOut.textContent = qtyFormatter.format(outOfStockCount);

  const elWarningBadge = document.getElementById('warning-count-badge');
  if (elWarningBadge) {
    elWarningBadge.textContent = `${urgentItems.length} mặt hàng nguy cấp`;
  }

  // Render Bảng Cảnh Báo Nguy Cấp
  renderUrgentTable(urgentItems);

  // Vẽ Biểu đồ Donut Canvas
  renderDonutChart(inStockCount, lowStockCount, outOfStockCount);

  // Render Sơ Đồ Kệ Hàng Thời Gian Thực (Heatmap)
  renderRackHeatmap(items);
}

function renderUrgentTable(urgentItems) {
  const tbody = document.getElementById('urgent-table-body');
  const mobileList = document.getElementById('urgent-mobile-list');

  // 1. Render Bảng Desktop
  if (tbody) {
    if (urgentItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 32px; color: var(--success); font-weight: 600;">
            🎉 Tuyệt vời! Hiện tại không có mặt hàng nào dưới định mức an toàn.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = urgentItems.map(item => `
        <tr>
          <td class="urgent-col-sku">
            <span>${item.id}</span>
          </td>
          <td class="urgent-col-name">
            <strong title="${item.name}">${item.name}</strong>
            <div class="urgent-item-sub">${item.category} • ${item.warehouse}</div>
          </td>
          <td class="urgent-col-rack">
            <code>${item.location || 'N/A'}</code>
          </td>
          <td class="urgent-col-qty">
            <strong style="color: ${item.status.colorHex}; font-size: 14.5px;">${qtyFormatter.format(item.quantity)}</strong>
            <span style="font-size: 11.5px; color: var(--text-muted); margin-left: 3px;">${item.unit}</span>
          </td>
          <td class="urgent-col-min">
            <strong>${qtyFormatter.format(item.minThreshold)}</strong>
            <span style="font-size: 11.5px; color: var(--text-muted); margin-left: 3px;">${item.unit}</span>
          </td>
          <td class="urgent-col-status">
            <span class="badge badge-pill-status ${item.status.badgeClass}">
              ${item.status.label}
            </span>
          </td>
          <td class="urgent-col-actions">
            <button type="button" class="btn btn-primary btn-restock-now" onclick="quickRestock('${item.id}')" aria-label="Nhập hàng ngay cho ${item.id}">
              ➕ Nhập hàng
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  // 2. Render Danh Sách Thẻ Tối Ưu Cho Smartphone
  if (mobileList) {
    if (urgentItems.length === 0) {
      mobileList.innerHTML = `
        <div style="text-align:center; padding: 24px; background:#f0fdf4; border-radius:12px; border:1px solid #bbf7d0; color:#15803d; font-size:13.5px; font-weight:600;">
          🎉 Tuyệt vời! Tất cả vật tư đều trên định mức an toàn.
        </div>
      `;
    } else {
      mobileList.innerHTML = urgentItems.map(item => `
        <div class="mobile-item-card urgent-mobile-card">
          <div class="mobile-card-header">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="mobile-sku-badge">${item.id}</span>
              <span class="badge badge-pill-status ${item.status.badgeClass}">${item.status.label}</span>
            </div>
            <span class="mobile-location-tag">📍 ${item.location || 'Kệ N/A'}</span>
          </div>

          <h4 class="mobile-item-title" title="${item.name}">${item.name}</h4>
          <div class="mobile-item-sub">${item.category} • ${item.warehouse}</div>

          <div class="mobile-item-meta-grid">
            <div>Tồn kho: <strong style="color: ${item.status.colorHex}; font-size:14.5px;">${qtyFormatter.format(item.quantity)} ${item.unit}</strong></div>
            <div>Định mức: <strong>${qtyFormatter.format(item.minThreshold)} ${item.unit}</strong></div>
          </div>

          <button type="button" class="btn btn-primary" style="width:100%; min-height:40px; font-weight:600; margin-top: 6px;" onclick="quickRestock('${item.id}')" aria-label="Nhập hàng ${item.id}">
            ➕ Nhập hàng ngay
          </button>
        </div>
      `).join('');
    }
  }
}

// Biến lưu trạng thái hoạt họa Donut Chart
let donutAnimId = null;
let currentDonutHover = -1;

function renderDonutChart(inStock, lowStock, outStock) {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;

  const total = inStock + lowStock + outStock;

  const pctIn = total > 0 ? Math.round((inStock / total) * 100) : 0;
  const pctLow = total > 0 ? Math.round((lowStock / total) * 100) : 0;
  const pctOut = total > 0 ? Math.max(0, 100 - pctIn - pctLow) : 0;

  const elPctIn = document.getElementById('pct-in-stock');
  const elPctLow = document.getElementById('pct-low-stock');
  const elPctOut = document.getElementById('pct-out-stock');
  if (elPctIn) elPctIn.textContent = `(${pctIn}%)`;
  if (elPctLow) elPctLow.textContent = `(${pctLow}%)`;
  if (elPctOut) elPctOut.textContent = `(${pctOut}%)`;

  const barIn = document.getElementById('bar-in-stock');
  const barLow = document.getElementById('bar-low-stock');
  const barOut = document.getElementById('bar-out-stock');
  if (barIn) barIn.style.width = `${pctIn}%`;
  if (barLow) barLow.style.width = `${pctLow}%`;
  if (barOut) barOut.style.width = `${pctOut}%`;

  const dpr = window.devicePixelRatio || 1;
  const displayWidth = 220;
  const displayHeight = 220;
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const data = [
    { label: 'Còn hàng', value: inStock, color: '#10b981', hoverColor: '#059669', pct: pctIn },
    { label: 'Sắp hết', value: lowStock, color: '#f59e0b', hoverColor: '#d97706', pct: pctLow },
    { label: 'Hết hàng', value: outStock, color: '#ef4444', hoverColor: '#dc2626', pct: pctOut }
  ];

  const centerX = displayWidth / 2;
  const centerY = displayHeight / 2;
  const outerRadius = 88;
  const innerRadius = 58;

  if (donutAnimId) cancelAnimationFrame(donutAnimId);

  let animProgress = 0;
  const animDuration = 600;
  let animStartTime = null;

  function drawFrame(timestamp) {
    if (!animStartTime) animStartTime = timestamp;
    const elapsed = timestamp - animStartTime;
    animProgress = Math.min(1, elapsed / animDuration);
    const easeOut = 1 - Math.pow(1 - animProgress, 3);

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    let startAngle = -Math.PI / 2;

    if (total === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerRadius, Math.PI * 2, 0, true);
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
    } else {
      data.forEach((slice, idx) => {
        if (slice.value === 0) return;
        const sliceAngle = (slice.value / total) * (Math.PI * 2) * easeOut;
        const endAngle = startAngle + sliceAngle;
        const isHovered = currentDonutHover === idx;
        const curOuter = isHovered ? outerRadius + 5 : outerRadius;

        ctx.beginPath();
        ctx.arc(centerX, centerY, curOuter, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = isHovered ? slice.hoverColor : slice.color;
        ctx.shadowColor = isHovered ? 'rgba(0,0,0,0.2)' : 'transparent';
        ctx.shadowBlur = isHovered ? 8 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;

        startAngle = endAngle;
      });
    }

    // Tâm tròn hiển thị số liệu
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius - 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (currentDonutHover >= 0 && currentDonutHover < data.length) {
      const active = data[currentDonutHover];
      ctx.font = 'bold 20px Roboto, sans-serif';
      ctx.fillStyle = active.color;
      ctx.fillText(`${active.pct}%`, centerX, centerY - 6);

      ctx.font = '500 11.5px Roboto, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(active.label, centerX, centerY + 14);
    } else {
      ctx.font = 'bold 22px Roboto, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(qtyFormatter.format(total), centerX, centerY - 6);

      ctx.font = '500 11.5px Roboto, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Tổng mã', centerX, centerY + 14);
    }

    if (animProgress < 1) {
      donutAnimId = requestAnimationFrame(drawFrame);
    }
  }

  donutAnimId = requestAnimationFrame(drawFrame);

  function handlePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    const dist = Math.sqrt(x * x + y * y);

    if (dist >= innerRadius && dist <= outerRadius + 8) {
      let angle = Math.atan2(y, x);
      if (angle < -Math.PI / 2) angle += Math.PI * 2;
      const normalizedAngle = angle + Math.PI / 2;

      let acc = 0;
      let found = -1;
      data.forEach((slice, idx) => {
        if (slice.value === 0) return;
        const sliceAngle = (slice.value / total) * (Math.PI * 2);
        if (normalizedAngle >= acc && normalizedAngle <= acc + sliceAngle) {
          found = idx;
        }
        acc += sliceAngle;
      });

      if (found !== currentDonutHover) {
        currentDonutHover = found;
        requestAnimationFrame((now) => drawFrame(now + animDuration));
      }
    } else {
      if (currentDonutHover !== -1) {
        currentDonutHover = -1;
        requestAnimationFrame((now) => drawFrame(now + animDuration));
      }
    }
  }

  canvas.onmousemove = (e) => handlePointer(e.clientX, e.clientY);
  canvas.onmouseleave = () => {
    if (currentDonutHover !== -1) {
      currentDonutHover = -1;
      requestAnimationFrame((now) => drawFrame(now + animDuration));
    }
  };
  canvas.ontouchstart = (e) => {
    if (e.touches && e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
  };
}

// Render Sơ Đồ Kệ Kho Thông Minh (Warehouse Heatmap)
function renderRackHeatmap(items) {
  const container = document.getElementById('rack-heatmap-grid');
  if (!container) return;

  container.innerHTML = items.map(item => {
    const status = DB.getItemStatus(item.quantity, item.minThreshold);
    let statusClass = 'status-safe';
    if (status.code === 'OUT') statusClass = 'status-out';
    else if (status.code === 'LOW') statusClass = 'status-low';

    return `
      <div class="rack-cell ${statusClass}" onclick="quickRestock('${item.id}')" title="Kệ: ${item.location || 'N/A'} - Nhấn để nhập hàng nhanh" tabindex="0" role="button" aria-label="Kệ ${item.location || 'N/A'} mặt hàng ${item.name}">
        <div class="rack-header-row">
          <span class="rack-code">📍 ${item.location || 'Kệ N/A'}</span>
          <span class="badge ${status.badgeClass} rack-badge">${status.label}</span>
        </div>
        <div class="rack-item-name" title="${item.name}">${item.name}</div>
        <div class="rack-qty-row">
          <span class="rack-qty-label">Tồn kho:</span>
          <span class="rack-qty-val">
            <strong style="color:${status.colorHex}; font-size: 13.5px;">${qtyFormatter.format(item.quantity)}</strong>
            <span style="font-size: 11px; color: var(--text-muted); margin-left: 2px;">${item.unit}</span>
          </span>
        </div>
      </div>
    `;
  }).join('');
}

// Điều hướng nhanh sang trang Nhập hàng (operations.html)
function quickRestock(itemId) {
  sessionStorage.setItem('QUICK_RESTOCK_ITEM_ID', itemId);
  window.location.href = 'operations.html';
}
