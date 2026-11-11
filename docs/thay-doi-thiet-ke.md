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

### TD-06 — Chuyển danh sách và chi tiết bằng React State
- Ngày cập nhật: 27/10/2026.
- Quyết định theo yêu cầu người dùng: App giữ selectedId để chuyển giữa OpportunityListPage và OpportunityDetailPage, chưa cài React Router.
- Ảnh hưởng: Danh sách có nút Xem chi tiết; màn hình chi tiết chỉ đọc dữ liệu qua getOpportunityById(id), dùng DataState và có nút quay lại. Truy vết US2/FR2 và US3/FR3.
- Kiểm chứng: ESLint cho ba file giao diện thay đổi và npm run build đạt; chưa kiểm thử trình duyệt hoặc API thật.

### TD-07 — Thêm màn hình tạo cơ hội theo API hiện có
- Ngày cập nhật: 27/10/2026. Truy vết US1/FR1.
- Quyết định theo mã người dùng cung cấp: giữ hai hàm GET, thêm createOpportunity gửi POST; App dùng page và selectedId để chuyển giữa list/detail/create. Tạo thành công chuyển sang chi tiết của opportunity_id được trả về.
- Form gửi customer_id, product_id, owner_id, need_desc, expected_value theo backend hiện tại; ba mã mặc định là 1, có thể sửa. Giai đoạn do backend đặt thành TIEP_CAN. Form tự hiển thị lỗi và trạng thái đang lưu, chưa tích hợp DataState.
- Điểm chưa thống nhất: SRS/API contract yêu cầu người phụ trách lấy từ phiên xác thực, dùng need và giai đoạn CONTACT; code hiện tại nhận owner_id từ client, dùng need_desc và TIEP_CAN. Bước này chỉ nối frontend với backend theo yêu cầu, không xác nhận backend đã tuân thủ SRS hay thay đổi quy tắc phân quyền. Hướng hoàn thiện: thống nhất lại payload và lấy người phụ trách từ phiên khi triển khai xác thực.
- Kiểm chứng: ESLint cho ba file thay đổi và npm run build đạt. Chưa kiểm thử trình duyệt, gửi POST hoặc xác nhận dữ liệu trong PostgreSQL; chưa xác nhận các bản ghi mã 1 tồn tại.

### TD-08 — Áp dụng CSS chung theo mẫu người dùng
- Ngày cập nhật: 27/10/2026.
- Quyết định: thay CSS mẫu Vite trong index.css và App.css bằng mẫu được cung cấp, import App.css trong App.jsx; giữ nguyên logic ba màn hình (US1/FR1, US2/FR2, US3/FR3).
- Ảnh hưởng: thống nhất khung, tiêu đề, nút, bảng và form; dùng selector chung, có quy tắc màn hình tối đa 768px để bảng cuộn ngang.
- Kiểm chứng: ESLint cho App.jsx và npm run build đạt; chưa kiểm tra hiển thị trên trình duyệt hoặc thiết bị di động.

### TD-09 — Bổ sung route chuyển giai đoạn theo mẫu
- Ngày cập nhật: 27/10/2026. Truy vết US5/FR5.
- Quyết định theo yêu cầu người dùng: chèn PATCH /api/opportunities/:id/stage trước PATCH /:id, gọi updateOpportunityStage(id, stage), giữ nguyên route CRUD cũ.
- Điểm chưa thống nhất: mẫu trả 400 cho INVALID_STAGE_TRANSITION, trong khi API contract quy định 409. Bước này giữ đúng mã người dùng cung cấp, chưa sửa hợp đồng API; hướng xử lý khi hoàn thiện là thống nhất lại mã lỗi trước kiểm thử endpoint.
- Phụ thuộc còn thiếu: service hiện chưa khai báo/export updateOpportunityStage, nên chưa thể chuyển giai đoạn. Cần hoàn thiện nghiệp vụ và transaction cập nhật giai đoạn cùng lịch sử theo FR5/BR6; chưa xác nhận phân quyền hay tính nguyên tử.
- Kiểm chứng: node --check cho route đạt; unit test hiện có đạt 1/1, chỉ kiểm tra giá trị tạo cơ hội âm. Chưa kiểm thử HTTP hoặc cập nhật PostgreSQL.

### TD-10 — Bổ sung service kiểm tra chuyển giai đoạn theo mẫu
- Ngày cập nhật: 27/10/2026. Truy vết US5/FR5, BR3.
- Quyết định theo mã người dùng cung cấp: thêm và export updateOpportunityStage; kiểm tra danh mục TIEP_CAN/TU_VAN/BAO_GIA/CHOT, đọc cơ hội, chỉ cho chuyển một bước rồi gọi repository.updateStage(id, newStage).
- Trạng thái sau bước này: service đã có hàm mà route gọi; repository thật vẫn chưa có updateStage nên endpoint chưa thể hoàn tất cập nhật PostgreSQL.
- Việc còn lại theo FR5/BR6: cập nhật giai đoạn và lịch sử trong cùng transaction, xử lý đồng thời; kiểm tra phân quyền và khóa cơ hội đã có kết quả theo SRS. Chưa xác nhận các yêu cầu này được đáp ứng bởi mẫu service. Khác biệt mã lỗi route/API contract tại TD-09 vẫn còn.
- Kiểm chứng: node --check cho service đạt; hai file unit test đạt 10/10, gồm 9 test mới dùng repository giả lập. Chưa kiểm thử HTTP hoặc PostgreSQL.

### TD-11 — Transaction cập nhật giai đoạn và ghi lịch sử
- Ngày cập nhật: 27/10/2026. Truy vết US5/FR5, BR3, BR6.
- Quyết định theo mã người dùng cung cấp: thêm và export repository.updateStage(id, newStage); dùng cùng client cho BEGIN, SELECT FOR UPDATE, kiểm tra lại bước chuyển, UPDATE opportunity, INSERT opportunity_stage_history và COMMIT; lỗi gọi ROLLBACK, luôn trả kết nối sau giao dịch.
- Tạm dùng owner_id của cơ hội làm changed_by cho dữ liệu demo, chỉ phản ánh đúng người thao tác khi người đó là nhân viên phụ trách. Trước nghiệm thu lịch sử/audit đầy đủ, phải lấy người thực hiện từ danh tính đã xác thực; không coi đây là triển khai phân quyền.
- Trạng thái sau bước này: route, service và repository đã có hàm chuyển giai đoạn; chưa xác nhận endpoint chạy đúng với PostgreSQL. Khác biệt HTTP 400/409 tại TD-09 và yêu cầu phân quyền vẫn cần xử lý.
- Kiểm chứng: node --check cho repository đạt; ba file unit test đạt 15/15, gồm 5 test repository về commit, lỗi update/insert, không tìm thấy và giai đoạn đã đổi sau khi khóa. Các test dùng kết nối giả lập, không chứng minh rollback dữ liệu, khóa đồng thời hoặc NFR3 trên PostgreSQL thật.

### TD-12 — Tích hợp nút chuyển giai đoạn vào màn hình chi tiết
- Ngày cập nhật: 27/10/2026. Truy vết US5/FR5, BR3.
- Quyết định theo mẫu người dùng: thêm updateOpportunityStage(id, stage) gửi PATCH; đặt khối stage-transition bên trong nội dung chi tiết và DataState, chỉ hiển thị nút chuyển bước kế tiếp, đến CHOT thì hiển thị thông báo.
- Nút bị vô hiệu hóa khi đang cập nhật; lỗi hiển thị tại khối chuyển giai đoạn; thành công tăng retry để đọc lại chi tiết qua GET. Thêm CSS chung cho khối này.
- Kiểm chứng: ESLint cho API helper và màn hình chi tiết, npm run build đều đạt; chưa thao tác trình duyệt hoặc gửi PATCH thật trong phiên này. Giới hạn xác thực/changed_by ở TD-11 vẫn còn.

### TD-13 — Bổ sung repository ghi kết quả có điều kiện
- Ngày cập nhật: 27/10/2026. Truy vết US6/FR6, BR4.
- Quyết định theo mẫu người dùng: thêm và export updateResult; UPDATE result, failure_reason, updated_at với điều kiện opportunity_id tương ứng, stage = CHOT và result IS NULL. Trả bản ghi từ RETURNING; nếu không có bản ghi phù hợp thì trả undefined.
- Bước này chỉ bổ sung SQL ở repository; validation kết quả/lý do, phân quyền, xử lý undefined và service/route ghi kết quả chưa được triển khai trong thay đổi này.
- Kiểm chứng: node --check đạt; 15 unit test hiện có vẫn đạt, chưa kiểm chứng hàm mới hoặc điều kiện cập nhật trên PostgreSQL thật.

### TD-14 — Bổ sung service ghi kết quả theo mẫu
- Ngày cập nhật: 27/10/2026. Truy vết US6/FR6, BR4.
- Quyết định theo mã người dùng: thêm và export updateOpportunityResult, chỉ nhận THANH_CONG/THAT_BAI, yêu cầu cơ hội tồn tại ở CHOT và chưa có kết quả. THAT_BAI cần lý do là chuỗi không rỗng sau trim; THANH_CONG chuẩn hóa lý do thành null. Repository không trả bản ghi thì báo RESULT_UPDATE_CONFLICT.
- Giữ nguyên các hàm CRUD và chuyển giai đoạn; chưa thêm route ghi kết quả.
- Điểm cần hoàn thiện: mẫu chưa kiểm tra giới hạn lý do 500 ký tự theo SRS/BR4; API contract dùng WON/LOST, loss_reason và từ chối chuỗi lý do khi thành công, khác mẫu hiện tại. Bước này giữ nguyên mã người dùng cung cấp; cần thống nhất hợp đồng/validation khi hoàn thiện API, chưa xác nhận đáp ứng toàn bộ FR6/phân quyền.
- Kiểm chứng: node --check cho service đạt; bốn file unit test đạt 24/24, gồm 9 test mới với repository giả lập. Xung đột được giả lập bằng kết quả undefined, chưa kiểm chứng đồng thời hoặc ghi kết quả trên PostgreSQL thật.

### TD-15 — Nối route ghi nhận kết quả với service
- Ngày cập nhật: 27/10/2026. Truy vết US6/FR6.
- Quyết định theo mẫu người dùng: thêm PATCH /api/opportunities/:id/result ngay sau /:id/stage và trước PATCH /:id; truyền id, result, failure_reason cho updateOpportunityResult. Giữ nguyên các route đã có.
- Response: 200 khi thành công; 404 khi không tồn tại; 400 khi kết quả/lý do không hợp lệ; 409 khi chưa CHOT, đã có kết quả hoặc cập nhật xung đột; lỗi khác trả 500.
- Kiểm chứng: node --check cho route đạt; 24/24 unit test hiện có đạt với repository/kết nối giả lập. Chưa kiểm thử HTTP route hoặc ghi kết quả trên PostgreSQL thật. Các điểm chưa thống nhất với SRS/API contract và giới hạn validation tại TD-14 vẫn còn.

### TD-16 — Tích hợp component ghi nhận kết quả trên React
- Ngày cập nhật: 27/10/2026. Truy vết US6/FR6, BR4.
- Quyết định theo mẫu người dùng: thêm helper updateOpportunityResult gửi PATCH với result/failure_reason; tạo OpportunityResult và đặt sau khối chuyển giai đoạn, bên trong dữ liệu chi tiết và DataState; bổ sung CSS opportunity-result.
- Component ẩn khi chưa CHOT; ở CHOT và result = null thì hiện form, bắt buộc lý do không rỗng khi THAT_BAI, gửi null khi THANH_CONG. Đã có kết quả thì chỉ hiển thị. Lưu thành công gọi onUpdated để tải lại chi tiết; khi đang lưu vô hiệu hóa nút và hiển thị lỗi nếu có.
- Kiểm chứng: ESLint cho ba file JavaScript thay đổi và npm run build đạt; chưa kiểm thử hiển thị, PATCH thật hoặc xác nhận cơ hội số 1. Giới hạn validation 500 ký tự và khác biệt hợp đồng tại TD-14 vẫn còn.

### Bổ sung API CRUD sản phẩm trong BT2

- Ngày cập nhật: 01/11/2026.
- Thiết kế BT1 sử dụng sản phẩm dưới dạng dữ liệu tham chiếu có sẵn.
- BT2 bổ sung API thêm, xem danh sách/chi tiết, sửa và xóa mềm
  sản phẩm để đáp ứng yêu cầu thực thể thứ hai có đủ CRUD.
- Sử dụng bảng product hiện có; xóa mềm bằng is_active = false,
  giữ bản ghi để bảo toàn liên kết với cơ hội bán hàng cũ.
- Mã nguồn được tách thành Route, Service và Repository.
- Chưa bổ sung màn hình quản lý sản phẩm.
- Bổ sung 6 kiểm thử Service với Repository giả lập.
- Kết quả chạy npm test trên máy: 30/30 PASS, 0 FAIL.
- API sản phẩm chưa được tích hợp đăng nhập/phân quyền.

## 01/11/2026 — Phễu và lịch sử (FR7, FR9)
- Phễu chỉ cho MANAGER, nhóm theo stage hiện tại trong cửa hàng; trả đủ bốn stage, kể cả 0.
- Lịch sử kiểm tra quyền xem cơ hội, sắp thời gian và history_id tăng dần. Thêm bảng hiển thị với loading/empty/error.
- Giao diện quản lý ẩn thao tác chuyển giai đoạn/ghi kết quả, Backend vẫn kiểm tra quyền.
- AI soạn code và test; kiểm chứng tự động và API PGlite, chưa kiểm thử trình duyệt/PostgreSQL 16 trên máy sinh viên.




## Cập nhật 01/11/2026 — Hoàn thiện quyền thao tác L3
- Thay đổi: xóa/chuyển giai đoạn/ghi kết quả nhận tài khoản xác thực; chỉ SALES thao tác cơ hội phụ trách, SQL giới hạn owner và store. changed_by lấy từ tài khoản xác thực. Xóa cơ hội có lịch sử bị FK chặn và trả 409 OPPORTUNITY_HAS_HISTORY.
- Vì sao: tránh vượt quyền qua gọi API trực tiếp; truy vết FR5, FR6, QT-14.
- Ảnh hưởng: 3 lớp Backend, test nghiệp vụ và giao diện đăng nhập/token; form tạo bỏ owner_id. Không thêm quản lý tài khoản.
- Kiểm chứng: 39/39 test tự động PASS với repository/kết nối giả lập; chưa chạy PostgreSQL thật hoặc kiểm thử trình duyệt. Build tại môi trường Linux bị chặn bởi binding native Windows trong ZIP; cần npm run build trên máy sinh viên.



## Sau phản hồi Bài tập 2

Ngày tổng hợp 10/11/2026. Các mục TD-17 đến TD-20 ghi nhận phản hồi của giảng viên. Các mục TD-21 đến TD-23 ghi lại những cải tiến bổ sung trong quá trình hoàn thiện.

### TD-17 — Hoàn thiện màn hình quản lý và thao tác sửa sản phẩm

- **Phản hồi của GV** — Sản phẩm chưa có màn hình quản lý và còn thiếu thao tác sửa.
- **Quyết định** — **SỬA.** Bổ sung màn hình **Quản lý sản phẩm** cho vai trò `MANAGER` và nối thao tác **Sửa** với API cập nhật.
- **Lý do** — Sản phẩm là thực thể thứ hai của BT2. Người quản lý cần thực hiện được các thao tác với sản phẩm ngay trên giao diện.
- **Ảnh hưởng** — Quản lý có thể xem danh sách, thêm, sửa và ngừng sử dụng sản phẩm. Form sửa điền sẵn mã và tên sản phẩm, gọi `PATCH /api/products/:id` khi lưu rồi tải lại danh sách. Khi ngừng sử dụng, giao diện yêu cầu xác nhận và hệ thống xóa mềm để bảo toàn tham chiếu từ cơ hội cũ.
- **Minh chứng** — [Màn hình quản lý](<End-to-End/A3. Quản lí sản phẩm.png>), [biểu mẫu sửa](<End-to-End/A6. Sửa sản phẩm.png>), [kết quả sau khi sửa](<End-to-End/A7. Sản phẩm sau khi sửa.png>) và [xác nhận ngừng kinh doanh](<End-to-End/A8. Ngừng kinh doanh sản phẩm.png>).

### TD-18 — Hoàn thiện bộ lọc theo giai đoạn (FR8/US8)

- **Phản hồi của GV** — Lọc theo giai đoạn (FR8) chưa làm.
- **Quyết định** — **SỬA.** Hiện thực bộ lọc trên trang danh sách và xử lý tham số `stage` ở backend.
- **Lý do** — Nhân viên và quản lý cần xem các cơ hội ở một giai đoạn cụ thể trong phạm vi được phép.
- **Ảnh hưởng** — React gửi `GET /api/opportunities?stage=...` khi chọn **Tiếp cận**, **Tư vấn**, **Báo giá** hoặc **Chốt**, và bỏ tham số khi chọn **Tất cả**. Backend lọc theo giai đoạn trong truy vấn có phân quyền. Giá trị sai, rỗng hoặc lặp trả HTTP `400 INVALID_STAGE`. Hệ thống tiếp tục che số điện thoại theo vai trò.
- **Điểm cần đối chiếu** — API hiện dùng `TIEP_CAN`, `TU_VAN`, `BAO_GIA`, `CHOT`. Hợp đồng API BT1 đang ghi `CONTACT`, `CONSULTING`, `QUOTATION`, `CLOSED`. [Hợp đồng API](api-contract.md).
- **Kiểm chứng** — Sau khi nối React, bộ kiểm thử tại thời điểm đó đạt 63/63, build frontend và kiểm tra ESLint trên hai tệp đã sửa đều đạt. [Các ca FR8](../tests/opportunity.read.test.js) kiểm tra lọc trong phạm vi quyền, bỏ lọc và tham số sai theo TC21–TC23, với dữ liệu hoặc kết nối giả lập.

### TD-19 — Kiểm chứng dựng lại từ bản clone sạch

- **Phản hồi của GV** — Chưa thử clone sạch.
- **Quyết định** — **BỔ SUNG KIỂM CHỨNG.** Dựng lại dự án theo README trong thư mục mới và dùng database thử riêng.
- **Lý do** — Phép thử xác định người clone repo có thể cài đặt và chạy dự án bằng các bước đã ghi trong README, đồng thời kiểm tra việc nạp dữ liệu mẫu lần hai.
- **Ảnh hưởng** — README đã có quy trình clone, cài thư viện, chạy migration và seed, đối chiếu số bản ghi sau lần seed thứ hai, chạy test, build frontend và thử ứng dụng. Sau khi chạy, ghi mã commit và kết quả thực tế.
- **Trạng thái** — **Đã có hướng dẫn. Phép thử dựng lại độc lập chưa thực hiện.** [Hướng dẫn trong README](../README.md#phép-thử-dựng-lại-độc-lập).

### TD-20 — Ghi nhận kết quả kiểm chứng tại Bảng 4.2

- **Phản hồi của GV** — Mục kiểm chứng (Bảng 4.2) đạt đủ các mục chung và mục theo track.
- **Quyết định** — **GHI NHẬN.** Lưu kết quả đánh giá của giảng viên cho phần kiểm chứng BT2.
- **Lý do** — Đây là kết quả đánh giá các mục chung và các mục riêng của track SE.
- **Ảnh hưởng** — Ghi trạng thái **đạt theo phản hồi của giảng viên**. Tiến độ tự kiểm chứng từ bản clone được theo dõi riêng ở TD-19.

### TD-21 — Bổ sung xác thực và phân quyền cho API sản phẩm

- **Căn cứ** — Bổ sung kỹ thuật để hỗ trợ màn hình quản lý sản phẩm ở TD-17.
- **Quyết định** — **BỔ SUNG.** Áp dụng `authenticate` cho toàn bộ API sản phẩm và `requireProductManager` cho các thao tác thêm, sửa và ngừng sử dụng.
- **Lý do** — Quyền thay đổi sản phẩm cần được kiểm tra ở backend, kể cả khi người dùng gọi API trực tiếp.
- **Ảnh hưởng** — `SALES` và `MANAGER` đã xác thực đều đọc được dữ liệu sản phẩm. Chỉ `MANAGER` được gọi các thao tác `POST`, `PATCH` và `DELETE`. Thiếu hoặc sai token trả `401`. Nhân viên gọi thao tác ghi trả `403`.
- **Kiểm chứng** — Tại thời điểm bổ sung, bộ kiểm thử đạt 60/60. [Bộ kiểm thử phân quyền](../tests/product.authorization.test.js) bao phủ 20 trường hợp trên 5 route, dùng xác thực và service giả lập để kiểm tra yêu cầu hợp lệ đi tiếp và yêu cầu bị chặn dừng trước service.

### TD-22 — Cải thiện dữ liệu hiển thị ở danh sách và chi tiết cơ hội (FR2/FR3)

- **Căn cứ** — Cải tiến trong quá trình hoàn thiện FR2/FR3 và áp dụng các quy tắc QT-14, QT-15.
- **Quyết định** — **SỬA.** Trả và hiển thị tên khách hàng, tên sản phẩm và số điện thoại theo quyền xem của từng vai trò.
- **Lý do** — Tên giúp người dùng nhận biết khách hàng và sản phẩm trực tiếp. Số điện thoại cần được che ngay trong phản hồi API cho nhân viên.
- **Ảnh hưởng** — Repository nối dữ liệu từ `customer` và `product` trong truy vấn danh sách và chi tiết, đồng thời áp dụng giới hạn xem theo QT-14. Service che số trước khi trả dữ liệu cho `SALES` theo QT-15. `MANAGER` được xem số đầy đủ trong phạm vi được phép. Giao diện dùng tên thay mã ở trang chi tiết, hiển thị số dưới tên khách hàng ở trang danh sách và báo bằng tiếng Việt khi danh sách rỗng, cơ hội không tìm thấy hoặc phiên đăng nhập hết hạn.
- **Điểm cần đối chiếu** — API hiện trả `404 OPPORTUNITY_NOT_FOUND` cho cơ hội ngoài phạm vi và cơ hội không tồn tại. Hợp đồng API BT1 mô tả trường hợp ngoài phạm vi bằng `403`. [Hợp đồng API](api-contract.md).
- **Kiểm chứng** — Tại thời điểm cập nhật, bộ kiểm thử đạt 59/59 với truy vấn, repository hoặc xác thực giả lập. Build và ESLint trên các tệp đã sửa đạt. Lần chạy lint toàn frontend ghi nhận lỗi có sẵn về `react-hooks/set-state-in-effect` tại `OpportunityReport.jsx` và `CreateOpportunityPage.jsx`.

### BUG-03 — Chặn tạo cơ hội với sản phẩm ngừng kinh doanh (11/11/2026, US1/FR1)

- Cập nhật bước route theo yêu cầu người dùng: thêm INVALID_REFERENCE vào danh sách lỗi 400 của POST, hoàn thành việc ánh xạ nêu bên dưới. Kiểm tra HTTP bằng script Node với xác thực/repository giả lập PASS: status 400, JSON { "message": "INVALID_REFERENCE" }; chưa kiểm thử PostgreSQL thật hoặc chạy lại toàn bộ bộ test ở bước này.

- Theo mã người dùng phê duyệt, repository.create thay INSERT VALUES bằng INSERT SELECT từ product theo product_id và is_active = TRUE. Nếu rows rỗng, ném INVALID_REFERENCE; giữ nguyên tham số truy vấn.
- Kiểm chứng: npm.cmd test PASS 73/73, FAIL 0; regression test sản phẩm ngừng kinh doanh chuyển từ FAIL trước sửa sang PASS. Test dùng pool.query giả lập, chưa thực thi SQL trên PostgreSQL thật.
- Việc tiếp theo: POST hiện xử lý code 23503 nhưng chưa xử lý message INVALID_REFERENCE mới, nên lỗi này sẽ trả 500. Cần ánh xạ sang 400 ở bước tiếp theo; chưa sửa route trong yêu cầu này.

### BUG-02 — Validation tiền khi tạo cơ hội (11/11/2026, US1/FR1)

- Theo mã người dùng phê duyệt, createOpportunity thay Number.isFinite bằng Number.isSafeInteger và giới hạn tối đa 999999999999999, giữ kiểm tra kiểu number/string, chuỗi rỗng và số âm. Giá trị thập phân bị chặn trước repository.
- Khác biệt còn tồn tại: [API contract](api-contract.md) mục 5 quy định tối đa 1000000000000 và không chấp nhận chuỗi; mã được yêu cầu vẫn chấp nhận chuỗi biểu diễn số nguyên. Đề xuất đối chiếu và thống nhất hợp đồng ở bước sau; chưa tự sửa hợp đồng hoặc validation cập nhật cơ hội.
- Kiểm chứng: regression test BUG-02 đã FAIL trước sửa (Missing expected rejection); sau sửa npm.cmd test PASS 72/72, FAIL 0, gồm kiểm tra repository.create không được gọi với 1.5. Chưa kiểm thử PostgreSQL thật.

### TD-23 — Bổ sung dữ liệu tham chiếu cho form tạo cơ hội (FR1)

- **Căn cứ** — Cải tiến form tạo cơ hội trong quá trình hoàn thiện FR1.
- **Quyết định** — **BỔ SUNG.** Nạp dữ liệu mô phỏng và cho phép chọn khách hàng, sản phẩm theo tên trong form.
- **Lý do** — Người dùng cần nhận biết đúng khách hàng và sản phẩm khi tạo cơ hội mà chỉ cần chọn từ danh sách có sẵn.
- **Ảnh hưởng** — Bổ sung seed 10 khách hàng mô phỏng và 8 sản phẩm. Form gọi `GET /api/opportunities/references` sau xác thực. API trả các trường cần cho danh sách chọn và loại số điện thoại khỏi phản hồi. Khách hàng tiếp tục được dùng làm dữ liệu tham chiếu của luồng L3.
- **Kiểm chứng** — Đã kiểm tra bằng bộ kiểm thử tự động, build frontend và API với PGlite ở bước phát triển. Phép dựng lại độc lập được theo dõi tại TD-19.


## Bổ sung 11/11/2026 — HTTP 409 cho chuyển giai đoạn sai quy tắc (FR5/US5)
- Theo mã người dùng cung cấp, sửa riêng catch của PATCH /api/opportunities/:id/stage: INVALID_STAGE_TRANSITION trả 409, INVALID_STAGE giữ 400. Giải quyết khác biệt 400/409 từng ghi ở TD-09; không đổi service/repository hoặc quy tắc chuyển giai đoạn.
- Kiểm chứng: node --check router PASS; node --test tests/opportunity.stage.service.test.js tests/opportunity.stage.repository.test.js PASS 14/14; script kiểm tra HTTP auth/service giả lập PASS 2/2 (409 và 400, JSON message giữ nguyên). Chưa chạy toàn bộ npm test, chưa kiểm thử PostgreSQL thật.
