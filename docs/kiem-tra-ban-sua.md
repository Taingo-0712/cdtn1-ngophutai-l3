# Áp dụng bản sửa quyền L3

1. Copy các thư mục src, tests, frontend/src, docs trong ZIP đè vào đúng thư mục dự án hiện có. Giữ .env và node_modules trên máy.
2. Terminal Backend: Ctrl+C, npm test (mong đợi 44 PASS), npm start.
3. Terminal frontend: cd frontend, npm run build, npm run dev.
4. Mở web qua URL Vite; đăng nhập sales01 bằng mật khẩu demo. Tải lại trang sẽ cần đăng nhập lại. Token hết hạn: đăng xuất và đăng nhập lại.

## Postman kiểm tra thật
Đăng nhập lấy token mới. Không xóa cơ hội 52,53,54 vì dùng kiểm tra.

| Tên | Token | Request | Body | Mong đợi |
|---|---|---|---|---|
| AUTHZ-14 Chặn chuyển cơ hội người khác | sales01 | PATCH /api/opportunities/53/stage | {"stage":"TU_VAN"} | 404 |
| AUTHZ-15 Chặn quản lý chuyển giai đoạn | manager01 | PATCH /api/opportunities/52/stage | {"stage":"TU_VAN"} | 403 |
| AUTHZ-16 Chặn ghi kết quả người khác | sales01 | PATCH /api/opportunities/53/result | {"result":"THANH_CONG"} | 404 |
| AUTHZ-17 Chặn quản lý ghi kết quả | manager01 | PATCH /api/opportunities/52/result | {"result":"THANH_CONG"} | 403 |
| AUTHZ-18 Chặn xóa người khác | sales01 | DELETE /api/opportunities/53 | Không | 404 |
| AUTHZ-19 Chặn quản lý xóa | manager01 | DELETE /api/opportunities/52 | Không | 403 |

Luồng đúng: token sales01 POST cơ hội mới bằng customer_id/product_id có thật; ghi ID trả về. PATCH stage lần lượt TU_VAN, BAO_GIA, CHOT; mỗi lần 200. PATCH result THANH_CONG → 200; gửi lại → 409.
Kiểm tra xóa đúng quyền bằng MỘT cơ hội mới khác chưa chuyển giai đoạn: DELETE → 200; GET lại → 404. Cơ hội đã có lịch sử: DELETE → 409, bảo toàn lịch sử.

## Giới hạn còn lại
- Đã có API phễu và lịch sử. Chưa có lọc theo stage.
- FR4 yêu cầu sửa sản phẩm và chặn sửa cơ hội có kết quả chưa được triển khai đầy đủ ở code hiện tại.
- API sản phẩm chưa áp dụng xác thực/phân quyền.
- Chưa dựng database trống và chưa xác nhận báo cáo PDF, README hiện tại đáp ứng toàn bộ BT2.
- 44 PASS là kiểm thử giả lập, không thay minh chứng PostgreSQL/Postman hoặc ảnh giao diện thật.


## Phễu và lịch sử mới
- Đăng nhập manager01: trên danh sách thấy phễu đủ Tiếp cận, Tư vấn, Báo giá, Chốt; số đếm chỉ thuộc cửa hàng. Tổng bằng tổng danh sách cùng phạm vi tại cùng thời điểm.
- Đăng nhập sales01: không thấy phễu. GET /api/opportunities/funnel bằng token SALES → 403; MANAGER → 200.
- Mở chi tiết cơ hội đã chuyển giai đoạn: cuối trang có lịch sử từ cũ đến mới, người thực hiện và thời điểm. Cơ hội chưa chuyển thì thông báo không có dữ liệu.
- GET /api/opportunities/91/history với tài khoản được xem cơ hội 91 → 200; người ngoài phạm vi → 404. Thay 91 bằng ID đang có nếu cần.
- Test trong môi trường AI: 44 unit test PASS; build frontend PASS; 38 kiểm tra HTTP PASS với SQL trên PGlite và seed chạy hai lần không trùng. Chưa kiểm thử UI bằng trình duyệt hoặc PostgreSQL 16 trên máy sinh viên.
