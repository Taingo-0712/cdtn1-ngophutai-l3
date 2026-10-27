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

### II.3. HỖ TRỢ LỚP GỌI API FRONTEND — 25/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thêm hàm request và hai hàm đọc cơ hội theo đoạn mã người dùng cung cấp. | frontend/src/api/client.js; frontend/src/api/opportunities.api.js | Đối chiếu với mẫu yêu cầu; chưa xác nhận gọi API thật hoặc kết nối PostgreSQL từ giao diện. |

### II.4. HỖ TRỢ COMPONENT TRẠNG THÁI DỮ LIỆU — 25/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Tạo component dùng chung hiển thị tải dữ liệu, lỗi kèm nút thử lại, dữ liệu rỗng và nội dung theo đúng mã người dùng cung cấp; chưa tích hợp vào màn hình. | frontend/src/components/DataState.jsx | Đối chiếu với đoạn mã yêu cầu; chưa kiểm thử hiển thị trên trình duyệt. |

### II.5. HỖ TRỢ APP HIỂN THỊ TRANG DANH SÁCH — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thay nội dung App theo mã người dùng cung cấp để hiển thị OpportunityListPage (US2/FR2). | frontend/src/App.jsx | Ngày 27/10/2026: ESLint cho App.jsx và git diff --check đạt; npm run build thất bại vì OpportunityListPage.jsx đang trống, thiếu export default. Chưa kiểm thử giao diện hoặc API thật. |

### II.6. HỖ TRỢ MÀN HÌNH CHI TIẾT VÀ CHUYỂN MÀN HÌNH — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Tạo màn hình chi tiết chỉ đọc theo mã người dùng cung cấp (US3/FR3); nối danh sách và chi tiết bằng React State, thêm cột Thao tác và nút Xem chi tiết (US2/FR2). | frontend/src/pages/OpportunityDetailPage.jsx; frontend/src/pages/OpportunityListPage.jsx; frontend/src/App.jsx | Ngày 27/10/2026: ESLint cho ba file và npm run build đạt. Chưa kiểm thử trên trình duyệt hoặc gọi API thật. |

### II.7. HỖ TRỢ MÀN HÌNH TẠO CƠ HỘI — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thêm hàm POST, tạo form theo mã người dùng cung cấp (US1/FR1), nối ba màn hình bằng React State; thành công chuyển sang chi tiết theo opportunity_id. | frontend/src/api/opportunities.api.js; frontend/src/pages/CreateOpportunityPage.jsx; frontend/src/App.jsx | Ngày 27/10/2026: ESLint cho ba file và npm run build đạt; đã đối chiếu payload với service/repository hiện tại. Chưa gửi POST, kiểm thử trình duyệt hoặc xác nhận lưu PostgreSQL. Form chưa dùng DataState; khác biệt với SRS/API contract được ghi tại TD-07. |

### II.8. HỖ TRỢ CSS CHUNG CHO BA MÀN HÌNH — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thay CSS mẫu Vite bằng CSS người dùng cung cấp cho danh sách, chi tiết và form tạo cơ hội; thêm import App.css, giữ nguyên logic chuyển màn hình. | frontend/src/index.css; frontend/src/App.css; frontend/src/App.jsx | Ngày 27/10/2026: ESLint cho App.jsx và npm run build đạt. Chưa kiểm tra hiển thị trên trình duyệt hoặc thiết bị di động. |

### II.9. HỖ TRỢ ROUTE CHUYỂN GIAI ĐOẠN — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Chèn PATCH /:id/stage trước PATCH /:id đúng mẫu người dùng cung cấp (US5/FR5), giữ nguyên các route CRUD cũ. | src/routes/opportunity.routes.js | Ngày 27/10/2026: node --check đạt; node --test tests/opportunity.service.test.js đạt 1/1 (test giá trị tạo cơ hội âm, không kiểm chứng chuyển giai đoạn). Service hiện chưa có updateOpportunityStage; chưa gọi endpoint hoặc xác nhận transaction/lịch sử. Khác biệt mã lỗi được ghi tại TD-09. |

### II.10. HỖ TRỢ SERVICE CHUYỂN GIAI ĐOẠN — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thêm và export updateOpportunityStage đúng mã người dùng cung cấp (US5/FR5); bổ sung unit test cho ba bước hợp lệ, bốn chuyển bước bị cấm, giai đoạn ngoài danh mục và cơ hội không tồn tại. | src/services/opportunity.service.js; tests/opportunity.stage.service.test.js | Ngày 27/10/2026: node --check cho service đạt; chạy hai file unit test đạt 10/10. Test stage dùng repository giả lập; repository thật chưa có updateStage. Chưa xác nhận HTTP, lưu PostgreSQL, lịch sử hoặc transaction. |

### II.11. HỖ TRỢ TRANSACTION CHUYỂN GIAI ĐOẠN — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thêm và export updateStage đúng mã người dùng cung cấp: khóa bản ghi, kiểm tra lại bước chuyển, cập nhật giai đoạn và ghi lịch sử trong transaction (US5/FR5, BR6). Bổ sung 5 unit test repository. | src/repositories/opportunity.repository.js; tests/opportunity.stage.repository.test.js | Ngày 27/10/2026: node --check cho repository đạt; ba file unit test đạt 15/15 với kết nối giả lập. Chưa kiểm thử HTTP, rollback dữ liệu hoặc hai yêu cầu đồng thời trên PostgreSQL thật. changed_by tạm lấy owner_id theo yêu cầu demo; xem TD-11. |

### II.12. HỖ TRỢ CHUYỂN GIAI ĐOẠN TRÊN REACT — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thêm hàm PATCH và khối chuyển giai đoạn trong DataState theo mã người dùng cung cấp (US5/FR5); hiển thị bước kế tiếp, trạng thái đang cập nhật, lỗi và tải lại chi tiết sau thành công; thêm CSS. | frontend/src/api/opportunities.api.js; frontend/src/pages/OpportunityDetailPage.jsx; frontend/src/App.css | Ngày 27/10/2026: ESLint cho hai file JavaScript thay đổi và npm run build đạt. Chưa kiểm thử thao tác trên trình duyệt hoặc gửi PATCH thật. Người dùng mô tả API đã được kiểm thử bằng Postman; Codex chưa xác minh độc lập kết quả đó. |

### II.13. HỖ TRỢ REPOSITORY GHI KẾT QUẢ — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thêm và export updateResult(id, result, failureReason) đúng mẫu người dùng cung cấp (US6/FR6), chỉ cập nhật khi stage là CHOT và result còn NULL. | src/repositories/opportunity.repository.js | Ngày 27/10/2026: node --check đạt; chạy lại 15 unit test hiện có, tất cả đạt. Các test hiện có không kiểm chứng updateResult; chưa chạy SQL mới trên PostgreSQL hoặc nối service/route ghi kết quả. |

### II.14. HỖ TRỢ SERVICE GHI KẾT QUẢ — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thêm và export updateOpportunityResult đúng mã người dùng cung cấp (US6/FR6, BR4); bổ sung 9 unit test kiểm tra kết quả, điều kiện CHOT/chưa có kết quả, lý do thất bại, chuẩn hóa dữ liệu và xung đột. | src/services/opportunity.service.js; tests/opportunity.result.service.test.js | Ngày 27/10/2026: node --check cho service đạt; bốn file unit test đạt 24/24 với repository/kết nối giả lập. Chưa kiểm thử route, SQL ghi kết quả hoặc truy cập đồng thời trên PostgreSQL thật. Các giới hạn còn lại được ghi tại TD-14. |

### II.15. HỖ TRỢ ROUTE GHI NHẬN KẾT QUẢ — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Chèn PATCH /:id/result đúng mẫu sau route /:id/stage và trước PATCH /:id (US6/FR6), gọi service và ánh xạ lỗi sang HTTP 400/404/409/500. | src/routes/opportunity.routes.js | Ngày 27/10/2026: node --check cho route đạt; chạy lại bốn file unit test đạt 24/24. Các test dùng repository/kết nối giả lập và không bao phủ HTTP route; chưa gửi PATCH thật hoặc xác nhận ghi kết quả PostgreSQL. |

### II.16. HỖ TRỢ GHI NHẬN KẾT QUẢ TRÊN REACT — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Thêm API helper PATCH kết quả, tạo OpportunityResult theo mẫu người dùng, gắn sau phần chuyển giai đoạn trong chi tiết và thêm CSS (US6/FR6). | frontend/src/api/opportunities.api.js; frontend/src/components/OpportunityResult.jsx; frontend/src/pages/OpportunityDetailPage.jsx; frontend/src/App.css | Ngày 27/10/2026: ESLint cho ba file JavaScript thay đổi và npm run build đạt. Chưa kiểm thử trình duyệt, gửi PATCH thật hoặc xác nhận kết quả cơ hội số 1 trong PostgreSQL. |

### II.17. RÀ SOÁT DATASTATE, API VÀ XÁC THỰC — 27/10/2026

| Công cụ | Dùng vào việc gì | Áp dụng ở phần nào | Đã kiểm chứng thế nào |
| --- | --- | --- | --- |
| Codex | Rà soát DataState, ba màn hình, lớp API, Vite proxy và cơ chế xác thực; không sửa mã ứng dụng. | frontend/src/components/DataState.jsx; frontend/src/pages/; frontend/src/api/; frontend/vite.config.js; src/index.js; src/ | Ngày 27/10/2026: ESLint cho DataState, pages và api đạt. Tìm mã nguồn xác nhận fetch chỉ nằm ở api/client.js. Chạy script kiểm tra tạm với fetch giả lập đạt 9/9: lỗi mạng, proxy 500/502, JSON sai, danh sách hợp lệ/rỗng, lỗi 404, hành vi 401 và gọi lại sau lỗi. Lần đầu script bị lỗi mã hóa tiếng Việt khi truyền qua PowerShell; đã sửa script và chạy lại đạt. Test 401 chỉ xác nhận lỗi thông thường không có metadata status, chưa xác nhận xử lý đăng nhập. Backend chưa có middleware xác thực/route đăng nhập; form tạo có loading/error riêng, chưa dùng DataState và chưa tải danh mục nên Empty chưa có ý nghĩa hiện tại. Chưa thử tắt/bật backend hoặc kiểm thử giao diện/nút Thử lại trên trình duyệt; phiên không có runtime điều khiển trình duyệt khả dụng. |

### III. CAM KẾT VỀ LIÊM CHÍNH HỌC THUẬT

> **"Tôi xác nhận đã đọc, hiểu và chịu trách nhiệm về toàn bộ nội dung nộp."**

* **Chữ ký / Họ tên sinh viên:** Ngô Phú Tài
* **Ngày khai báo:** 29/09/2026
* **Ngày bổ sung khai báo BT1:** 10/10/2026
