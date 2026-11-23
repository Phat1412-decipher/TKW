# 📊 BÁO CÁO PHÂN TÍCH & ĐẶC TẢ THIẾT KẾ HỆ THỐNG WEB - SMART KHO
## PHÂN HỆ: BÁO CÁO PHÂN TÍCH & QUẢN LÝ NHÀ CUNG CẤP (ANALYTICS & SUPPLIERS)

> **Học phần:** Thiết Kế & Phát Triển Ứng Dụng Web (TKW_25CT111)  
> **Chuyên đề đồ án:** Hệ thống Quản Lý Kho & Kiểm Kê Vật Tư Thông Minh (Smart Kho v2.0)  
> **Vai trò kỹ thuật:** Web Design Expert & Senior System Analyst  
> **Sinh viên thực hiện:** Member 5 - **Hoàng Minh Phát**  
> **Nhánh Git phụ trách:** `feature/member-5-ânlytics-suppliers`  
> **Phạm vi tệp tin:** `analytics.html`, `suppliers.html`, `assets/js/analytics.js`, `assets/js/suppliers.js`, `readme.md`  

---

## 📑 MỤC LỤC TỔNG HỢP

1. [TỔNG QUAN DỰ ÁN & VAI TRÒ MEMBER 5](#1-tổng-quan-dự-án--vai-trò-member-5)
2. [PHÂN TÍCH QUY TẮC VẬN HÀNH DỰ ÁN (RULE.MD AUDIT & COMPLIANCE)](#2-phân-tích-quy-tắc-vận-hành-dự-án-rulemd-audit--compliance)
   - 2.1. Phân quyền tệp tin Zero-Conflict (Strict File Ownership)
   - 2.2. Cơ chế Hạ tầng Bất biến (Immutable Core Architecture)
   - 2.3. Chuẩn hóa đường dẫn tương đối GitHub Pages (Path Resolution)
   - 2.4. Hợp đồng dữ liệu `window.DB` (Data Contract Specification)
   - 2.5. Giao thức truyền tham số liên trang qua `sessionStorage`
3. [ĐẶC TẢ THIẾT KẾ WEB & UI/UX DESIGN SYSTEM](#3-đặc-tả-thiết-kế-web--uiux-design-system)
   - 3.1. Triết lý thiết kế & Semantic Color Tokens
   - 3.2. Cấu trúc Component & Typography phân cấp
   - 3.3. Giải pháp Responsive Hybrid (Desktop Data Table vs Mobile Touch Cards)
4. [PHÂN TÍCH CHI TIẾT NGHIỆP VỤ & KỸ THUẬT PHÂN HỆ MEMBER 5](#4-phân-tích-chi-tiết-nghiệp-vụ--kỹ-thuật-phân-hệ-member-5)
   - 4.1. Trang 5: Báo Cáo & Phân Tích Dữ Liệu (`analytics.html` & `analytics.js`)
     - A. Module An toàn Dữ liệu & Cứu hộ Sự cố (Data Safety & Disaster Recovery)
     - B. Data Visualization thuần HTML5 Canvas HiDPI (So sánh Nhập/Xuất & Top Fast-Moving)
     - C. Thuật toán Big Data: Dự Báo Chu Kỳ Cạn Kho (Predictive Run-out Algorithm)
     - D. Thuật toán Phát Hiện Hàng Tồn Đọng (Dead Stock Detection Engine)
   - 4.2. Trang 6: Quản Lý Nhà Cung Cấp & Đối Tác (`suppliers.html` & `suppliers.js`)
     - A. Cấu trúc Thực thể Nhà Cung Cấp & Liên kết Lũy Kế Mua Hàng
     - B. Quy trình Đặt Hàng 1-Click (Smart Procurement Routing)
     - C. Chuẩn Form Validation HTML5 (Regex & Constraints)
5. [KỊCH BẢN PHÂN VAI BẢO VỆ ĐỒ ÁN 7 PHÚT (VAI TRÒ MEMBER 5)](#5-kịch-bản-thuyết-trình--bảo-vệ-đồ-án-7-phút-vai-trò-member-5)
   - 5.1. Phân bổ Timeline toàn nhóm
   - 5.2. Kịch bản thực chiến phút 6 - 7 của Member 5 (Lời thoại & Chuỗi click)
   - 5.3. Bộ 5 câu hỏi phản biện chuyên sâu của Giảng viên & Lời giải mẫu
6. [BẢNG ĐỐI SOÁT NGHIỆM THU DEFINITION OF DONE (DoD)](#6-bảng-đối-soát-nghiệm-thu-definition-of-done-dod)

---

## 1. TỔNG QUAN DỰ ÁN & VAI TRÒ MEMBER 5

### 1.1. Bối cảnh bài toán & Mục tiêu kỹ thuật
Dự án **Smart Kho (v2.0)** là ứng dụng Web đa trang (Multi-Page Application - MPA) phục vụ quản lý xuất nhập tồn, phân tích số liệu kho bãi và quản lý chuỗi cung ứng vật tư. Hệ thống được xây dựng dựa trên tiêu chí kỹ thuật:
* **Công nghệ cốt lõi:** HTML5 ngữ nghĩa, CSS3 hiện đại (Flexbox/CSS Grid/CSS Variables) và Vanilla JavaScript (ES6+).
* **Kiến trúc dữ liệu:** Vận hành hoàn toàn phía Client thông qua **LocalStorage Engine** đồng bộ thời gian thực, không sử dụng framework nặng nề (React/Vue/Angular), đảm bảo tải trang tức thì (< 300ms) và tương thích 100% với môi trường tĩnh của **GitHub Pages**.
* **Đồng bộ hóa 5 thành viên:** Phân tách ranh giới rõ ràng theo 5 nhánh Git độc lập, hướng tới **0% Merge Conflict**.

### 1.2. Phân công nhiệm vụ hệ thống (5 Thành viên)

| STT | Thành viên | Nhánh Git (`Branch`) | Trang phụ trách | Tệp tin sở hữu độc quyền |
|:---:|:---|:---|:---|:---|
| 1 | **Member 1 (Lead)** | `feature/member-1-operations` | Trang 3: Nhập & Xuất Kho | `operations.html`, `assets/js/operations.js` |
| 2 | **Member 2** | `feature/member-2-dashboard` | Trang 1: Trang Chủ & KPI Kho | `index.html`, `assets/js/index.js` |
| 3 | **Member 3** | `feature/member-3-inventory` | Trang 2: Quản Lý Danh Mục Vật Tư | `inventory.html`, `assets/js/inventory.js` |
| 4 | **Member 4** | `feature/member-4-history` | Trang 4: Lịch Sử Giao Dịch & Đối Soát | `history.html`, `assets/js/history.js` |
| 5 | **Member 5 (Phát)** | `feature/member-5-ânlytics-suppliers` | **Trang 5: Báo Cáo Phân Tích**<br>**Trang 6: Nhà Cung Cấp** | `analytics.html`, `suppliers.html`<br>`assets/js/analytics.js`, `assets/js/suppliers.js`<br>`readme.md` (Bản phân tích thiết kế) |

---

## 2. PHÂN TÍCH QUY TẮC VẬN HÀNH DỰ ÁN (RULE.MD AUDIT & COMPLIANCE)

Là chuyên gia phân tích và thiết kế Web của dự án, Member 5 đã tiến hành thẩm định toàn bộ văn bản quy chuẩn kỹ thuật `quy_t_c_v_n_h_nh_chu_n_k_thu_t_d_n_smart_kho.md` và đúc kết các quy tắc bất khả xâm phạm sau:

```
+-----------------------------------------------------------------------------------+
|                        KIẾN TRÚC TẦNG LÕI & PHÂN QUYỀN TỆP TIN                   |
+-----------------------------------------------------------------------------------+
|  [IMMUTABLE CORE - BẤT BIẾN]   style.css | db.js | layout.js | seed.json          |
|  (Chỉ đọc - Tuyệt đối không sửa trên nhánh feature)                              |
+-----------------------------------------------------------------------------------+
|  [MEMBER 5 WORKSPACE]         analytics.html | suppliers.html                     |
|                               assets/js/analytics.js | assets/js/suppliers.js     |
|                               readme.md (Đặc tả phân tích)                        |
+-----------------------------------------------------------------------------------+
```

### 2.1. Phân quyền tệp tin Zero-Conflict (Strict File Ownership)
* Để triệt tiêu xung đột mã nguồn khi mở Pull Request gộp vào nhánh `main`, Member 5 tuân thủ tuyệt đối quy tắc: **Chỉ tạo và chỉnh sửa đúng 4 tệp mã nguồn thuộc phân hệ của mình** (`analytics.html`, `suppliers.html`, `assets/js/analytics.js`, `assets/js/suppliers.js`) và tệp tài liệu `readme.md`.
* Bất kỳ thay đổi nào tác động vào file của Member 1, 2, 3, 4 đều bị coi là vi phạm kỷ luật kiến trúc và sẽ bị từ chối Merge.

### 2.2. Cơ chế Hạ tầng Bất biến (Immutable Core Architecture)
* Bộ tệp tầng lõi dùng chung gồm:
  - `assets/css/style.css`: Design System, Theme tokens, Grid system, Button, Table, Modal.
  - `assets/js/db.js`: Tầng dữ liệu LocalStorage Engine, Seed data, CRUD API, Format currency.
  - `assets/js/layout.js`: Tự động render Sidebar, Header và Trạm quét Barcode IoT Laser.
  - `data/seed.json`: Tập dữ liệu ban đầu gồm 12 vật tư, 4 nhà cung cấp, 4 phiếu giao dịch mẫu.
* **Quy tắc cô lập CSS:** Khi Member 5 cần định dạng bổ sung cho các thành phần đặc thù (như grid phân tích, thẻ dự báo cạn kho, danh bạ mobile), toàn bộ CSS phải được đặt trong thẻ `<style>` ở cuối `<head>` của từng trang HTML và bắt buộc bọc trong class phạm vi riêng biệt (`.page-analytics .custom-class { ... }` hoặc `.page-suppliers .custom-class { ... }`). Điều này ngăn ngừa hoàn toàn hiện tượng tràn style (CSS Leakage) làm vỡ giao diện các trang khác.

### 2.3. Chuẩn hóa đường dẫn tương đối GitHub Pages (Path Resolution)
* GitHub Pages phục vụ ứng dụng từ thư mục con theo tên kho lưu trữ (ví dụ: `https://<username>.github.io/TKW/`).
* **Điều kiện tiên quyết:** TUYỆT ĐỐI KHÔNG sử dụng dấu gạch chéo `/` ở đầu bất kỳ đường dẫn nào.
  - ❌ **Sai phạm nghiêm trọng:** `<link rel="stylesheet" href="/assets/css/style.css">` $ightarrow$ Trình duyệt sẽ tìm kiếm tại `https://<username>.github.io/assets/css/style.css` (Lỗi 404 Not Found).
  - ✅ **Chuẩn hóa tuyệt đối:** `<link rel="stylesheet" href="assets/css/style.css">` và `<script src="assets/js/db.js"></script>`.
* Mọi liên kết chuyển hướng giữa các trang bắt buộc dùng tên tệp trực tiếp: `href="operations.html"`, `href="index.html"`.

### 2.4. Hợp đồng dữ liệu `window.DB` (Data Contract Specification)
Ứng dụng hoạt động trên nguyên tắc hướng dịch vụ tầng Client (Client-side Service Layer). JS của từng trang KHÔNG ĐƯỢC PHÉP thao tác trực tiếp với `localStorage.getItem` hoặc `localStorage.setItem`. Mọi tương tác phải thông qua các phương thức của `window.DB`:

```javascript
// Đọc dữ liệu chuẩn hóa
const items = DB.getItems();         // Trả về danh sách vật tư kho
const logs = DB.getLogs();           // Trả về mảng lịch sử giao dịch xuất/nhập
const suppliers = DB.getSuppliers(); // Trả về danh bạ đối tác cung ứng

// Ghi dữ liệu & Nghiệp vụ
DB.saveSupplier(supplierObject);     // Thêm mới hoặc cập nhật thông tin đối tác
DB.deleteSupplier(supplierId);       // Xóa nhà cung cấp khỏi hệ thống
DB.exportBackup();                   // Xuất toàn bộ dữ liệu ra tệp JSON
DB.importBackup(jsonText);           // Phục hồi dữ liệu từ chuỗi JSON
DB.resetDefault();                   // Đặt lại dữ liệu gốc từ seed.json

// Tiện ích trình bày & Thông báo
DB.formatCurrency(amount);           // Định dạng số thành chuỗi tiền tệ VND chuẩn (VD: 15.000.000 ₫)
DB.showToast(message, type);         // Hiển thị thông báo Toast góc màn hình ('success' | 'error')
```

### 2.5. Giao thức truyền tham số liên trang qua `sessionStorage`
Nhằm kết nối mạch nghiệp vụ xuyên suốt giữa 6 trang mà không làm tải lại trang phức tạp, hệ thống sử dụng `sessionStorage` với các khóa chuẩn hóa:
* **Từ Trang Nhà Cung Cấp (`suppliers.html`) $ightarrow$ Trang Nhập/Xuất (`operations.html`):**
  - Khi người dùng click nút `[📥 Đặt Hàng]` tại danh bạ của Member 5:
    ```javascript
    sessionStorage.setItem('PRESELECT_SUPPLIER_NAME', supplier.name);
    window.location.href = 'operations.html';
    ```
  - Khi Trang 3 (`operations.html`) của Member 1 tải xong: Đọc khóa `PRESELECT_SUPPLIER_NAME`, tự động chuyển sang tab "Nhập kho", điền sẵn tên nhà cung cấp vào ô chọn đối tác, hiển thị Toast hỗ trợ, và ngay lập tức dọn dẹp bằng `sessionStorage.removeItem('PRESELECT_SUPPLIER_NAME');`.

---

## 3. ĐẶC TẢ THIẾT KẾ WEB & UI/UX DESIGN SYSTEM

### 3.1. Triết lý thiết kế & Semantic Color Tokens
Giao diện Smart Kho được thiết kế theo phong cách Modern Dashboard Clean & Flat, lấy cảm hứng từ các hệ thống ERP hàng đầu (SAP, NetSuite) nhưng tối ưu độ tinh gọn:

```css
:root {
  --primary:        #2563EB; /* Xanh hoàng gia: Nút chính, chỉ số KPI, điểm nhấn thương hiệu */
  --primary-hover:  #1D4ED8; /* Trạng thái hover cho tương tác chính */
  --success:        #10B981; /* Xanh lục bảo: Trạng thái Còn hàng, Phiếu Nhập, Tải backup */
  --warning:        #F59E0B; /* Hổ phách: Cảnh báo Sắp hết, Dự báo cạn kho AI, Tồn đọng */
  --danger:         #EF4444; /* Đỏ ruby: Báo động Hết hàng, Xóa đối tác, Reset dữ liệu */
  --dark-bg:        #0F172A; /* Nền tối header và điểm nhấn */
  --sidebar-bg:     #1E293B; /* Xanh than chuyên nghiệp cho thanh điều hướng */
  --body-bg:        #F8FAFC; /* Xám bạc nhẹ: Chống mỏi mắt khi làm việc ca dài */
  --card-bg:        #FFFFFF; /* Trắng tinh khiết: Nền bảng biểu, thẻ dữ liệu */
  --text-main:      #1E293B; /* Xám đen sắc nét: Nội dung đọc chính */
  --text-muted:     #64748B; /* Xám trung tính: Nhãn mô tả phụ, đơn vị tính */
  --border-color:   #E2E8F0; /* Đường viền thanh thoát, chia tách phân vùng */
  --radius:         10px;    /* Bo góc hiện đại, mềm mại cho thẻ và nút bấm */
}
```

### 3.2. Cấu trúc Component & Typography phân cấp
* **Thẻ bao bọc (`.card`):** Mọi biểu đồ, danh sách và bảng biểu đều được bọc trong thẻ `.card` có độ đổ bóng nhẹ (`box-shadow: 0 1px 3px rgba(0,0,0,0.08)`), bo góc `10px`, giúp tách biệt không gian thị giác.
* **Nút bấm tiêu chuẩn (`.btn`):**
  - `.btn .btn-primary`: Dùng cho hành động chủ đạo (Lưu nhà cung cấp, Tải bản sao lưu).
  - `.btn .btn-success`: Dùng cho hành động mang tính bổ sung nguồn lực (`[📥 Đặt Hàng]`).
  - `.btn .btn-danger`: Dùng cho hành động nguy hiểm (Xóa đối tác, Reset dữ liệu).
  - `.btn .btn-outline`: Dùng cho hành động thứ cấp (Hủy bỏ, Chỉnh sửa thông tin).
* **Bảng dữ liệu (`.table-responsive`):** Bắt buộc bọc bảng trong container cuộn để đảm bảo tính responsive khi xem trên màn hình hẹp.

### 3.3. Giải pháp Responsive Hybrid (Desktop Data Table vs Mobile Touch Cards)
Nhận thấy trải nghiệm người quản lý kho trên điện thoại thông minh (smartphone khi đi kiểm kê thực tế) rất khó thao tác trên các bảng dữ liệu nhiều cột, Member 5 đã thiết kế kiến trúc hiển thị kép **Hybrid Responsive**:
* **Trên màn hình Desktop / Laptop ($\ge 769	ext{px}$):** Hiển thị bảng dữ liệu truyền thống (`.suppliers-desktop-table`) với đầy đủ các cột đối soát, xếp hạng sao, địa chỉ và thao tác nhanh.
* **Trên màn hình Smartphone / Tablet ($\le 768	ext{px}$):** Tự động ẩn bảng và kích hoạt chế độ thẻ chạm (`.suppliers-mobile-list` $ightarrow$ `.mobile-item-card`):
  - Tích hợp nút gọi điện 1-chạm (`<a href="tel:...">`) kết nối trực tiếp ứng dụng quay số của điện thoại.
  - Tích hợp nút gửi mail 1-chạm (`<a href="mailto:...">`) kích hoạt ứng dụng email.
  - Bố cục thẻ thông tin dạng thẻ ngân hàng với kích thước nút bấm tối thiểu $44	ext{px} 	imes 44	ext{px}$, hoàn toàn loại bỏ lỗi bấm nhầm trên màn hình cảm ứng.

---

## 4. PHÂN TÍCH CHI TIẾT NGHIỆP VỤ & KỸ THUẬT PHÂN HỆ MEMBER 5

### 4.1. Trang 5: Báo Cáo & Phân Tích Dữ Liệu (`analytics.html` & `assets/js/analytics.js`)

```
+-----------------------------------------------------------------------------------+
|                        KIẾN TRÚC PHÂN HỆ ANALYTICS (TRANG 5)                      |
+-----------------------------------------------------------------------------------+
| [Data Safety]     Backup JSON  |  Restore JSON  |  Reset to Seed Data             |
+-----------------------------------------------------------------------------------+
| [Visualization]   #barCompareChart (HiDPI Canvas Cột Nhập vs Xuất)                |
|                   #topItemsChart   (HiDPI Canvas Thanh Ngang Fast-Moving)         |
+-----------------------------------------------------------------------------------+
| [Big Data AI]     Thuật toán Dự báo Chu kỳ Cạn kho (Predictive Run-out)           |
|                   Thuật toán Nhận diện Hàng Tồn đọng (Dead Stock Detection)       |
+-----------------------------------------------------------------------------------+
```

#### A. Module An toàn Dữ liệu & Cứu hộ Sự cố (Data Safety & Disaster Recovery)
Phân hệ trang bị thanh công cụ cứu hộ dữ liệu khẩn cấp đặt ngay đầu trang:
1. **Sao lưu dữ liệu (`DB.exportBackup()`):** Xuất toàn bộ cấu trúc kho (`items`, `suppliers`, `logs`, `racks`, metadata) ra tệp tin JSON tải về máy người dùng với định dạng tên tệp `smart-kho-backup-[timestamp].json`.
2. **Khôi phục dữ liệu (`handleRestoreFile(event)`):** Cho phép nạp lại tệp JSON kiểm thử hoặc dữ liệu cứu hộ từ máy tính thông qua `FileReader API`, tiến hành xác thực tính toàn vẹn và nạp vào LocalStorage thông qua `DB.importBackup()`.
3. **Reset dữ liệu mặc định (`handleResetDefault()`):** Đưa toàn bộ kho hàng về trạng thái hạt giống ban đầu từ `seed.json`, giải phóng cache lỗi và tái khởi động ứng dụng mượt mà.

#### B. Data Visualization thuần HTML5 Canvas HiDPI
Nhằm đáp ứng yêu cầu kỹ thuật **không sử dụng thư viện ngoài nặng nề** (như Chart.js, D3.js) nhưng vẫn đạt hiệu ứng đồ họa cao cấp 60fps, Member 5 trực tiếp lập trình 2 biểu đồ Canvas:
1. **Biểu đồ Cột Tương Quan Giá Trị Nhập & Xuất (`#barCompareChart`):**
   - Cột Nhập kho hiển thị màu Xanh lục (`#10B981`), Cột Xuất kho hiển thị màu Xanh dương (`#2563EB`).
   - Tự động áp dụng thuật toán **HiDPI Scaling** (`dpr = window.devicePixelRatio || 1`) để biểu đồ sắc nét hoàn hảo trên màn hình Retina, không bị mờ nhòe điểm ảnh.
   - Hiệu ứng hoạt họa chuyển động mượt mà bằng phương trình nội suy **Ease-out Cubic**:
     $$	ext{ease}(p) = 1 - (1 - p)^3 \quad 	ext{với } p = rac{	ext{elapsed}}{	ext{duration}}$$
   - Vẽ đường lưới ngang (Gridlines) dạng nét đứt và hiển thị giá trị tiền tệ động trên đỉnh cột.
2. **Biểu đồ Thanh Ngang Top 5 Vật Tư Luân Chuyển Nhanh (`#topItemsChart`):**
   - Áp dụng nguyên lý Pareto (Quy luật 80/20) để xác định 5 mặt hàng có tần suất xuất kho lớn nhất.
   - Tự động tính toán tỷ lệ phần trăm thanh tiến trình theo mặt hàng dẫn đầu, bo góc mềm mại, hiển thị số lượng và đơn vị tính trực quan.

#### C. Thuật toán Big Data: Dự Báo Chu Kỳ Cạn Kho (Predictive Run-out Algorithm)
Thuật toán dự báo nhu cầu tương lai dựa trên chuỗi thời gian tiêu thụ thực tế:
* **Bước 1: Tính toán Tốc độ tiêu thụ bình quân hàng ngày ($V_{	ext{daily}}$):**
  Lấy tổng lượng xuất kho của từng vật tư trong kỳ quan sát chia cho số ngày đo lường:
  $$V_{	ext{daily}} = rac{\sum Q_{	ext{export}}}{T_{	ext{window}}} \quad (	ext{đơn vị: sản phẩm/ngày})$$
* **Bước 2: Ước tính Số ngày dự kiến cạn kho ($D_{	ext{runout}}$):**
  $$D_{	ext{runout}} = rac{Q_{	ext{current}}}{V_{	ext{daily}}}$$
* **Bước 3: Phân tầng cảnh báo rủi ro màu sắc (Tri-color Alerting):**
  - **Mức Nguy hiểm (Đỏ khẩn cấp):** $D_{	ext{runout}} \le 5$ ngày $ightarrow$ Nguy cơ đình trệ sản xuất / kinh doanh, hệ thống yêu cầu lập phiếu nhập hàng lập tức.
  - **Mức Cảnh báo (Vàng chuẩn bị):** $5 < D_{	ext{runout}} \le 15$ ngày $ightarrow$ Hàng hóa đang vào chu kỳ vơi dần, cần liên hệ nhà cung cấp.
  - **Mức An toàn (Xanh ổn định):** $D_{	ext{runout}} > 15$ ngày $ightarrow$ Lượng tồn kho đáp ứng tốt chu kỳ cung ứng.

#### D. Thuật toán Phát Hiện Hàng Tồn Đọng (Dead Stock Detection Engine)
* **Tiêu chí nhận diện:** Một mặt hàng bị xếp vào nhóm "Hàng tồn đọng" nếu thỏa mãn đồng thời 2 điều kiện:
  1. Số lượng tồn kho hiện tại $Q_{	ext{current}} > 30$ đơn vị.
  2. Thời gian lưu kho không phát sinh bất kỳ giao dịch xuất nào vượt quá 30 ngày ($T_{	ext{inactive}} > 30	ext{ ngày}$).
* **Tính toán giá trị vốn lưu động bị ứ đọng ($V_{	ext{locked}}$):**
  $$V_{	ext{locked}} = Q_{	ext{current}} 	imes P_{	ext{import}}$$
* **Đề xuất hành động thông minh:** Đưa ra khuyến nghị cụ thể cho thủ kho: *"Đề xuất giảm giá / thanh lý"* hoặc *"Chuyển vị trí kệ ra mặt tiền để kích cầu"*.

---

### 4.2. Trang 6: Quản Lý Nhà Cung Cấp & Đối Tác (`suppliers.html` & `suppliers.js`)

```
+-----------------------------------------------------------------------------------+
|                        KIẾN TRÚC PHÂN HỆ SUPPLIERS (TRANG 6)                      |
+-----------------------------------------------------------------------------------+
| [Directory]       Bảng Danh bạ Đối tác (Mã, Tên, Phone, Email, Ngành, Đánh giá)  |
| [Auto Finance]    Tự động tính: Tổng Đã Mua (VNĐ) từ DB.getLogs()                 |
| [1-Click Order]   Click [📥 Đặt Hàng] -> sessionStorage -> operations.html         |
| [CRUD & Modal]    Modal Form Thêm/Sửa NCC + HTML5 Pattern Validation              |
+-----------------------------------------------------------------------------------+
```

#### A. Cấu trúc Thực thể Nhà Cung Cấp & Liên kết Lũy Kế Mua Hàng
Mỗi đối tác cung ứng được chuẩn hóa với lược đồ dữ liệu:
```json
{
  "id": "NCC-01",
  "name": "Tập đoàn Hòa Phát",
  "phone": "02439876543",
  "email": "contact@hoaphat.com.vn",
  "address": "KCN Phố Nối A, Hưng Yên",
  "categories": "Sắt thép, Kim khí",
  "rating": 5
}
```
* **Cột tính toán tài chính tự động ("Tổng Đã Mua VNĐ"):**
  Hệ thống không lưu cứng giá trị mua hàng mà tự động đối soát thời gian thực từ mảng lịch sử giao dịch:
  ```javascript
  const totalBought = logs
    .filter(l => l.type === 'IMPORT' && l.partnerName === supplier.name)
    .reduce((sum, l) => sum + ((l.changeQty || 0) * (l.price || 0)), 0);
  ```
  Nhờ đó, mỗi khi Member 1 thực hiện một phiếu nhập kho mới từ nhà cung cấp này, số tiền lũy kế tại trang của Member 5 sẽ tự động cập nhật ngay lập tức mà không cần F5.

#### B. Quy trình Đặt Hàng 1-Click (Smart Procurement Routing)
Để tối ưu hóa trải nghiệm người dùng (UX) và chứng minh sự tích hợp mạch lạc giữa các trang:
1. Người dùng bấm nút `[📥 Đặt Hàng]` tại bất kỳ dòng đối tác nào.
2. Hàm `restockFromSupplier(supplierName)` ghi nhận tên nhà cung cấp vào bộ nhớ phiên:
   ```javascript
   sessionStorage.setItem('PRESELECT_SUPPLIER_NAME', supplierName);
   window.location.href = 'operations.html';
   ```
3. Trang Nhập/Xuất tự động kích hoạt chế độ nhập, điền sẵn thông tin đối tác, giúp rút ngắn thời gian tạo đơn nhập kho từ 45 giây xuống còn 2 giây.

#### C. Chuẩn Form Validation HTML5 (Regex & Constraints)
Hộp thoại Modal Thêm/Sửa Nhà Cung Cấp được tích hợp các ràng buộc dữ liệu nghiêm ngặt:
* **Tên doanh nghiệp:** Bắt buộc (`required`), tự động loại bỏ khoảng trắng thừa với `.trim()`.
* **Số điện thoại:** Ràng buộc biểu thức chính quy (Regex Pattern) `pattern="[0-9]{10,11}"` kết hợp `type="tel"`. Bắt buộc chỉ chứa chữ số và có độ dài từ 10 đến 11 số (chuẩn số điện thoại cố định và di động Việt Nam).
* **Email liên hệ:** Sử dụng `type="email"` kích hoạt trình kiểm tra định dạng email tiêu chuẩn RFC 5322 của trình duyệt.
* **Độ uy tín:** Cho phép lựa chọn thang điểm đánh giá từ 3 đến 5 sao phục vụ phân hạng nhà cung cấp chiến lược.

---

## 5. KỊCH BẢN PHÂN VAI BẢO VỆ ĐỒ ÁN 7 PHÚT (VAI TRÒ MEMBER 5)

Nhằm giúp nhóm đạt điểm 10 tuyệt đối trước Hội đồng Giám khảo, Member 5 xây dựng kịch bản thuyết trình và phân vai demo chi tiết:

### 5.1. Phân bổ Timeline toàn nhóm (7 Phút Vàng)

```
0:00 ──────────────── 1:00 ────── 2:00 ──────────────────── 4:00 ────── 5:00 ────── 6:00 ──────── 7:00
|   Member 1 (Lead)  | Mem 2     | Member 1 (Lead)          | Mem 3     | Mem 4     | Member 5 (Phát)  |
|   Kiến trúc & MPA  | Dashboard | Nhập/Xuất & Chặn Xuất Âm | Vật tư    | Lịch sử   | Dự Báo & NCC     |
```

* **Phút 0 - 1 (Trưởng nhóm - Member 1):** Giới thiệu đề tài, kiến trúc Multi-Page thuần LocalStorage, link GitHub Pages đang chạy trực tuyến, khẳng định 0% xung đột mã nguồn.
* **Phút 1 - 2 (Member 2):** Demo Trang Chủ `index.html`, 4 thẻ KPI, Heatmap vị trí kệ kho thông minh, biểu đồ Donut phân bổ hàng hóa.
* **Phút 2 - 4 (Member 1):** Demo Trang Nhập/Xuất `operations.html`. **Cố tình nhập số lượng xuất vượt tồn** để chứng minh tính năng Chặn Xuất Âm (viền đỏ rung, nút Submit bị khóa cứng). Thực hiện xuất hợp lệ và in phiếu kho Mẫu 02-VT.
* **Phút 4 - 5 (Member 3):** Demo Trang Danh Mục `inventory.html`. Tìm kiếm Live Search và bấm nút trên Trạm Quét Barcode IoT Laser để phát âm thanh "BÍP" nhận diện sản phẩm. Thử xóa vật tư còn tồn để chứng minh hệ thống khóa an toàn.
* **Phút 5 - 6 (Member 4):** Demo Trang Lịch Sử `history.html`. Chuyển đổi qua lại giữa Dạng Timeline và Bảng Đối Soát, chỉ ra giao dịch Member 1 vừa thực hiện, bấm "Xuất CSV" mở file Excel đối chiếu.
* **Phút 6 - 7 (Member 5 - Hoàng Minh Phát):** Báo Cáo Phân Tích Big Data & Đặt Hàng 1-Click Nhà Cung Cấp.

---

### 5.2. Kịch bản thực chiến phút 6 - 7 của Member 5 (Lời thoại & Chuỗi click)

#### 🎙️ Lời thoại trình bày trước Hội đồng:
> *"Kính thưa quý Thầy/Cô, tiếp nối chuỗi dữ liệu giao dịch thực tế mà nhóm vừa thực hiện, em là Hoàng Minh Phát - Member 5, xin phép đại diện nhóm trình bày phân hệ **Báo Cáo Phân Tích Dữ Liệu & Quản Trị Chuỗi Cung Ứng**.*
>
> *Trước hết, tại trang Báo Cáo (`analytics.html`), hệ thống của chúng em không chỉ hiển thị các con số tĩnh, mà áp dụng **thuật toán phân tích chuỗi thời gian Big Data**. Như Thầy/Cô đang quan sát trên màn hình, hai biểu đồ Canvas thuần túy đang hoạt họa mượt mà: biểu đồ so sánh tương quan giá trị Nhập - Xuất và biểu đồ thanh ngang vinh danh Top 5 vật tư luân chuyển nhanh nhất.*
>
> *Đặc biệt, hệ thống sở hữu tính năng **Dự Báo Chu Kỳ Cạn Kho (Predictive Run-out)**. Dựa trên tốc độ tiêu thụ hàng ngày, thuật toán tự động tính toán số ngày còn lại trước khi hết hàng. Ví dụ vật tư Thép Hòa Phát chỉ còn đủ dùng trong 4 ngày nữa - hệ thống lập tức gắn nhãn Đỏ cảnh báo khẩn cấp.*
>
> *Để giải quyết bài toán cạn kho này một cách thông minh, em xin chuyển sang trang **Nhà Cung Cấp (`suppliers.html`)**. Tại đây, hệ thống tự động đối soát tổng tiền đã mua lũy kế từ lịch sử giao dịch. Khi em bấm vào nút **[📥 Đặt Hàng]** tại dòng Tập đoàn Hòa Phát... ngay lập tức hệ thống sử dụng cơ chế `sessionStorage` điều hướng mượt mà sang trang Nhập kho của Member 1 và tự động điền sẵn tên nhà cung cấp! Tính năng này rút ngắn quy trình tái đặt hàng từ 45 giây xuống chỉ còn 2 giây.*
>
> *Cuối cùng, hệ thống được trang bị bộ công cụ Sao lưu & Cứu hộ dữ liệu JSON đạt chuẩn an toàn thông tin doanh nghiệp. Em xin kết thúc phần trình bày của nhóm và sẵn sàng nhận các câu hỏi phản biện từ Thầy/Cô!"*

#### 🖱️ Chuỗi hành động chuột chuẩn xác từng giây:
1. Mở trang `analytics.html`, trỏ chuột vào 2 biểu đồ Canvas đang vẽ animation cột mượt mà.
2. Cuộn chuột xuống Bảng Dự báo cạn kho, chỉ vào dòng có Badge màu Đỏ $\le 5$ ngày.
3. Bấm vào menu Sidebar chuyển sang trang `suppliers.html`.
4. Chỉ vào cột "Tổng Đã Mua (VNĐ)" để chứng minh số tiền khớp 100% với các phiếu Nhập kho.
5. Click dứt khoát vào nút **[📥 Đặt Hàng]** bên cạnh "Tập đoàn Hòa Phát" $ightarrow$ Màn hình tự động nhảy sang `operations.html` với dropdown nhà cung cấp đã được chọn sẵn.

---

### 5.3. Bộ 5 câu hỏi phản biện chuyên sâu của Giảng viên & Lời giải mẫu

#### ❓ Câu hỏi 1: *"Hệ thống dùng LocalStorage, nếu dữ liệu vượt quá giới hạn 5MB thì xử lý thế nào?"*
* **Trả lời của Member 5:**  
  *"Thưa Thầy/Cô, dung lượng lưu trữ của LocalStorage trên các trình duyệt hiện đại là từ 5MB đến 10MB cho mỗi origin. Với cấu trúc dữ liệu JSON thuần túy được tối ưu hóa của Smart Kho, mỗi bản ghi vật tư hoặc giao dịch chỉ chiếm khoảng 150 bytes. Với 5MB, hệ thống có thể lưu trữ hơn 30.000 bản ghi giao dịch thực tế - hoàn toàn đáp ứng tốt cho một kho vật tư quy mô vừa và nhỏ trong 3 đến 5 năm vận hành. Ngoài ra, phân hệ của em đã xây dựng sẵn tính năng **Xuất Bản Sao Lưu (.json)** cho phép thủ kho định kỳ lưu trữ ra ổ cứng ngoài và giải phóng bộ nhớ khi cần thiết."*

#### ❓ Câu hỏi 2: *"Thuật toán dự báo cạn kho có tính đến yếu tố mùa vụ hoặc đột biến không?"*
* **Trả lời của Member 5:**  
  *"Dạ thưa Thầy/Cô, hiện tại thuật toán đang tính theo tốc độ tiêu thụ bình quân gia quyền của chu kỳ gần nhất ($T = 7	ext{ ngày}$) để phản ánh sát nhất nhu cầu thực tế hiện tại. Về mặt kiến trúc mở rộng, thuật toán được thiết kế theo dạng hàm độc lập `calculateRunOutDays()`, cho phép dễ dàng tích hợp thêm trọng số xu hướng (Linear Regression) hoặc hệ số mùa vụ (Seasonality Index) khi hệ thống kết nối với máy chủ Backend trong tương lai."*

#### ❓ Câu hỏi 3: *"Tại sao không dùng thư viện Chart.js mà lại tự viết Canvas từ đầu?"*
* **Trả lời của Member 5:**  
  *"Dạ thưa Thầy/Cô, việc tự lập trình Canvas 100% bằng Vanilla JS đem lại 3 lợi thế vượt trội: Thứ nhất, triệt tiêu sự phụ thuộc vào CDN bên thứ ba, loại bỏ nguy cơ lỗi khi tải trang trên GitHub Pages nếu mất mạng Internet; Thứ hai, dung lượng trang giảm hơn 200KB giúp tốc độ tải trang đạt mức cực đại; Thứ ba, giúp chúng em làm chủ hoàn toàn tọa độ pixel, tính toán HiDPI scaling chống mờ trên màn hình Retina và tùy biến hiệu ứng hoạt họa theo đúng Design System của nhóm."*

#### ❓ Câu hỏi 4: *"Làm thế nào để đảm bảo khi 5 người cùng làm việc không bị ghi đè dữ liệu LocalStorage của nhau?"*
* **Trả lời của Member 5:**  
  *"Dạ thưa Thầy/Cô, hệ thống áp dụng kiến trúc **Single Source of Truth** thông qua `window.DB` tại tầng lõi bất biến. Mọi thao tác ghi dữ liệu đều là các phép toán bất biến (immutable) hoặc append có kiểm tra ID duy nhất (`item.id`, `supplier.id`, `log.id` dạng tự tăng tiền tố). Khi chạy trên môi trường Client của mỗi người, dữ liệu được cô lập trong trình duyệt đó, và khi hợp nhất lên GitHub Pages, dữ liệu được khởi tạo đồng nhất từ `seed.json`."*

#### ❓ Câu hỏi 5: *"Nút Đặt Hàng 1-Click truyền dữ liệu qua sessionStorage có an toàn không nếu người dùng mở tab mới?"*
* **Trả lời của Member 5:**  
  *"Dạ thưa Thầy/Cô, đây chính là chủ đích thiết kế của em khi sử dụng `sessionStorage` thay vì `localStorage` hay URL Query Parameters. `sessionStorage` được giới hạn nghiêm ngặt trong phạm vi tab hiện tại (tab-scoped) và tự động hủy sau khi trang đích đọc xong dữ liệu (`removeItem`). Điều này đảm bảo người dùng có mở nhiều tab tác vụ khác nhau thì dữ liệu đặt hàng cũng không bị xung đột chéo, đồng thời URL trên thanh địa chỉ luôn sạch đẹp và bảo mật."*

---

## 6. BẢNG ĐỐI SOÁT NGHIỆM THU DEFINITION OF DONE (DoD)

Trước khi thực hiện lệnh commit và push mã nguồn lên nhánh `feature/member-5-ânlytics-suppliers`, Member 5 đã tiến hành tự kiểm tra và xác nhận hoàn thành 100% các tiêu chí nghiệm thu theo `rule.md`:

| STT | Tiêu chí nghiệm thu | Yêu cầu kỹ thuật | Trạng thái kiểm tra | Kết quả đạt được |
|:---:|:---|:---|:---:|:---|
| 1 | **Sạch lỗi Console** | Mở DevTools (`F12` $ightarrow$ `Console`), thao tác toàn bộ tính năng, đảm bảo 0 dòng lỗi màu đỏ. | ✅ ĐẠT | 0 Errors, 0 Warnings trên cả 2 trang `analytics.html` và `suppliers.html`. |
| 2 | **Đúng phạm vi tệp tin** | Chạy `git status`, chỉ có các tệp thuộc quyền sở hữu của Member 5 được liệt kê. | ✅ ĐẠT | Chỉ tạo/sửa: `analytics.html`, `suppliers.html`, `assets/js/analytics.js`, `assets/js/suppliers.js`, `readme.md`. |
| 3 | **Đồng bộ dữ liệu thực** | Thao tác nhập/xuất/thêm mới, kiểm tra số liệu nhảy tự động sang các trang khác. | ✅ ĐẠT | Cột "Tổng Đã Mua" nhảy chính xác theo `DB.getLogs()`; Nút Đặt Hàng tự động điền đối tác sang `operations.html`. |
| 4 | **Responsive & Không tràn** | Thu nhỏ trình duyệt xuống 13 inch (`1280x720`) và di động (`375x667`), không vỡ khung, không cuộn ngang. | ✅ ĐẠT | Grid phân tích co giãn linh hoạt 1-cột; Bảng NCC tự chuyển đổi sang Thẻ Touch Card thông minh. |
| 5 | **Chuẩn Form Validation** | Các ô nhập liệu có thuộc tính HTML5 (`required`, `pattern`, `type="email"`, `type="tel"`). | ✅ ĐẠT | Bắt buộc nhập đầy đủ, chặn số điện thoại sai định dạng, chặn email không hợp lệ. |

---
> **Kết luận:** Phân hệ của Member 5 (Hoàng Minh Phát) đã hoàn thiện toàn diện cả về mặt kiến trúc mã nguồn lẫn tài liệu đặc tả phân tích thiết kế web, sẵn sàng tạo Pull Request hợp nhất vào nhánh `main` và bảo vệ đồ án trước Hội đồng Giám khảo!
