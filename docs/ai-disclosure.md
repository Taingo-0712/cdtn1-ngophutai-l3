# BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI HỖ TRỢ
**Học phần:** Chuyên đề Tốt nghiệp 1 (Specialized Graduation Topic I)  
**Học kỳ:** HK1, Năm học 2026 – 2027  
**Bài nộp:** [x] Khởi động cá nhân & Setup môi trường [x] Bài tập 1 (BT1)   [ ] Bài tập 2 (BT2)   [ ] Bài tập 3 (BT3)  

---

### I. THÔNG TIN SINH VIÊN
* **Họ và tên:** Ngô Phú Tài
* **Mã số sinh viên:** 2374802010441
* **Chuyên ngành (Track):** [x] SE   [ ] DA   [ ] AI
* **Luồng nghiệp vụ đã chọn:** L3 – Cơ hội bán hàng và phễu bán

---

### II. BẢNG KHAI BÁO CHI TIẾT

| Công cụ AI | Dùng vào việc gì | Áp dụng ở phần nào (File / Mục) | Đã kiểm chứng & Chỉnh sửa thế nào |
| :--- | :--- | :--- | :--- |
| **ChatGPT** | Tóm tắt tài liệu môn học, case study Smart CRM và yêu cầu của buổi 1–2; giải thích các mốc BT1–BT3. | Chuẩn bị kế hoạch thực hiện đề tài L3, track SE. | Đối chiếu lại với PDF môn học và yêu cầu trên LMS. |
| **ChatGPT** | Hướng dẫn tạo repo, cấu trúc thư mục, .gitignore, .env.example, README.md; giải thích ý nghĩa các lệnh Git và cách viết commit. | Thiết lập repo buổi 2 và tài liệu khởi tạo. | Tự thực hiện trên máy; kiểm tra các tệp và thư mục bằng PowerShell, kiểm tra thay đổi bằng git status và git diff --cached --stat. |
| **ChatGPT** |Hướng dẫn khởi tạo project Node.js/Express và tạo mã khung endpoint GET /health cho smoke test.|package.json, package-lock.json, src/index.js. | Tự chạy server, mở endpoint và kiểm tra kết quả trả về {"status":"ok"}; lưu ảnh kết quả trong docs/. |
| **Tự thao tác** | Thực hiện đăng nhập GitHub, chọn tệp, commit và push theo hướng dẫn đã được hỗ trợ bởi AI. | Thao tác trên máy và GitHub. | Tự thao tác và kiểm tra trạng thái repo trên máy, trên GitHub. |

### II.1. HỖ TRỢ SOẠN NỘI DUNG BÀI TẬP 1

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| ChatGPT | Gợi ý cách trình bày yêu cầu chức năng, yêu cầu phi chức năng và liên kết giữa ca sử dụng với yêu cầu người dùng. | Mục 1 – Đặc tả yêu cầu; Mục 2 – Ca sử dụng | Đối chiếu nội dung với phạm vi luồng 3: quản lý cơ hội bán hàng và phễu bán. |
| ChatGPT | Gợi ý kiến trúc phân lớp, đặt tên các lớp bằng tiếng Việt và soạn lập luận lựa chọn kiến trúc. | Mục 3 – Lựa chọn kiến trúc | Rà soát trách nhiệm từng lớp và sự liên hệ giữa quyết định kiến trúc với các yêu cầu phi chức năng. |
| ChatGPT | Hỗ trợ thiết kế ERD gồm 6 bảng; giải thích khóa, kiểu dữ liệu và quan hệ giữa các bảng. | Mục 4 – Mô hình dữ liệu | Đối chiếu các khóa ngoại và quan hệ trên ERD với nghiệp vụ; chỉnh sửa sơ đồ sau khi rà soát. |
| ChatGPT | Soạn và giải thích chú thích ERD, các ràng buộc dữ liệu và giả định của bản mẫu. | Mục 4 – Chú thích mô hình dữ liệu | Rà soát quy tắc chuyển giai đoạn, ghi kết quả tại Chốt và yêu cầu nhập lý do khi thất bại. |
| ChatGPT | Hỗ trợ tạo SQL DDL skeleton từ mô hình dữ liệu. | Mục 4 – SQL DDL skeleton | Đối chiếu tên bảng, cột, khóa và ràng buộc với ERD; chưa chạy trực tiếp trên PostgreSQL. |
| ChatGPT | Hỗ trợ vẽ ba màn hình mẫu và giải thích phần ghi kết quả bán hàng. | Mục 5 – Wireframe | Đối chiếu các trường nhập, nút thao tác và thông báo lỗi với ca sử dụng; kiểm tra phần ghi kết quả chỉ được sử dụng ở giai đoạn Chốt. |

### II.2. HỖ TRỢ GIẢI THÍCH KHÁI NIỆM

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| ChatGPT | Giải thích User Story, Use Case và quan hệ giữa hai khái niệm. | Mục 1 – Đặc tả yêu cầu; Mục 2 – Ca sử dụng | Đọc lại giải thích và đối chiếu với các User Story, Use Case của luồng 3. |
| ChatGPT | Giải thích tiêu chí chấp nhận (AC), yêu cầu phi chức năng (NFR) và cách phân biệt. | Mục 1 – Đặc tả yêu cầu | Đối chiếu với tiêu chí của từng User Story và các NFR trong SRS. |
| ChatGPT | Giải thích kiến trúc phân lớp và trách nhiệm của từng lớp. | Mục 3 – Lựa chọn kiến trúc | Đọc lại và rà soát vai trò từng lớp trong sơ đồ kiến trúc luồng 3. |
| ChatGPT | Giải thích ERD, bảng dữ liệu và quan hệ một–nhiều giữa 6 bảng. | Mục 4 – Mô hình dữ liệu | Đối chiếu giải thích với các đường nối và khóa ngoại trên ERD. |
| ChatGPT | Giải thích các kiểu dữ liệu như BIGSERIAL, BIGINT, VARCHAR, NUMERIC và TIMESTAMPTZ. | Mục 4 – Kiểu dữ liệu của các cột | Đọc lại ý nghĩa và rà soát sự phù hợp với dữ liệu cần lưu ở từng cột. |
| ChatGPT | Giải thích PK, FK, NN, UQ, NULL và CHECK; phân biệt vai trò của từng loại. | Mục 4 – Chú thích và ràng buộc dữ liệu | Đối chiếu ký hiệu với các cột trên ERD và phần khai báo trong SQL. |
| ChatGPT | Giải thích INDEX, cách tính phễu bằng COUNT theo giai đoạn và giả định người dùng thuộc một cửa hàng cố định. | Mục 4 – Ghi chú thiết kế dữ liệu | Rà soát với cách lọc cơ hội, thống kê phễu và suy ra cửa hàng qua người phụ trách. |
| ChatGPT | Giải thích SQL DDL skeleton là gì và cách đưa vào bài nộp. | Mục 4 – SQL DDL skeleton | Đọc lại hướng dẫn; đối chiếu với yêu cầu nộp báo cáo và mã nguồn. |
| ChatGPT | Giải thích sự khác nhau giữa giai đoạn Chốt và kết quả thành công/thất bại. | Mục 5 – Màn hình chi tiết cơ hội | Đối chiếu với quy tắc chỉ ghi kết quả ở Chốt và bắt buộc nhập lý do khi thất bại. |



*Ghi chú:*
- Nếu ở bài nộp này sinh viên **hoàn toàn không sử dụng bất kỳ công cụ AI nào**, hãy ghi rõ `Không sử dụng công cụ AI` vào bảng.

---

### III. CAM KẾT VỀ LIÊM CHÍNH HỌC THUẬT

> **"Tôi xác nhận đã đọc, hiểu và chịu trách nhiệm về toàn bộ nội dung nộp."**

* **Chữ ký / Họ tên sinh viên:** Ngô Phú Tài
* **Ngày khai báo:** 29/09/2026
* **Ngày bổ sung khai báo BT1:** 10/10/2026
