# 📦 Phân Hệ Điều Phối Nhập & Xuất Kho (Smart Kho - TKW)
> **Thành viên phụ trách:** Nguyễn Hoàng Anh (Member 1 - Lead)  
> **Nhánh tính năng:** `feature/member-1-operations`  
> **Trang chính:** `operations.html`

## 🚀 Các tính năng chính:
- **Điều phối Nhập & Xuất kho:** Ràng buộc HTML5 `min="1"` và `max` động theo tồn kho thực tế.
- **Chặn xuất âm an toàn:** Kiểm tra số lượng xuất theo thời gian thực (oninput), báo viền đỏ rung lắc và khóa chặt nút submit nếu xuất vượt tồn.
- **In phiếu kho chuẩn Mẫu số 02-VT:** Chuẩn Bộ Tài chính (Thông tư 200/2014/TT-BTC) có đầy đủ chữ ký 5 bên, tự động ẩn sidebar và header khi in (Ctrl + P).
- **Đồng bộ thời gian thực (Realtime Sync):** Tự động ghi nhật ký giao dịch và cập nhật tồn kho vào `window.DB` (LocalStorage).
- **Hỗ trợ Trợ lý ảo AI:** Tích hợp trích xuất và in phiếu kho Mẫu 02-VT tự động bằng lệnh thoại.
