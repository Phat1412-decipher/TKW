# 📑 NHẬT KÝ TƯƠNG TÁC AI (PROMPT LOG) — MEMBER 2

> **Học phần:** Thiết Kế & Phát Triển Web (TKW)  
> **Dự án:** Hệ Thống Quản Lý Kho & Kiểm Kê Vật Tư Thông Minh (**Smart Kho ERP**)  
> **Họ và tên sinh viên:** **Trần Quang Huy**  
> **Vai trò:** **Member 2 — Phụ trách Phân Hệ Tổng Quan & Cảnh Báo Kho (Trang 1)**  
> **Nhánh Git:** `feature/member-2-dashboard`  
> **File phụ trách:** `index.html`, `assets/js/index.js`, `assets/css/index.css`  
> **Công cụ AI Agent sử dụng:** Google Antigravity IDE (AGY)

---

## TỔNG QUAN QUÁ TRÌNH SỬ DỤNG ANTIGRAVITY

Toàn bộ quá trình xây dựng phân hệ **Tổng Quan & Cảnh Báo Tồn Kho (`index.html`)** của Member 2 được thực hiện thông qua **4 bước điều khiển Agent (4 Prompts)** đi từ: **(1) Đọc tài liệu quy tắc & Lập kế hoạch** $\rightarrow$ **(2) Trang bị bộ kỹ năng (Skills) thiết kế UI/UX chuyên sâu** $\rightarrow$ **(3) Triển khai mã nguồn HTML5/CSS3/Vanilla JS** $\rightarrow$ **(4) Tự động mở trình duyệt kiểm thử thực tế (Desktop & Mobile), dò lỗi giao diện và tự động khắc phục**.

---

## CHI TIẾT 4 PROMPT & PHẢN HỒI CỦA ANTIGRAVITY

---

### 🔹 PROMPT 1: Đọc tài liệu quy tắc dự án & Lập kế hoạch thực hiện chi tiết

#### 👤 Prompt của Sinh viên (Member 2 - Trần Quang Huy):
> **"Tôi là member 2, dựa theo các nội dung công việc được phân chia trong file. Đọc file .md, lập kế hoạch thực hiện các việc thật chi tiết."**

#### ⚙️ Quá trình xử lý của Antigravity (Tool Calls):
* **`read_file`**: Đọc tệp `quy_t_c_v_n_h_nh_chu_n_k_thu_t_d_n_smart_kho.md` và `readme.md` trong thư mục dự án.
* **`read_file`**: Kiểm tra các tệp hạ tầng lõi dùng chung (`assets/js/db.js`, `assets/js/layout.js`, `data/seed.json`) để xác định cấu trúc dữ liệu và API.

#### 🤖 Phản hồi của Antigravity:
Antigravity xác nhận vai trò của **Member 2 (Trần Quang Huy)** trên nhánh `feature/member-2-dashboard` và lập bản kế hoạch triển khai chi tiết gồm 5 hạng mục kỹ thuật:

1. **Tuân thủ Quy tắc Phân quyền Tệp (Zero-Conflict File Ownership):**
   * **Nhánh làm việc:** `feature/member-2-dashboard`.
   * **Phạm vi file được phép chỉnh sửa:** `index.html`, `assets/js/index.js`, `assets/css/index.css`.
   * **Không tự ý sửa tầng lõi bất biến:** `db.js`, `layout.js`, `seed.json`.
   * **Quy chuẩn đường dẫn GitHub Pages:** Sử dụng 100% đường dẫn tương đối không có dấu `/` ở đầu (`assets/css/common.css`, `assets/js/index.js`).
2. **Thiết kế Khung Giao diện Trang chủ (`index.html`):**
   * Khởi tạo bộ khung `.app-layout` gồm `#sidebar-container`, `#header-container` (tự động nạp từ `initLayout('index')`) và `<main class="page-content" id="main-content">`.
   * Phân chia bố cục làm 3 tầng thông tin trực quan:
     * **Tầng 1 — 4 Thẻ KPI Thời Gian Thực (`.kpi-grid`):** Tổng Số Mặt Hàng (`#kpi-total-items`), Giá Trị Tài Sản Kho (`#kpi-total-value`), Báo Động Hết Hàng (`#kpi-out-stock` - Đỏ), Cảnh Báo Sắp Hết (`#kpi-low-stock` - Vàng).
     * **Tầng 2 — Sơ Đồ Mặt Bằng Kệ Kho Thông Minh (`#rack-heatmap-grid`):** Lưới 12 ô định vị kệ hàng (IoT Rack Heatmap) kèm thanh chú giải 3 màu trạng thái (`.heatmap-legend-bar`).
     * **Tầng 3 — Khung Chia Đôi 2 Cột (`.dashboard-split-grid`):**
       * *Cột trái (2fr):* Danh sách vật tư nguy cấp dưới định mức tối thiểu (hỗ trợ đồng thời Bảng cuộn ghim tiêu đề `#urgent-table-body` cho Desktop và Danh sách thẻ cảm ứng `#urgent-mobile-list` cho Smartphone).
       * *Cột phải (1fr):* Biểu đồ tròn Phân Bổ Tồn Kho (`<canvas id="donutChart">`), bộ chú giải phần trăm và Thanh Tỷ Lệ An Toàn Kho (`.ratio-progress-bar`).
3. **Kế hoạch Lập trình Nghiệp vụ JavaScript (`assets/js/index.js`):**
   * **Hàm `loadDashboardData()`:** Đọc `DB.getItems()`, tính tổng giá trị tồn kho `qty * priceImport`, phân loại trạng thái qua `DB.getItemStatus(qty, min)` thành 3 nhóm `OUT` (Hết hàng), `LOW` (Sắp hết), `IN_STOCK` (Còn hàng).
   * **Hàm `renderRackHeatmap(items)`:** Render 12 kệ hàng với viền màu trạng thái (`status-safe`, `status-low`, `status-out`). Bấm vào ô kệ bất kỳ sẽ gọi `quickRestock(item.id)` lưu `sessionStorage.setItem('QUICK_RESTOCK_ITEM_ID', item.id)` và chuyển sang `operations.html`.
   * **Hàm `renderUrgentTable(urgentItems)`:** Lọc các mặt hàng có `Tồn <= Định mức`, gắn nhãn `.badge-danger` (Đỏ) / `.badge-warning` (Vàng) và nút 1 chạm **"➕ Nhập hàng ngay"**.
   * **Hàm `renderDonutChart(inStock, lowStock, outStock)`:** Vẽ biểu đồ Donut bằng HTML5 Canvas 2D API thuần (không dùng thư viện ngoài), hỗ trợ màn hình HiDPI/Retina, hoạt họa xoay 60fps và tương tác di chuột nổi lát cắt.
   * **Đồng bộ Realtime đa tab:** Lắng nghe `window.DB.onUpdate(() => loadDashboardData())`.

---

### 🔹 PROMPT 2: Cài đặt và kích hoạt các kỹ năng (Skills) thiết kế Website chuyên nghiệp

#### 👤 Prompt của Sinh viên (Member 2 - Trần Quang Huy):
> **"Hãy cài cho tôi những kỹ năng về website design thích hợp để sử dụng"**

#### ⚙️ Quá trình xử lý của Antigravity (Tool Calls):
* **`read_file`**: Đọc kỹ năng `find-skills` để tìm kiếm bộ kỹ năng thiết kế giao diện Web phù hợp nhất cho hệ thống Dashboard ERP công nghiệp.
* **`run_command`**: Tìm kiếm và cài đặt 3 bộ kỹ năng thiết kế giao diện chuẩn vào hệ thống Agent:
  1. **`frontend-design`**: Kỹ năng định hướng thẩm mỹ giao diện hiện đại, phân cấp Typography (`Plus Jakarta Sans` kết hợp `JetBrains Mono` cho số liệu/mã SKU) và bố cục Dashboard sắc nét.
  2. **`ui-ux-pro-max`**: Kỹ năng thiết kế UI/UX nâng cao cho hệ thống Web/Mobile (bảng màu công nghiệp Slate/Navy `#0f172a`, độ tương phản màu cảnh báo Xanh/Vàng/Đỏ chuẩn WCAG AA/AAA, biểu đồ dữ liệu và vi tương tác).
  3. **`web-design-guidelines`**: Bộ quy chuẩn kiểm định giao diện Web (Accessibility A11y, điều hướng bàn phím `focus-visible`, `tabular-nums` cho cột số liệu, `prefers-reduced-motion`, vùng chạm tối thiểu `42px` trên di động).

#### 🤖 Phản hồi của Antigravity:
* Thông báo đã cài đặt và nạp thành công 3 kỹ năng **`frontend-design`**, **`ui-ux-pro-max`** và **`web-design-guidelines`**.
* Sẵn sàng áp dụng toàn bộ tiêu chuẩn từ 3 bộ kỹ năng này vào quá trình viết code `index.html`, `assets/css/index.css` và `assets/js/index.js` ở bước tiếp theo.

---

### 🔹 PROMPT 3: Triển khai toàn bộ mã nguồn Phân hệ Tổng Quan & Cảnh Báo Kho

#### 👤 Prompt của Sinh viên (Member 2 - Trần Quang Huy):
> **"Tiến hành làm đi"**

#### ⚙️ Quá trình xử lý của Antigravity (Tool Calls):
* **`read_file`**: Đọc nội dung `SKILL.md` của 3 kỹ năng `frontend-design`, `ui-ux-pro-max`, `web-design-guidelines`.
* **`write_file` / `edit_file`**: Xây dựng hoàn chỉnh 3 tệp thuộc phạm vi của Member 2:
  1. **`index.html`**:
     * Tích hợp `.skip-link` (*"Chuyển đến nội dung chính"*), thẻ ngữ nghĩa `<main>`, `<section aria-labelledby="...">` và `aria-live="polite"` cho huy hiệu đếm cảnh báo `#warning-count-badge`.
     * Xây dựng 4 thẻ `.kpi-card` với icon SVG sắc nét.
     * Xây dựng khu vực **Sơ Đồ Mặt Bằng Kệ Kho Thông Minh (`#rack-heatmap-grid`)** và khung 2 cột chứa **Bảng cảnh báo dưới định mức** (Desktop Table + Mobile Card) cùng **Biểu đồ tròn Phân Bổ Tồn Kho (`#donutChart`)**.
  2. **`assets/js/index.js`**:
     * Viết hàm `loadDashboardData()` tính toán chính xác 4 chỉ số KPI và phân nhóm vật tư.
     * Viết hàm `renderRackHeatmap(items)` sử dụng thẻ `<button type="button" class="rack-cell ...">` để người dùng có thể dùng cả chuột lẫn phím `Tab` / `Enter` kích hoạt lệnh nhập hàng nhanh `quickRestock(item.id)`.
     * Viết hàm `renderUrgentTable(urgentItems)` render đồng thời bảng Desktop (`.urgent-desktop-table`) và danh sách thẻ Mobile (`.urgent-mobile-list`).
     * Viết hàm `renderDonutChart(inStock, lowStock, outStock)` bằng **100% HTML5 Canvas 2D thuần**:
       * Tự động nhân tỷ lệ `window.devicePixelRatio` chống mờ trên màn hình Retina/HiDPI.
       * Hoạt họa xoay vòng cung 600ms với hàm easing bậc 3 (`1 - Math.pow(1 - progress, 3)`), đếm số lượng mặt hàng ở tâm biểu đồ.
       * Thuật toán bắt tọa độ cực (`Math.atan2` và bán kính trong/ngoài) khi `onmousemove` / `ontouchstart` để làm phồng lát cắt đang trỏ tới kèm hiệu ứng đổ bóng `shadowBlur`.
       * Cập nhật phần trăm chú giải (`#pct-in-stock`, `#pct-low-stock`, `#pct-out-stock`) và chiều rộng 3 màu của Thanh Tỷ Lệ An Toàn Kho (`.ratio-progress-bar`).
  3. **`assets/css/index.css`**:
     * Áp dụng `font-variant-numeric: tabular-nums` cho toàn bộ số liệu KPI, số lượng tồn kho và mã kệ.
     * Thiết kế `.urgent-scroll-viewport` (`max-height: 310px`, `overflow-y: auto`) với `thead { position: sticky; top: 0; }`.
     * Thiết lập hệ thống `@media` responsive cho các mốc `1280px`, `992px`, `768px`, `420px`.

#### 🤖 Phản hồi của Antigravity:
* Báo cáo đã hoàn thành việc xây dựng `index.html`, `assets/js/index.js` và `assets/css/index.css` theo đúng kế hoạch và bộ quy chuẩn thiết kế Web.
* Thực hiện lưu commit tính năng trên nhánh `feature/member-2-dashboard`:
  * `feat(member-2): build dashboard site (KPI, IoT rack heatmap, urgent alerts, donut chart)` (`0a9637e`)
  * `ui(member-2): nang cap giao dien KPI, IoT rack heatmap, donut chart tooltip va responsive mobile/desktop` (`b96198f`)

---

### 🔹 PROMPT 4: Mở Browser kiểm thử thực tế trên Máy tính & Điện thoại, tự phát hiện lỗi và sửa lỗi

#### 👤 Prompt của Sinh viên (Member 2 - Trần Quang Huy):
> **"Mở trang này trên browser, kiểm tra thực tế trên cả màn hình máy tính và điện thoại, tìm lỗi giao diện, nút không bấm được, chữ bị tràn, tự sửa rồi kiểm tra lại."**

#### ⚙️ Quá trình xử lý của Antigravity (Tool Calls):
1. **Khởi chạy máy chủ nội bộ & Mở trình duyệt kiểm thử (`run_command` & `invoke_subagent: browser`):**
   * Khởi chạy Local HTTP Server tại thư mục dự án và điều hướng Browser Subagent mở trang `index.html`.
2. **Kiểm thử trên màn hình Máy tính (Desktop Viewport `1280x800` & `1440x900`):**
   * Kiểm tra 4 thẻ KPI, rê chuột lên biểu đồ Donut Canvas, cuộn bảng cảnh báo và bấm thử vào ô kệ `Kệ A1-02` trên Heatmap cũng như nút **"➕ Nhập hàng ngay"** (xác nhận điều hướng sang `operations.html` và tự điền vật tư hoạt động mượt mà).
3. **Kiểm thử trên màn hình Điện thoại (Mobile Viewport `390x844` - iPhone & `360x800` - Android):**
   * Kiểm tra chế độ tự động ẩn bảng Desktop và chuyển sang danh sách thẻ `.urgent-mobile-card`, mở menu Sidebar trượt ngang và thanh điều hướng đáy `.mobile-bottom-nav`.
4. **Phát hiện 2 điểm cần khắc phục qua kiểm thử trực quan trên Browser:**
   * **Lỗi 1 (Tràn chữ số tiền lớn trên thẻ KPI):** Khi tổng giá trị tài sản kho hiển thị chuỗi tiền tệ dài (ví dụ `196.150.000 ₫`), kích thước font cố định `23px` của `.kpi-value` trên màn hình Laptop `1280px` hơi lớn khiến dòng tiền tệ sát lề phải của thẻ KPI.
   * **Lỗi 2 (Độ tương phản nút Trạm Quét Barcode IoT trên Header):** Nút `.iot-scanner-trigger-btn` trên thanh Header cần nền tối sâu và viền xanh Cyan nổi bật hơn để không bị chìm trên nền Header sáng.
5. **Tự động sửa lỗi trong `assets/css/index.css` (`edit_file`):**
   * Bổ sung quy tắc co giãn kích thước chữ tự động bằng hàm `clamp()` cho `.kpi-value` và nâng cấp độ tương phản cho `.iot-scanner-trigger-btn` ở cuối file `assets/css/index.css` (dòng 2899–2913):
     ```css
     /* Đảm bảo số tiền lớn trên thẻ KPI và nút Header hiển thị rõ nét không bị tràn ở mọi màn hình */
     .kpi-value {
       font-size: clamp(16.5px, 1.45vw, 21px) !important;
     }

     .iot-scanner-trigger-btn {
       background: #0f172a !important;
       color: #38bdf8 !important;
       border: 1px solid #0284c7 !important;
     }

     .iot-scanner-trigger-btn:hover {
       background: #0284c7 !important;
       color: #ffffff !important;
     }
     ```
6. **Tải lại trang trên Browser & Kiểm tra nghiệm thu lần 2 (`send_message: browser`):**
   * Kiểm tra lại ở cả 2 chế độ Desktop (`1280px`) và Mobile (`390px`): Số tiền trên thẻ KPI hiển thị gọn gàng trên 1 dòng duy nhất, không còn hiện tượng tràn hay xuống dòng; nút Trạm Quét Barcode IoT có độ tương phản sắc nét; toàn bộ 12 ô kệ Heatmap và nút **"Nhập hàng ngay"** bấm nhạy 100%, Console sạch lỗi (`0 errors`).

#### 🤖 Phản hồi của Antigravity:
* Báo cáo kết quả kiểm thử thực tế trên trình duyệt (kèm đối chiếu trước và sau khi sửa lỗi trên cả màn hình Desktop và Điện thoại).
* Ghi nhận commit hoàn tất bản vá giao diện lên nhánh `feature/member-2-dashboard`:
  * `fix(member-2): toi uu kich thuoc kpi-value va do tuong phan nut header` (`78eb1a4`)

---

## BẢNG TỔNG HỢP KẾT QUẢ & LỊCH SỬ COMMIT THỰC TẾ (`feature/member-2-dashboard`)

| Prompt thực hiện | Mã Commit (Git Hash) | Nội dung Commit được ghi nhận trên Repository | Trạng thái nghiệm thu |
| :---: | :---: | :--- | :---: |
| **Prompt 1 & 2** | `cadb7b6` | `merge: dong bo nhanh main vao feature/member-2-dashboard` | Hoàn thành (100%) |
| **Prompt 3** | `0a9637e` | `feat(member-2): build dashboard site (KPI, IoT rack heatmap, urgent alerts, donut chart)` | Hoàn thành (100%) |
| **Prompt 3** | `b96198f` | `ui(member-2): nang cap giao dien KPI, IoT rack heatmap, donut chart tooltip va responsive mobile/desktop` | Hoàn thành (100%) |
| **Prompt 4** | `dfd35c0` | `sync(member-2): dong bo giao dien va logic index tu tkw-duphong` | Hoàn thành (100%) |
| **Prompt 4** | `78eb1a4` | `fix(member-2): toi uu kich thuoc kpi-value va do tuong phan nut header` | Hoàn thành (100%) |
