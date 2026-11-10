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

### Bổ sung 10/11/2026 — Xác thực và phân quyền API sản phẩm
- Theo yêu cầu người dùng, dùng authenticate cho toàn bộ router sản phẩm; thêm requireProductManager trước ba route POST/PATCH/DELETE. SALES và MANAGER đã xác thực đều đọc được; chỉ MANAGER được ghi. Đây là bảo vệ CRUD sản phẩm đã có, không bổ sung chức năng nghiệp vụ L3 hoặc thay mã FR.
- Kiểm chứng: node --check src/routes/product.routes.js PASS; npm.cmd test PASS 60/60. Test HTTP mới dùng xác thực/service giả lập, kiểm tra 20 trường hợp trên 5 route: thiếu token hoặc token sai trả 401, SALES ghi trả 403, MANAGER đi tiếp vào service; yêu cầu bị chặn không gọi service. Chưa kiểm thử token thật/PostgreSQL thật.

### Bổ sung 10/11/2026 — FR8/US8 lọc giai đoạn ở backend
- Theo mẫu người dùng: repository getAll(user, stage = null) thêm AND ($4::varchar IS NULL OR o.stage = $4); giữ nguyên điều kiện quyền và JOIN. Service kiểm tra 4 mã TIEP_CAN/TU_VAN/BAO_GIA/CHOT, chỉ undefined được hiểu là không lọc; stage sai/rỗng trả INVALID_STAGE trước truy vấn. GET danh sách truyền req.query.stage, ánh xạ lỗi này sang HTTP 400. Tiếp tục che số điện thoại theo vai trò.
- Khác biệt API contract: tài liệu dùng CONTACT/CONSULTING/QUOTATION/CLOSED; bước này dùng các mã tiếng Việt hiện có trong code/PostgreSQL theo chỉ định người dùng, không đổi enum hoặc hợp đồng cũ.
- node --check 3 file và git diff --check PASS; chưa chạy npm test theo yêu cầu, chưa kiểm chứng SQL/HTTP thật. Nối React và cập nhật/bổ sung test FR8 ở bước sau (TC21–TC23); không coi FR8 đã hoàn tất.

### Bổ sung 10/11/2026 — Dữ liệu đọc FR2/FR3
- Bước 2–3 theo mẫu được người dùng cung cấp: FR2 đặt điện thoại trong thẻ small dưới tên khách hàng, cột Sản phẩm ngay sau Khách hàng và trước Nhu cầu; bổ sung emptyMessage cho DataState, mặc định "Không có dữ liệu để hiển thị.", danh sách dùng "Chưa có cơ hội bán hàng.". FR3 thay mã khách hàng/sản phẩm bằng tên và điện thoại; client dịch OPPORTUNITY_NOT_FOUND/UNAUTHENTICATED sang tiếng Việt. Không đổi mã HTTP hoặc phân quyền. Build, ESLint 4 file và 4 kiểm tra client giả lập PASS; chưa kiểm thử trình duyệt.
- Theo yêu cầu người dùng: JOIN customer/product trong getAll và getByIdForUser, trả customer_name, product_name, customer_phone; giữ nguyên WHERE và mảng tham số phân quyền (QT-14).
- Service che số điện thoại trước khi trả danh sách/chi tiết cho SALES: giữ 3 số đầu/cuối nếu dài từ 8 ký tự, che toàn bộ số ngắn hơn; MANAGER xem đầy đủ (QT-15). React hiển thị tên khách hàng, sản phẩm và số điện thoại do API trả về.
- Khác biệt với API contract: code hiện trả 404 OPPORTUNITY_NOT_FOUND cho cả ngoài phạm vi và ID không tồn tại, còn hợp đồng mô tả ngoài phạm vi là 403. Giữ nguyên hành vi hiện tại theo yêu cầu bảo toàn lọc quyền; chưa sửa hợp đồng hoặc mở rộng phạm vi.
- Kiểm chứng: 59/59 test PASS; build PASS; ESLint hai trang sửa PASS. Lint toàn frontend FAIL tại OpportunityReport.jsx và CreateOpportunityPage.jsx do react-hooks/set-state-in-effect có sẵn. Test dùng SQL/params và repository/xác thực giả lập, chưa thực thi SQL trên PostgreSQL thật hoặc kiểm thử trình duyệt. Clone sạch để sau.

Theo yêu cầu sinh viên: seed 10 khách hàng mô phỏng và 8 sản phẩm; form tạo chọn tên qua GET /api/opportunities/references có xác thực, không trả số điện thoại. Không thêm CRUD khách hàng. AI soạn code; kiểm chứng bằng unit test, build và API PGlite; cần xác nhận trên máy sinh viên.




## Bổ sung 10/11/2026 — React FR8/US8
- Theo yêu cầu người dùng: getOpportunities(stage = '') gửi stage qua encodeURIComponent, bỏ query khi chọn Tất cả. Trang danh sách thêm stageFilter, tải lại theo [retry, stageFilter]; ô chọn Tất cả/Tiếp cận/Tư vấn/Báo giá/Chốt nằm trước DataState để sử dụng được khi rỗng/lỗi. Giữ nguyên quyền và che số ở backend.
- Cập nhật test tham số SQL, bổ sung kiểm tra lọc/bỏ lọc và stage sai/rỗng/query lặp (TC21–TC23). Kết quả mới: 63/63 test PASS; build và ESLint hai file sửa PASS; 4/4 kiểm tra URL giả lập PASS. Chưa kiểm thử trình duyệt/PostgreSQL thật; kết quả này cập nhật bước backend trước đó vốn chưa chạy test.
