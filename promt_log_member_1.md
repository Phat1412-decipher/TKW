# 📝 NHẬT KÝ KỸ NGHỆ CÂU LỆNH (PROMPT LOG) - MEMBER 1

> **Dự án:** SmartKho - Hệ Thống Quản Lý Kho Thông Minh Chuẩn Đồ Án Web (TKW)  
> **Phân hệ phụ trách:** Điều Phối Nhập & Xuất Kho, Chặn Xuất Âm & In Phiếu Kho (Trang 3)  
> **Thành viên thực hiện:** Nguyễn Hoàng Anh (Leader / Lead Architecture)  
> **Nhánh Git phụ trách:** `feature/member-1-operations`  
> **Tệp tin sở hữu độc quyền:**  
> - `operations.html`  
> - `assets/css/operations.css`  
> - `assets/js/operations.js`  
> **Công cụ AI hỗ trợ:** Antigravity AI Assistant / Gemini 1.5 Pro  
> **Thời gian thực hiện:** 22/11/2026 - 23/11/2026  

---

## I. BỐI CẢNH & KHUNG RÀNG BUỘC KỸ THUẬT (SYSTEM CONTEXT & CONSTRAINTS)

Trước khi tiến hành viết code, toàn bộ quy chuẩn kiến trúc của dự án đã được định hình và nạp vào ngữ cảnh của AI:

```markdown
BẠN LÀ KỸ SƯ FRONTEND LEAD CỦA DỰ ÁN SMARTKHO. HÃY TUÂN THỦ CÁC QUY TẮC BẮT BUỘC SAU:
1. Công nghệ: 100% Thuần HTML5, CSS3, JavaScript ES6+ (Tuyệt đối không dùng thư viện ngoài, không jQuery, không Bootstrap).
2. Kiến trúc dữ liệu: Mọi thao tác đọc/ghi dữ liệu đều thông qua API đối tượng toàn cục `window.DB` (lưu trữ trong LocalStorage). Không được gọi trực tiếp `localStorage.getItem/setItem`.
3. Kiến trúc giao diện Zero-Conflict:
   - Kế thừa bộ khung chuẩn: `#sidebar-container`, `#header-container`.
   - Nhúng `assets/css/common.css` (Read-only, chứa design tokens dùng chung).
   - Mọi CSS riêng của trang phải viết vào `assets/css/operations.css`.
   - Nhúng `assets/js/db.js`, `assets/js/layout.js`, rồi mới đến `assets/js/operations.js`.
   - Gọi `initLayout('operations')` khi DOM sẵn sàng.
4. Trọng tâm nghiệp vụ:
   - Chặn xuất âm kho tuyệt đối: Gán thuộc tính HTML5 `min="1"`, `max="item.quantity"`. Bắt sự kiện `input` kiểm tra số lượng xuất <= tồn kho thực tế; nếu vượt quá phải đổi viền đỏ rung lắc `.input-error`, hiển thị câu cảnh báo và vô hiệu hóa nút submit (`disabled = true`).
   - Tự động tính Thành tiền = Số lượng * Đơn giá theo thời gian thực.
   - Hỗ trợ in Phiếu Nhập / Xuất Kho Mẫu 02-VT chuẩn Bộ Tài Chính bằng `@media print`.
   - Tự động nhận tham số điều hướng từ `sessionStorage`: `QUICK_RESTOCK_ITEM_ID` và `PRESELECT_SUPPLIER_NAME`.
```

---

## II. CHI TIẾT CÁC PHIÊN PROMPT (PROMPT ITERATION LOG)

---

### 🔹 PHIÊN 1: Khởi tạo Khung Giao diện & Tab Điều Phối (`operations.html`)

* **Mục tiêu:** Xây dựng cấu trúc HTML sạch, chuẩn ngữ nghĩa, tích hợp hệ thống Layout động và 2 Tab chuyển đổi giữa Nhập kho và Xuất kho.
* **Người thực hiện:** Nguyễn Hoàng Anh

#### 💬 Câu lệnh Prompt gửi AI:
```text
Tôi đang phụ trách phát triển trang operations.html cho hệ thống quản lý kho SmartKho.
Hãy tạo cấu trúc HTML hoàn chỉnh tuân thủ các yêu cầu sau:
1. Nhúng các file CSS tương đối: assets/css/common.css và assets/css/operations.css.
2. Bộ khung Layout:
   - Thẻ <div class="app-layout">
   - <div id="sidebar-container"></div>
   - <div class="app-main"> chứa <div id="header-container"></div> và <main class="page-content">.
3. Trong page-content, tạo 1 thẻ card trung tâm (max-width: 820px) có 2 nút Tab điều hướng:
   - Tab 1: "📥 Tạo Phiếu Nhập Kho (Goods Receipt)" - id="btn-tab-import", class active.
   - Tab 2: "📤 Tạo Phiếu Xuất Kho (Goods Issue)" - id="btn-tab-export".
4. Khung nội dung 2 Tab:
   - Pane Nhập kho (id="pane-import", class active): Chứa Form id="form-import" gồm chọn vật tư, nhà cung cấp, số lượng nhập (min=1), đơn giá nhập (min=0), ô hiển thị tổng tiền tạm tính và nút submit xanh lá.
   - Pane Xuất kho (id="pane-export"): Chứa Form id="form-export" gồm chọn vật tư, khung thông báo tồn kho khả dụng, ô nhập số lượng xuất, lý do xuất, người nhận, thông báo lỗi đỏ và nút submit đỏ.
5. Thêm modal ẩn id="voucher-modal" để chuẩn bị cho việc xem và in phiếu kho Mẫu 02-VT.
6. Nhúng db.js, layout.js, operations.js và gọi initLayout('operations') trong DOMContentLoaded.
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
AI đã sinh toàn bộ mã HTML của `operations.html` chuẩn ngữ nghĩa, tạo đúng cấu trúc các `form-group`, các trường input mang thuộc tính HTML5 `required`, `min="1"`, `step="1"`, cùng cấu trúc modal in phiếu kho chuẩn.

#### 🎯 Tinh chỉnh & Đánh giá của Member 1:
- **Ưu điểm:** Khung HTML rất mạch lạc, chuẩn BEM class và khớp 100% với file `layout.js` có sẵn.
- **Điểm chỉnh sửa thủ công:** Bổ sung thêm vùng `#import-item-preview` và `#export-stock-notice` để hiển thị thẻ badge trực quan thông tin kho (vị trí kệ, số lượng tồn hiện tại) giúp thủ kho không phải mở tab khác để tra cứu.

---

### 🔹 PHIÊN 2: Thiết Kế Giao Diện & Hiệu Ứng Rung Lắc Cảnh Báo (`assets/css/operations.css`)

* **Mục tiêu:** Tạo bộ stylesheet riêng biệt cho trang Điều phối, không can thiệp vào `common.css`, thiết kế animation rung lắc khi nhập sai số lượng.
* **Người thực hiện:** Nguyễn Hoàng Anh

#### 💬 Câu lệnh Prompt gửi AI:
```text
Hãy viết file CSS assets/css/operations.css cho trang operations.html của hệ thống SmartKho.
Yêu cầu:
1. Sử dụng biến CSS đã định nghĩa trong common.css (--primary: #2563EB, --danger: #EF4444, --success: #10B981, --border-color, --radius).
2. Hiệu ứng rung lắc cảnh báo lỗi xuất âm:
   - Tạo class .input-error: Viền đỏ !important, viền phát sáng đỏ (box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2)), gắn animation shake 0.3s ease-in-out.
   - Viết keyframes shake dịch chuyển qua lại -4px và 4px.
   - Class .hint-danger: Chữ đỏ đậm, hiển thị rõ ràng thông báo lỗi.
3. Chuyển đổi Tab:
   - .tab-btn có viền đáy mượt mà, khi .active có màu chữ --primary và viền đáy 2.5px.
   - .tab-pane ẩn mặc định (display: none), khi có .active thì hiển thị kèm hiệu ứng fadeIn nhẹ 0.2s.
4. Thiết kế phiếu in kho (.voucher-paper):
   - Khung giấy trắng nền #FFF, viền mờ, đổ bóng nhẹ như một trang giấy A4.
   - Khi in ấn (@media print): Ẩn toàn bộ sidebar, header, nút bấm, overlay; chỉ giữ lại duy nhất khung phiếu in với độ rộng 100% và chữ đen rõ nét.
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
```css
.input-error {
  border-color: var(--danger) !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
  animation: shake 0.3s ease-in-out;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
@media print {
  body * { visibility: hidden; }
  #voucher-printable-area, #voucher-printable-area * { visibility: visible; }
  #voucher-printable-area { position: absolute; left: 0; top: 0; width: 100%; }
}
```

#### 🎯 Tinh chỉnh & Đánh giá của Member 1:
- Animation `@keyframes shake` tạo trải nghiệm tương tác (UX) cực tốt, phản hồi ngay lập tức cho người dùng khi nhập số vượt tồn kho.
- Media query `@media print` được bổ sung thêm đoạn ẩn nền modal để trang in ra giấy trắng tinh, tiết kiệm mực in thực tế.

---

### 🔹 PHIÊN 3: Xử Lý Nghiệp Vụ Nhập Kho & Tính Thành Tiền Realtime (`assets/js/operations.js`)

* **Mục tiêu:** Đọc danh mục vật tư & đối tác từ LocalStorage qua `DB`, tự động tính thành tiền khi thay đổi số lượng hoặc đơn giá, lưu phiếu nhập kho.
* **Người thực hiện:** Nguyễn Hoàng Anh

#### 💬 Câu lệnh Prompt gửi AI:
```text
Hãy viết mã JavaScript xử lý nghiệp vụ Nhập Kho trong file assets/js/operations.js:
1. Khi DOM load:
   - Gọi initLayout('operations').
   - Gọi populateSelectOptions() để lấy DB.getItems() và DB.getSuppliers(), đổ dữ liệu vào các thẻ <select> id="import-item-select" và id="import-supplier-select".
2. Tự động tính thành tiền:
   - Bắt sự kiện 'input' trên cả ô #import-quantity và #import-price.
   - Lấy giá trị: total = quantity * price.
   - Hiển thị ra thẻ #import-total-calc bằng hàm DB.formatCurrency(total).
3. Khi submit form #form-import:
   - Ngăn reload trang (e.preventDefault()).
   - Lấy itemId, qty, price, supplierName, reason.
   - Gọi DB.importStock(itemId, qty, price, supplierName, reason).
   - Kiểm tra kết quả: Nếu thành công, reset form, hiển thị thông báo DB.showToast('Nhập kho thành công', 'success') và mở Modal in phiếu kho Mẫu 02-VT.
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
AI đã viết hàm `populateSelectOptions()`, `setupCalculationListeners()` và `handleImportSubmit(event)` hoàn chỉnh, xử lý parse số nguyên `parseInt` và số thực `parseFloat` an toàn, tránh lỗi `NaN`.

#### 🎯 Tinh chỉnh & Đánh giá của Member 1:
- Đã test nhập thử: Khi gõ số lượng 50 và đơn giá 200,000đ, nhãn thành tiền lập tức nhảy thành `10.000.000 ₫`.
- Thêm đăng ký lắng nghe `DB.onUpdate()` để khi có tab khác cập nhật danh mục vật tư, các ô dropdown tự động làm mới ngay.

---

### 🔹 PHIÊN 4: TÍNH NĂNG TRỌNG TÂM - Chặn Xuất Âm Kho Tuyệt Đối (Core Requirement)

* **Mục tiêu:** Triển khai cơ chế kiểm tra tính hợp lệ của số lượng xuất kho: gán `max`, bắt sự kiện `oninput`, hiển thị cảnh báo đỏ và khóa nút bấm.
* **Người thực hiện:** Nguyễn Hoàng Anh

#### 💬 Câu lệnh Prompt gửi AI:
```text
Đây là yêu cầu quan trọng nhất trong đề bài của giảng viên dành cho Member 1:
"Sử dụng thuộc tính min, max của form HTML5 kết hợp JavaScript để kiểm tra số lượng xuất kho. Nếu số lượng nhập vào lớn hơn số lượng tồn kho khả dụng thì KHÔNG CHO PHÉP thực hiện thao tác (vô hiệu hóa nút submit) và hiển thị cảnh báo trực quan."

Hãy viết logic cho Form Xuất Kho trong operations.js:
1. Khi người dùng chọn một vật tư trong #export-item-select:
   - Tìm vật tư đó qua DB.getItemById(selectedId).
   - Lưu vào biến currentSelectedItemForExport.
   - Hiển thị số lượng tồn và vị trí kho vào #export-stock-notice.
   - TỰ ĐỘNG GÁN: exportQtyInput.max = item.quantity; exportQtyInput.min = 1;
2. Hàm validateExportQuantity():
   - Bắt sự kiện 'input' trên ô #export-quantity.
   - Lấy qty = parseInt(exportQtyInput.value).
   - Nếu qty > item.quantity hoặc qty <= 0:
     + Thêm class .input-error vào input.
     + Hiển thị thẻ #export-error-msg với nội dung: "⚠️ Cảnh báo: Số lượng xuất (X) vượt quá tồn kho khả dụng (Y)!"
     + VÔ HIỆU HÓA nút bấm: document.getElementById('btn-submit-export').disabled = true.
   - Nếu 1 <= qty <= item.quantity:
     + Xóa class .input-error.
     + Ẩn thẻ #export-error-msg.
     + KÍCH HOẠT LẠI nút bấm: document.getElementById('btn-submit-export').disabled = false.
3. Khi submit form #form-export:
   - Kiểm tra lại 1 lần nữa qua DB.exportStock(itemId, qty, partner, reason). Nếu số lượng không đủ, hàm DB sẽ trả về false và alert lỗi an toàn.
   - Nếu thành công: Mở modal in phiếu xuất kho.
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
```javascript
function onExportItemChange() {
  const select = document.getElementById('export-item-select');
  const itemId = select.value;
  const noticeBox = document.getElementById('export-stock-notice');
  const qtyInput = document.getElementById('export-quantity');
  
  if (!itemId) {
    currentSelectedItemForExport = null;
    noticeBox.style.display = 'none';
    qtyInput.removeAttribute('max');
    return;
  }
  
  const item = DB.getItemById(itemId);
  currentSelectedItemForExport = item;
  noticeBox.style.display = 'block';
  noticeBox.innerHTML = `📦 Tồn kho khả dụng: <strong>${item.quantity} ${item.unit}</strong> | Vị trí: <strong>${item.location}</strong>`;
  
  qtyInput.min = '1';
  qtyInput.max = item.quantity;
  validateExportQuantity();
}

function validateExportQuantity() {
  const qtyInput = document.getElementById('export-quantity');
  const errorMsg = document.getElementById('export-error-msg');
  const submitBtn = document.getElementById('btn-submit-export');
  
  if (!currentSelectedItemForExport) return;
  
  const val = parseInt(qtyInput.value) || 0;
  const max = currentSelectedItemForExport.quantity;
  
  if (val > max) {
    qtyInput.classList.add('input-error');
    errorMsg.style.display = 'block';
    errorMsg.innerHTML = `❌ Không thể xuất! Số lượng xuất (${val}) lớn hơn tồn kho khả dụng (${max} ${currentSelectedItemForExport.unit}).`;
    submitBtn.disabled = true;
  } else if (val <= 0 && qtyInput.value !== '') {
    qtyInput.classList.add('input-error');
    errorMsg.style.display = 'block';
    errorMsg.innerHTML = '❌ Số lượng xuất phải lớn hơn 0!';
    submitBtn.disabled = true;
  } else {
    qtyInput.classList.remove('input-error');
    errorMsg.style.display = 'none';
    submitBtn.disabled = false;
  }
}
```

#### 🎯 Tinh chỉnh & Đánh giá của Member 1:
- Thử nghiệm thực tế: Chọn mặt hàng "Dây cáp mạng Cat6" (tồn: 15 cuộn). Gõ `16` -> Ô input lập tức rung lắc màu đỏ, xuất hiện dòng cảnh báo đỏ rực, và nút "Xác Nhận Xuất Kho" bị mờ đi (`disabled = true`), hoàn toàn không thể click. Khi xóa về `15`, nút lập tức sáng xanh trở lại. Đáp ứng xuất sắc 100% tiêu chí đề bài.

---

### 🔹 PHIÊN 5: Thiết Kế Modal In Phiếu Kho Chuẩn Mẫu 02-VT (Printable Accounting Voucher)

* **Mục tiêu:** Tạo chứng từ kế toán chuyên nghiệp ngay sau khi hoàn tất giao dịch, có thể in ấn trực tiếp ra giấy A4/A5.
* **Người thực hiện:** Nguyễn Hoàng Anh

#### 💬 Câu lệnh Prompt gửi AI:
```text
Hãy viết hàm showVoucherModal(logData) và closeVoucherModal() để hiển thị chứng từ kế toán trong modal:
1. Phiếu kho phải mô phỏng chuẩn "Mẫu số 02 - VT" ban hành theo Thông tư 200/2014/TT-BTC của Bộ Tài Chính:
   - Tiêu đề: PHIẾU XUẤT KHO / PHIẾU NHẬP KHO.
   - Số phiếu: Tự sinh mã PXK-[timestamp] hoặc PNK-[timestamp].
   - Thông tin: Ngày giờ lập phiếu, Họ tên người giao/nhận, Đơn vị/Đối tác, Lý do xuất/nhập, Kho nhận/xuất.
   - Bảng kê chi tiết: STT, Mã vật tư, Tên quy cách vật tư, Đơn vị tính, Số lượng, Đơn giá, Thành tiền.
   - Dòng tổng cộng tiền hàng bằng số và ghi chú bằng chữ.
   - 3 vị trí ký tên: Người lập phiếu, Người giao/nhận hàng, Thủ kho trưởng.
2. Thêm nút "🖨️ In Phiếu" gọi hàm window.print().
3. Nút đóng modal và phím ESC để đóng nhanh.
```

#### 🤖 Kết quả AI phản hồi (Tóm tắt):
AI đã sinh hàm `showVoucherModal(v)` tạo HTML chi tiết cho phiếu in, nhúng bảng danh mục và các vị trí ký tên trang trọng, kết hợp CSS `@media print` hoạt động trơn tru.

#### 🎯 Tinh chỉnh & Đánh giá của Member 1:
- Bổ sung hàm tính tiền bằng chữ cơ bản hoặc hiển thị tiền tệ định dạng chuẩn Việt Nam `DB.formatCurrency()`.
- Giao diện in xem thử (Print Preview) trên Chrome hiển thị vừa khít trang giấy A4 mà không bị rớt chữ sang trang 2.

---

### 🔹 PHIÊN 6: Kết Nối Liên Trang & Nhận Tham Số `sessionStorage`

* **Mục tiêu:** Cho phép Trang Chủ (Mem 2) và Trang Đối Tác (Mem 5) điều hướng người dùng sang Trang Nhập/Xuất với thông tin đã được chọn sẵn.
* **Người thực hiện:** Nguyễn Hoàng Anh

#### 💬 Câu lệnh Prompt gửi AI:
```text
Hãy viết hàm checkQuickRestockParam() kiểm tra sessionStorage khi load trang operations.html:
1. Trường hợp 1: Nếu có sessionStorage.getItem('QUICK_RESTOCK_ITEM_ID'):
   - Tự động chuyển sang Tab Nhập Kho (switchTab('import')).
   - Chọn đúng itemId trong dropdown #import-item-select.
   - Focus con trỏ chuột vào ô #import-quantity để thủ kho nhập ngay số lượng.
   - Xóa khóa sessionStorage.removeItem('QUICK_RESTOCK_ITEM_ID') để tránh lặp lại khi F5.
2. Trường hợp 2: Nếu có sessionStorage.getItem('PRESELECT_SUPPLIER_NAME'):
   - Tự động chuyển sang Tab Nhập Kho.
   - Tìm và chọn đúng supplier trong #import-supplier-select.
   - Xóa khóa sessionStorage.removeItem('PRESELECT_SUPPLIER_NAME').
```

#### 🤖 Kết quả AI phản hồi & Tinh chỉnh:
- Hàm hoạt động chuẩn xác: Khi từ Trang Chủ click vào ô kệ kho màu đỏ, hệ thống tự động nhảy sang `operations.html`, tab Nhập kho mở sẵn và vật tư đó đã được chọn sẵn trong dropdown.

---

## III. TỔNG KẾT & BẢNG ĐÁNH GIÁ NGHIỆM THU (DEFINITION OF DONE)

| Tiêu chuẩn nghiệm thu | Yêu cầu kỹ thuật | Kết quả đạt được | Đánh giá |
| :--- | :--- | :--- | :---: |
| **Kiểm tra HTML5 min/max** | Ô xuất kho có `min="1"` và `max="item.quantity"` | Tự động cập nhật thuộc tính `max` theo vật tư được chọn | ✅ Đạt 10/10 |
| **Chặn xuất âm kho** | Khóa nút submit nếu xuất > tồn, viền rung đỏ | `disabled = true`, class `.input-error` rung lắc tức thì | ✅ Đạt 10/10 |
| **In chứng từ kế toán** | In phiếu kho Mẫu 02-VT chuẩn khổ A4/A5 | Modal hiển thị đẹp mắt, nút in kích hoạt `window.print()` | ✅ Đạt 10/10 |
| **Tách biệt CSS cá nhân** | Toàn bộ style nằm trong `operations.css` | Không sửa 1 dòng nào trong `common.css` | ✅ Đạt 10/10 |
| **Quy tắc Git Zero-Conflict** | Chỉ sửa `operations.html`, `.css`, `.js` | Push lên `feature/member-1-operations` 0% conflict | ✅ Đạt 10/10 |
| **Lỗi Console trình duyệt** | F12 DevTools Console không có lỗi đỏ | 0 Warning, 0 Error | ✅ Đạt 10/10 |

---
*Xác nhận của Trưởng nhóm:* **Nguyễn Hoàng Anh (Đã ký duyệt)**
