# 📝 NHẬT KÝ KỸ NGHỆ CÂU LỆNH (PROMPT LOG) - MEMBER 4

> **Dự án:** SmartKho - Hệ Thống Quản Lý Kho Thông Minh Chuẩn Đồ Án Web (TKW)  
> **Phân hệ phụ trách:** Dòng Thời Gian Lịch Sử Giao Dịch, Đối Soát & Xuất Báo Cáo CSV (Trang 4)  
> **Thành viên thực hiện:** Nguyễn Lê Đông (Kỹ sư Frontend phụ trách Phân hệ Lịch Sử)  
> **Nhánh Git phụ trách:** `feature/member-4-history`  
> **Tệp tin sở hữu độc quyền:**  
> - `history.html`  
> - `assets/css/history.css`  
> - `assets/js/history.js`  
> **Công cụ AI hỗ trợ:** Antigravity AI Assistant / Gemini 1.5 Pro  
> **Thời gian thực hiện:** 22/11/2026 - 23/11/2026  

---

## I. BỐI CẢNH & KHUNG RÀNG BUỘC KỸ THUẬT (SYSTEM CONTEXT & CONSTRAINTS)

Trước khi tiến hành viết code, toàn bộ quy chuẩn kiến trúc của dự án đã được định hình và nạp vào ngữ cảnh của AI:

```markdown
BẠN LÀ KỸ SƯ FRONTEND PHỤ TRÁCH PHÂN HỆ LỊCH SỬ GIAO DỊCH DỰ ÁN SMARTKHO. HÃY TUÂN THỦ CÁC QUY TẮC BẮT BUỘC SAU:
1. Công nghệ: 100% Thuần HTML5, CSS3, JavaScript ES6+ (Không dùng CDN, không thư viện ngoài).
2. Kiến trúc dữ liệu: Đọc danh sách lịch sử giao dịch thông qua API `window.DB.getLogs()`. Tuyệt đối không can thiệp hay làm biến đổi mảng gốc.
3. Kiến trúc giao diện Zero-Conflict:
   - Kế thừa bộ khung chuẩn: `#sidebar-container`, `#header-container`.
   - Nhúng `assets/css/common.css` (Read-only).
   - Mọi CSS riêng của trang phải viết vào `assets/css/history.css`.
   - Nhúng `assets/js/db.js`, `assets/js/layout.js`, rồi mới đến `assets/js/history.js`.
   - Gọi `initLayout('history')` khi DOM sẵn sàng.
4. Trọng tâm nghiệp vụ:
   - Dòng thời gian Timeline trực quan: Trục dọc đường kẻ 2px #E2E8F0, chấm tròn xanh .timeline-dot.import (+Qty, mũi tên xuống ↓) và chấm tròn đỏ .timeline-dot.export (-Qty, mũi tên lên ↑).
   - Chuyển đổi 2 chế độ hiển thị: Nút Toggle chuyển đổi giữa "📅 Dạng Timeline" và "📋 Dạng Bảng Đối Soát".
   - Bộ lọc chuyên sâu thời gian thực: Lọc từ khóa, loại giao dịch, khoảng ngày phát sinh. Tự động tính 3 chỉ số kỳ lọc: Tổng số phiếu, Tổng tiền nhập, Tổng tiền xuất.
   - Xuất dữ liệu CSV động: Sử dụng Web Blob API, bắt buộc chèn tiền tố UTF-8 BOM ('\uFEFF') để khi mở trên Excel tiếng Việt có dấu không bị lỗi font.
   - Đồng bộ Realtime: Đăng ký `DB.onUpdate()` để tự động vẽ lại khi có giao dịch mới từ các tab khác.
```

---

## II. CHI TIẾT CÁC PHIÊN PROMPT (PROMPT ITERATION LOG)

---

### 🔹 PHIÊN 1: Khởi tạo Khung Giao diện & Bộ Lọc (`history.html`)

* **Mục tiêu:** Xây dựng cấu trúc HTML trang Lịch sử giao dịch với thanh thống kê, bộ lọc đa năng 4 tiêu chí và 2 vùng chứa (Timeline & Table).
* **Người thực hiện:** Nguyễn Lê Đông

#### 💬 Câu lệnh Prompt gửi AI:
```text
Tôi phụ trách lập trình trang history.html cho dự án SmartKho.
Hãy tạo khung HTML hoàn chỉnh đáp ứng các yêu cầu sau:
1. Nhúng các file CSS: assets/css/common.css và assets/css/history.css.
2. Khung layout: <div class="app-layout"> chứa <div id="sidebar-container"></div>, <div class="app-main"> chứa <div id="header-container"></div> và <main class="page-content">.
3. Trong page-content, đặt 1 card chính chứa:
   - Bộ lọc lịch sử (history-filter-grid):
     + Input text #filter-keyword: "🔍 Tìm theo Tên vật tư / Mã phiếu / Người lập".
     + Select #filter-type: Tất cả / Nhập kho (IMPORT) / Xuất kho (EXPORT).
     + Input date #filter-from-date ("Từ ngày") và #filter-to-date ("Đến ngày").
     + Nút button.btn-outline: "📥 Xuất File CSV (Excel)" gắn sự kiện onclick="exportHistoryCSV()".
   - Thanh thống kê nhanh kỳ lọc:
     + Tổng số phiếu: #stat-total-count
     + Tổng tiền nhập (+): #stat-import-val (màu xanh lá)
     + Tổng tiền xuất (-): #stat-export-val (màu đỏ)
   - Thanh chuyển đổi chế độ xem (View Toggle Group):
     + Nút #btn-view-timeline: "📅 Dạng Timeline" (active mặc định).
     + Nút #btn-view-table: "📋 Dạng Bảng Đối Soát".
   - Vùng hiển thị 1: <div class="timeline" id="timeline-container"></div>.
   - Vùng hiển thị 2: <div id="table-view-container" style="display:none"> chứa bảng <table class="table">.
4. Nhúng db.js, layout.js, history.js và gọi initLayout('history') trong DOMContentLoaded.
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
AI đã sinh toàn bộ khung HTML sạch sẽ, đầy đủ id cho các trường lọc, chuẩn hóa layout và sẵn sàng cho việc nhúng logic JS.

#### 🎯 Tinh chỉnh & Đánh giá của Member 4:
- Thêm thuộc tính `placeholder` chi tiết cho ô tìm kiếm từ khóa để người dùng biết có thể gõ cả mã phiếu lẫn tên nhân viên.
- Phân chia bố cục grid linh hoạt cho bộ lọc để không bị tràn viền trên màn hình laptop nhỏ.

---

### 🔹 PHIÊN 2: Thiết Kế Trục Dọc Timeline & Bộ Style Riêng (`assets/css/history.css`)

* **Mục tiêu:** Viết CSS độc lập cho trang Lịch sử, tạo hiệu ứng trục thời gian đồ họa và các thẻ giao dịch đổ bóng mượt mà.
* **Người thực hiện:** Nguyễn Lê Đông

#### 💬 Câu lệnh Prompt gửi AI:
```text
Hãy viết file CSS assets/css/history.css cho trang history.html:
Yêu cầu:
1. Trục dọc Timeline:
   - Container .timeline có position: relative, padding-left: 35px.
   - Dùng pseudo-element .timeline::before tạo một đường kẻ dọc trục thời gian: width: 2px, background: #E2E8F0, position absolute, top: 0, bottom: 0, left: 16px.
2. Điểm mốc thời gian (.timeline-dot):
   - Hình tròn 28px x 28px, border-radius: 50%, căn giữa trục đường kẻ dọc (left: 3px).
   - Loại Nhập kho (.timeline-dot.import): Nền xanh #10B981, chữ trắng, hiển thị icon mũi tên xuống ↓ hoặc 📥.
   - Loại Xuất kho (.timeline-dot.export): Nền đỏ #EF4444, chữ trắng, hiển thị icon mũi tên lên ↑ hoặc 📤.
3. Thẻ giao dịch (.timeline-card):
   - Nền trắng #FFFFFF, border: 1px solid #E2E8F0, border-radius: 8px, padding: 14px, margin-bottom: 20px.
   - Hiệu ứng hover: Đổ bóng nhẹ box-shadow: 0 4px 12px rgba(0,0,0,0.06), dịch chuyển nhẹ translateY(-2px).
4. Nhóm nút Toggle (.view-toggle-group):
   - Bo góc, nút .view-toggle-btn.active có nền xanh #2563EB chữ trắng.
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
```css
.timeline {
  position: relative;
  padding: 15px 0 15px 35px;
}
.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 15px;
  width: 2px;
  background: var(--border-color);
}
.timeline-dot {
  position: absolute;
  left: 2px;
  top: 15px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #fff;
  font-weight: bold;
}
.timeline-dot.import { background: var(--success); }
.timeline-dot.export { background: var(--danger); }
```

#### 🎯 Tinh chỉnh & Đánh giá của Member 4:
- Trục Timeline hiển thị rất đẹp mắt, phân biệt rõ ràng màu xanh (Nhập) và màu đỏ (Xuất), giúp người xem nhận biết ngay loại giao dịch mà không cần đọc chữ.
- Thêm class `.timeline-meta` để ghi rõ giờ phút thực hiện và người lập phiếu bằng màu chữ xám trang nhã.

---

### 🔹 PHIÊN 3: Xử Lý Logic Hiển Thị Timeline & Chuyển Đổi Chế Độ Xem (`assets/js/history.js`)

* **Mục tiêu:** Lấy dữ liệu từ `DB.getLogs()`, render danh sách ra Timeline và xử lý nút chuyển đổi qua lại giữa Dạng Timeline và Dạng Bảng.
* **Người thực hiện:** Nguyễn Lê Đông

#### 💬 Câu lệnh Prompt gửi AI:
```text
Hãy viết mã JavaScript trong file assets/js/history.js để xử lý:
1. Hàm switchHistoryView(mode):
   - Nếu mode === 'timeline': Thêm active cho nút Timeline, hiển thị #timeline-container, ẩn #table-view-container.
   - Nếu mode === 'table': Thêm active cho nút Bảng, ẩn #timeline-container, hiển thị #table-view-container.
2. Hàm renderTimeline():
   - Đọc logs = DB.getLogs().
   - Sắp xếp log mới nhất lên đầu (theo timestamp hoặc mảng đảo ngược).
   - Duyệt từng log tạo HTML:
     + Chấm tròn .timeline-dot (xanh hoặc đỏ kèm mũi tên).
     + Thẻ card chứa: Mã phiếu (PXK/PNK), Tên mặt hàng, Biến động (+50 hoặc -20), Tồn kho sau giao dịch, Đối tác liên kết, Đơn giá & Thành tiền, Lý do xuất/nhập, Người thực hiện.
   - Đồng thời sinh các dòng <tr> cho chế độ xem dạng Bảng Đối Soát (#history-table-body).
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
AI sinh hàm `renderTimeline()` và `switchHistoryView()` hoàn hảo, tự động định dạng tiền tệ qua `DB.formatCurrency()` và thời gian qua `DB.formatDateTime()`.

#### 🎯 Tinh chỉnh & Đánh giá của Member 4:
- Đã test nút chuyển đổi: Bấm "📋 Dạng Bảng Đối Soát", giao diện chuyển mượt mà sang bảng kẻ sọc chuẩn kế toán, rất tiện lợi cho việc đối chiếu nhiều giao dịch cùng lúc.

---

### 🔹 PHIÊN 4: BỘ LỌC CHUYÊN SÂU & TÍNH TOÁN KỲ LỌC THỜI GIAN THỰC

* **Mục tiêu:** Xử lý lọc đồng thời 4 điều kiện (Từ khóa, Loại, Từ ngày, Đến ngày) và cập nhật thanh 3 chỉ số tài chính trên đầu trang.
* **Người thực hiện:** Nguyễn Lê Đông

#### 💬 Câu lệnh Prompt gửi AI:
```text
Hãy hoàn thiện bộ lọc trong assets/js/history.js:
1. Bắt sự kiện 'input' trên #filter-keyword, và 'change' trên #filter-type, #filter-from-date, #filter-to-date để tự động gọi lại renderTimeline() mỗi khi người dùng thay đổi tiêu chí.
2. Trong hàm renderTimeline(), lọc mảng logs theo:
   - keyword: Khớp với log.itemName, log.itemId, log.id (mã phiếu), log.actor (người lập), hoặc log.partner.
   - filterType: Khớp với log.type ('IMPORT' hoặc 'EXPORT').
   - fromDate: Ngày tạo log >= fromDate (00:00:00).
   - toDate: Ngày tạo log <= toDate (23:59:59).
3. Sau khi lọc ra danh sách filteredLogs:
   - Tính tổng số phiếu = filteredLogs.length.
   - Tính tổng tiền nhập = Tổng (qty * price) của các phiếu IMPORT.
   - Tính tổng tiền xuất = Tổng (qty * price) của các phiếu EXPORT.
   - Hiển thị kết quả ra #stat-total-count, #stat-import-val, #stat-export-val.
   - Nếu danh sách rỗng, hiển thị thông báo "Không tìm thấy giao dịch nào phù hợp với bộ lọc".
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
```javascript
const filteredLogs = logs.filter(log => {
  const matchKeyword = !keyword || 
    (log.itemName && log.itemName.toLowerCase().includes(keyword)) ||
    (log.itemId && log.itemId.toLowerCase().includes(keyword)) ||
    (log.id && log.id.toLowerCase().includes(keyword)) ||
    (log.actor && log.actor.toLowerCase().includes(keyword)) ||
    (log.partner && log.partner.toLowerCase().includes(keyword));

  const matchType = !filterType || log.type === filterType;

  let matchDate = true;
  if (fromDate || toDate) {
    const logDate = new Date(log.timestamp);
    if (fromDate) matchDate = matchDate && logDate >= new Date(fromDate + 'T00:00:00');
    if (toDate) matchDate = matchDate && logDate <= new Date(toDate + 'T23:59:59');
  }

  return matchKeyword && matchType && matchDate;
});
```

#### 🎯 Tinh chỉnh & Đánh giá của Member 4:
- Khi gõ từ khóa "Cáp" -> Bảng và Timeline lập tức thu hẹp lại đúng các phiếu có dây cáp, thanh tiền tự động cộng dồn lại theo đúng các phiếu hiển thị.
- Trải nghiệm lọc cực nhanh vì dữ liệu được xử lý thuần bằng mảng JavaScript trên bộ nhớ máy khách (Client-side in-memory filter).

---

### 🔹 PHIÊN 5: KỸ THUẬT ĐỘNG XUẤT CSV CHUẨN EXCEL BẰNG BLOB API & UTF-8 BOM

* **Mục tiêu:** Cho phép thủ kho tải toàn bộ lịch sử giao dịch đang lọc về máy dưới dạng file `.csv`, mở được trực tiếp trên Microsoft Excel tiếng Việt không bị lỗi font.
* **Người thực hiện:** Nguyễn Lê Đông

#### 💬 Câu lệnh Prompt gửi AI:
```text
Hãy viết hàm exportHistoryCSV() trong assets/js/history.js:
Yêu cầu kỹ thuật khắt khe:
1. Đọc dữ liệu logs từ danh sách đang được lọc (hoặc toàn bộ DB.getLogs()).
2. Xây dựng tiêu đề cột CSV:
   "Mã Phiếu,Thời Gian,Loại Giao Dịch,Mã Vật Tư,Tên Vật Tư,Biến Động Số Lượng,Đơn Vị,Đơn Giá,Thành Tiền,Tồn Sau GD,Đối Tác,Người Thực Hiện,Lý Do"
3. Duyệt từng dòng: Xử lý dấu phẩy trong chuỗi (bọc trong ngoặc kép "") để tránh lệch cột CSV.
4. QUAN TRỌNG: Để Microsoft Excel trên Windows tự động nhận diện tiếng Việt có dấu mà không bị vỡ font, BẮT BUỘC phải chèn tiền tố UTF-8 BOM ('\uFEFF') vào đầu chuỗi CSV.
5. Sử dụng Web Blob API: new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }).
6. Tạo thẻ <a> ảo, gắn thuộc tính download="Lich_Su_Kho_[YYYYMMDD].csv", kích hoạt link.click() và dọn dẹp URL.revokeObjectURL().
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
```javascript
function exportHistoryCSV() {
  const logs = DB.getLogs();
  if (!logs || logs.length === 0) {
    DB.showToast('Không có dữ liệu lịch sử để xuất!', 'warning');
    return;
  }

  const headers = [
    'Mã Phiếu', 'Thời Gian', 'Loại Giao Dịch', 'Mã Vật Tư', 
    'Tên Vật Tư', 'Biến Động', 'Đơn Vị', 'Đơn Giá', 'Thành Tiền', 
    'Tồn Sau GD', 'Đối Tác', 'Người Lập', 'Lý Do'
  ];

  let csvContent = '\uFEFF'; // BẮT BUỘC: UTF-8 BOM chống lỗi font tiếng Việt trên Excel
  csvContent += headers.join(',') + '\r\n';

  logs.forEach(log => {
    const row = [
      `"${log.id || ''}"`,
      `"${DB.formatDateTime(log.timestamp)}"`,
      `"${log.type === 'IMPORT' ? 'Nhập kho' : 'Xuất kho'}"`,
      `"${log.itemId || ''}"`,
      `"${(log.itemName || '').replace(/"/g, '""')}"`,
      log.type === 'IMPORT' ? `+${log.quantity}` : `-${log.quantity}`,
      `"${log.unit || ''}"`,
      log.price || 0,
      (log.quantity * (log.price || 0)),
      log.balanceAfter || '',
      `"${(log.partner || '').replace(/"/g, '""')}"`,
      `"${(log.actor || '').replace(/"/g, '""')}"`,
      `"${(log.reason || '').replace(/"/g, '""')}"`
    ];
    csvContent += row.join(',') + '\r\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Lich_Su_Kho_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  DB.showToast('Xuất báo cáo CSV thành công!', 'success');
}
```

#### 🎯 Tinh chỉnh & Đánh giá của Member 4:
- **Kiểm tra thực tế:** Bấm nút "Xuất File CSV", mở file trực tiếp bằng Microsoft Excel trên Windows. Toàn bộ chữ tiếng Việt như "Nhập kho", "Dây cáp mạng", "Thủ kho Nguyễn Hoàng Anh" đều hiển thị chuẩn 100%, không hề bị lỗi ký tự ngoằn ngoèo nhờ tiền tố `\uFEFF`.
- Xuất file hoàn toàn bằng trình duyệt, tốc độ tức thì dưới 0.1 giây.

---

### 🔹 PHIÊN 6: Đồng Bộ Realtime & Kiểm Thử Zero-Conflict

* **Mục tiêu:** Kết nối sự kiện `DB.onUpdate()`, kiểm tra console và chuẩn bị Pull Request.
* **Người thực hiện:** Nguyễn Lê Đông

#### 💬 Câu lệnh Prompt gửi AI:
```text
Làm sao để khi Member 1 thực hiện xuất/nhập kho ở tab bên cạnh thì trang history.html của tôi tự động vẽ thêm dòng giao dịch mới mà không cần người dùng phải bấm F5?
```

#### 🤖 Kết quả AI phản hồi:
Đăng ký hàm lắng nghe sự kiện:
```javascript
if (window.DB && typeof window.DB.onUpdate === 'function') {
  window.DB.onUpdate(() => {
    renderTimeline();
  });
}
```
Nhờ cơ chế Event Bus của `db.js`, mỗi khi `localStorage` thay đổi, hàm `renderTimeline()` tự động được gọi lại, cập nhật ngay lập tức giao dịch mới nhất lên đầu dòng thời gian.

---

## III. TỔNG KẾT & BẢNG ĐÁNH GIÁ NGHIỆM THU (DEFINITION OF DONE)

| Tiêu chuẩn nghiệm thu | Yêu cầu kỹ thuật | Kết quả đạt được | Đánh giá |
| :--- | :--- | :--- | :---: |
| **Giao diện Dòng thời gian** | Trục dọc đường kẻ mượt mà, phân biệt Nhập/Xuất | Chấm xanh (+ mũi tên ↓) và chấm đỏ (- mũi tên ↑) | ✅ Đạt 10/10 |
| **Chuyển đổi 2 chế độ xem** | Toggle giữa Dạng Timeline và Bảng Đối Soát | Hoạt động trơn tru, không tải lại trang | ✅ Đạt 10/10 |
| **Bộ lọc chuyên sâu** | Lọc từ khóa, loại giao dịch, khoảng ngày | Lọc tức thì trên bộ nhớ, cập nhật 3 thẻ KPI kỳ lọc | ✅ Đạt 10/10 |
| **Xuất báo cáo CSV** | Dùng Blob API, chống lỗi font tiếng Việt | Chèn UTF-8 BOM (`\uFEFF`), mở Excel chuẩn đẹp | ✅ Đạt 10/10 |
| **Tách biệt CSS cá nhân** | Toàn bộ style nằm trong `history.css` | Không sửa 1 dòng nào trong `common.css` | ✅ Đạt 10/10 |
| **Quy tắc Git Zero-Conflict** | Chỉ sửa `history.html`, `.css`, `.js` | Push lên `feature/member-4-history` 0% conflict | ✅ Đạt 10/10 |
| **Lỗi Console trình duyệt** | F12 DevTools Console không có lỗi đỏ | 0 Warning, 0 Error | ✅ Đạt 10/10 |

---
*Xác nhận của Thành viên 4:* **Nguyễn Lê Đông (Đã ký duyệt)**
