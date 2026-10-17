# NHẬT KÝ THAY ĐỔI THIẾT KẾ

## Sau phản hồi Bài tập 1
Ngày cập nhật: 17/10/2026

### TD-01 — Làm rõ vị trí wireframe trong tài liệu
- Phản hồi của GV: Mục 5 được nhận xét là chưa có hình wireframe.
- Quyết định: GIỮ NGUYÊN NỘI DUNG, điều chỉnh cách trình bày.
- Lý do: File nộp thực tế đã có hình wireframe 3 màn hình ở phần sau của tài liệu, nhưng hình không nằm ngay dưới Mục 5 nên có thể gây khó nhận biết khi rà soát.
- Ảnh hưởng: Không thay đổi thiết kế wireframe. Ở bản cập nhật, đưa hình wireframe đặt trực tiếp trong Mục 5 hoặc thêm dòng tham chiếu rõ vị trí hình.

### TD-02 — Sửa thông tin trang bìa
- Phản hồi của GV: Link GitHub chưa nằm trên trang bìa và năm ở cuối trang bìa đang ghi 2025.
- Quyết định: SỬA.
- Lý do: Đây là lỗi trình bày và thông tin hồ sơ.
- Ảnh hưởng: Sửa năm thành 2026 và bổ sung link GitHub trên trang bìa của bản tài liệu cập nhật. Không ảnh hưởng đến thiết kế kỹ thuật.

### TD-03 — Giữ nguyên 9 User Story để bảo toàn truy vết
- Phản hồi của GV: Có 9 User Story trong khi đề yêu cầu 5–7.
- Quyết định: GIỮ NGUYÊN.
- Lý do: 9 User Story hiện đã được truy vết nhất quán với 9 yêu cầu chức năng và 9 Use Case. Việc gộp lại ở giai đoạn BT2 sẽ làm thay đổi mã User Story và kéo theo sửa bảng truy vết, Use Case, API contract và các tài liệu liên quan, trong khi phạm vi nghiệp vụ không thay đổi.
- Ảnh hưởng: Không thay đổi chức năng hay mã nguồn BT2. Ghi nhận đây là sai lệch về số lượng User Story của BT1.

### TD-04 — Bổ sung danh sách WON'T
- Phản hồi của GV: Mục 1 chưa có danh sách WON'T rõ ràng.
- Quyết định: SỬA.
- Lý do: Phạm vi cần nêu rõ những chức năng không thực hiện trong phiên bản prototype.
- Ảnh hưởng: Bổ sung mục "Ngoài phạm vi / WON'T" vào SRS. Không ảnh hưởng đến module cốt lõi.

### TD-05 — Hoàn thiện DDL cho toàn bộ 6 bảng
- Phản hồi của GV: SQL DDL skeleton mới có 2/6 bảng và đang trình bày dưới dạng ảnh chụp.
- Quyết định: SỬA.
- Lý do: BT2 cần migration dựng được cơ sở dữ liệu từ trạng thái trống; vì vậy toàn bộ các bảng trong ERD phải có DDL tương ứng.
- Ảnh hưởng: Viết lại schema SQL dạng văn bản cho 6 bảng store, app_user, customer, product, opportunity và opportunity_stage_history; giữ nguyên PK, FK, UNIQUE, CHECK và INDEX theo ERD đã nộp.