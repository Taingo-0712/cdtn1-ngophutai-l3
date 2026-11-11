# Boi canh du an CDTN1 - L3: Co hoi ban hang va pheu ban

> Nguon ban dau: tai lieu va lich su trao doi trong ChatGPT Project CDTN1, doi chieu voi ban ZIP `cdtn1-ngophutai-l3.zip` duoc cung cap ngay 25/10/2026.
> Day la **ban tom tat chuyen ngu canh**, khong phai dong bo truc tiep voi ChatGPT. Truoc khi sua code, doi chieu lai cac file va git status trong workspace hien tai.

## 1. Tong quan
- Hoc phan: Chuyen de tot nghiep 1 (HK1 2026-2027), track Software Engineering (SE).
- Case study: Smart CRM - Mekong Mobile, doanh nghiep mo phong.
- Luong ca nhan: **L3 - Co hoi ban hang va pheu ban**.
- Nghiep vu: nhan vien ban hang ghi nhan co hoi, theo doi chuyen giai doan **Tiep can -> Tu van -> Bao gia -> Chot**, ghi nhan ket qua. Quan ly cua hang xem pheu ban hang.
- Pham vi KHONG lam theo SRS: du bao doanh thu; don hang, thanh toan, kho, bao hanh; tao/gop ho so khach hang; bao cao toan cong ty.
- Cong nghe da thay trong repo: Node.js, Express, PostgreSQL, `pg`, `dotenv`, JavaScript CommonJS; Bootstrap du kien su dung o frontend.

## 2. Tai lieu nguon can doi chieu
- `docs/srs.md`: pham vi, User Stories, FR, NFR, business rules, AC va truy vet. Uu tien file nay khi xac dinh **yeu cau**.
- `docs/api-contract.md`: hop dong API da dac ta.
- `docs/architecture.drawio`, `docs/erd.drawio`, `docs/usecase.drawio`, `docs/wireframe.png`: so do thiet ke va giao dien da nop.
- `docs/schema.sql`: DDL thiet ke; `migrations/*.sql`: DDL da hien thuc.
- `docs/thay-doi-thiet-ke.md`: phan hoi BT1 va cac quyet dinh thay doi.
- `README.md`: cach dung/moi truong/tinh trang theo lan cap nhat truoc; phai doi chieu code hien hanh.
- `docs/ai-disclosure.md`: khai bao AI phai tiep tuc cap nhat trung thuc.

## 3. Yeu cau nghiep vu chinh (tom tat, khong thay the SRS)
- SRS trong ZIP co **9 User Stories**, duoc truy vet voi 9 FR va 9 Use Cases; xem chi tiet ma va muc do MoSCoW tai SRS.
- Cac nghiep vu noi bat: tao co hoi, xem danh sach/chi tiet, cap nhat thong tin, chuyen giai doan, ghi nhan ket qua thanh cong/that bai, xem pheu va lich su.
- BR du kien trong SRS: chuyen giai doan tuan tu; chi ghi ket qua o Chot; neu that bai thi co ly do; chuyen giai doan + ghi lich su phai cung transaction; pheu dem moi co hoi mot lan theo stage hien tai.
- QT-14: gioi han du lieu theo don vi/nguoi duoc phan quyen. QT-15: che so dien thoai voi nhan vien theo vai tro.
- NFR trong SRS: p95 <= 2 giay voi du lieu/tai mo phong cu the; tu choi 100% truy cap trai phep; khong duoc co cap nhat stage thieu lich su khi loi.
- Luu y: SRS phan biet ro quy tac tu case study va quy tac de xuat can xac nhan. Dung code khong duoc bien gia dinh thanh 'quy tac da duyet' neu chua co bang chung.

## 4. Co so du lieu va kien truc
- 6 bang ERD: `store`, `app_user`, `customer`, `product`, `opportunity`, `opportunity_stage_history`.
- Thu muc code trong ZIP: `src/routes/opportunity.routes.js`, `src/services/opportunity.service.js`, `src/repositories/opportunity.repository.js`, `src/db.js`, `src/index.js`.
- Cac migration 001-007 va `seeds/001_seed_demo.sql` da co trong ZIP.
- Bieu thuc phu thuoc: HTTP route -> business service -> data repository -> PostgreSQL.

## 5. Trang thai duoc kiem tra TU MA NGUON ZIP (khong phai ket qua chay lai)
- `src/index.js`: dang ky `/api/opportunities`; co `GET /health` kiem tra ket noi PostgreSQL; port mac dinh 3000.
- `src/routes/opportunity.routes.js`: hien dinh nghia GET danh sach, GET chi tiet, POST tao, PATCH cap nhat, DELETE xoa co hoi.
- `src/services/opportunity.service.js`: co validation khi tao/cap nhat (truong bat buoc, nhu cau rong, gia tri du kien am).
- `src/repositories/opportunity.repository.js`: co cau lenh SQL cho cac thao tac tren.
- `tests/opportunity.service.test.js`: hien co 1 test kiem gia tri du kien am.
- `package.json`: `npm start` va `npm test` (Node built-in test runner).
- **Chua co bang chung da chay lai o lan kiem tra nay.** README ghi '1 PASS' la ket qua tu bao cao truoc do, khong phai test moi.
- README muc 'cong viec tiep theo' co the chua cap nhat kip code: no neu CRUD chua hoan thien, trong khi routes va repository da co CRUD. Can kiem chung **hanh vi thuc te**, khong danh dong 'co ham' voi 'da kiem thu chay dung'.

## 6. Viec dang can giai quyet (uu tien doi chieu thuc te truoc khi lam)
1. Doi chieu code voi SRS/API contract, xac nhan endpoint nao dung request/response/ma loi va phan quyen.
2. Kiem thu du 3 loai (luong dung, gia tri bien, du lieu sai), uu tien rules tai `service`.
3. Hoan thien cap nhat stage + ghi `opportunity_stage_history` cung transaction, neu chua co.
4. Trien khai/kiem chung ghi nhan ket qua, phan quyen va che so dien thoai neu thuoc pham vi duoc chot.
5. Xay dung giao dien ket noi API that, xu ly loading/empty/error, theo 3 man hinh wireframe.
6. Cap nhat README va nhat ky thay doi thiet ke; kiem thu end-to-end theo yeu cau BT2.

## 7. Diem can than trong
- `docs/thay-doi-thiet-ke.md` ghi lai viec giu **9 User Stories** du de BT1 goi y 5-7. Day la quyet dinh da ghi nhan, khong tu y sua ma US/FR.
- File code co `DELETE /api/opportunities/:id`, nhung yeu cau SRS can duoc doi chieu de xac dinh xoa co hoi co thuoc pham vi hay khong. Khong mac dinh no duoc phe duyet chi vi endpoint da ton tai.
- ZIP duoc cung cap co chua `.env`; file do co the chua thong tin nhay cam. **Khong dua `.env` vao GitHub, khong gui lai file do cho AI va khong ghi gia tri bi mat vao bao cao**. `.gitignore` da co quy tac bo qua `.env`, nhung ZIP khong tu dong bo qua file nay.

## 8. Cach chuyen ngu canh qua lai giua ChatGPT va Codex
### Trang thai duoc xac minh — 11/11/2026
- BUG-03 bước route, 11/11/2026: thêm INVALID_REFERENCE vào danh sách lỗi 400 của POST, giải quyết điểm còn lại ghi bên dưới. Script kiểm tra HTTP với xác thực/repository giả lập PASS: status 400, JSON { "message": "INVALID_REFERENCE" }. Chưa kiểm thử PostgreSQL thật; chưa chạy lại toàn bộ bộ test trong bước này.
- BUG-03 sau sửa, 11/11/2026 (US1/FR1): repository.create dùng INSERT SELECT chỉ chọn sản phẩm is_active = TRUE, ném INVALID_REFERENCE khi không có bản ghi trả về. npm.cmd test PASS 73/73, FAIL 0, gồm regression test sản phẩm ngừng kinh doanh; cập nhật bằng chứng FAIL trước sửa bên dưới. Chưa kiểm thử PostgreSQL thật. Còn lại: route POST chỉ ánh xạ code 23503 sang 400, lỗi message INVALID_REFERENCE mới sẽ rơi vào 500; cần bổ sung xử lý route ở bước sau.
- BUG-03 (US1/FR1), 11/11/2026: tạo tests/opportunity.create.repository.test.js theo mã người dùng cung cấp, mock pool.query để kiểm tra SQL lọc sản phẩm đang hoạt động và lỗi INVALID_REFERENCE. Chạy riêng file: PASS 0, FAIL 1, Missing expected rejection; repository.create hiện INSERT VALUES không lọc is_active. Chưa sửa repository, chưa có bằng chứng PASS sau sửa, chưa chạy lại toàn bộ bộ test. Không ghi DB thật; chưa xác minh SQL trên PostgreSQL.
- BUG-02 sau sửa, 11/11/2026 (US1/FR1): createOpportunity dùng Number.isSafeInteger và giới hạn 0–999999999999999 theo mã người dùng duyệt. npm.cmd test PASS 72/72, FAIL 0, gồm regression test BUG-02; đây là bằng chứng PASS sau lần FAIL bên dưới. Chưa kiểm thử PostgreSQL thật. Validation cập nhật cơ hội chưa thay đổi; khác biệt ngưỡng với API contract được ghi trong nhật ký thiết kế.
- FR5/US5: route PATCH /api/opportunities/:id/stage đã đổi INVALID_STAGE_TRANSITION từ HTTP 400 sang 409 theo API contract; INVALID_STAGE vẫn 400. Chỉ đổi ánh xạ HTTP, giữ quy tắc nghiệp vụ. Kiểm chứng 11/11/2026: node --check router PASS; 14/14 test stage service/repository PASS; 2/2 kiểm tra HTTP với auth/service giả lập PASS. Chưa chạy toàn bộ npm test, chưa kiểm thử PostgreSQL thật.
- BUG-02 (US1/FR1), 11/11/2026: thêm regression test người dùng cung cấp vào cuối tests/opportunity.service.test.js cho expected_value = 1.5. Chạy node --test tests/opportunity.service.test.js: PASS 1, FAIL 1; test mới FAIL với Missing expected rejection. Dùng repository.create giả lập, không ghi DB thật. Đây là bằng chứng trước sửa; chưa sửa Service, chưa xác minh PASS sau sửa, chưa chạy toàn bộ bộ test.
- TC-02 FR4: thêm test riêng cuối tests/opportunity.update.test.js theo mã người dùng; expected_value = -1 bị từ chối với INVALID_EXPECTED_VALUE và updateForOwner không được gọi. Chạy node --test tests/opportunity.update.test.js PASS 8/8, FAIL 0; dùng mock, không ghi DB thật. Chưa chạy lại toàn bộ npm test trong bước này.
- Cập nhật sau bước React FR8: getOpportunities(stage) gửi query đã encode, bỏ query khi chọn Tất cả; trang danh sách dùng stageFilter và dependency [retry, stageFilter], ô chọn nằm trước DataState. Đã cập nhật tham số SQL trong test, bổ sung ca 4 stage/bỏ lọc/sai/rỗng/query lặp, bảo toàn danh tính và che điện thoại.
- Kết quả mới: npm.cmd test PASS 63/63; build frontend PASS; ESLint hai file sửa PASS; 4/4 kiểm tra URL với fetch giả lập PASS. HTTP dùng xác thực/repository giả lập, SQL dùng pool giả lập; chưa kiểm thử trình duyệt/PostgreSQL thật; clone sạch chưa thực hiện. Kết quả này cập nhật trạng thái chưa chạy test ở bước backend bên dưới.
- FR8/US8 — backend lọc giai đoạn: getAll nhận stage mặc định null, thêm điều kiện SQL $4 và tham số thứ tư; service chấp nhận TIEP_CAN/TU_VAN/BAO_GIA/CHOT, từ chối giá trị khác (kể cả chuỗi rỗng) trước truy vấn; GET danh sách đọc req.query.stage, trả 400 INVALID_STAGE khi sai. Giữ nguyên phạm vi quyền và che điện thoại.
- Kiểm chứng bước FR8 backend: node --check cả 3 file PASS; git diff --check PASS. Theo yêu cầu người dùng chưa chạy npm test, chưa nối React/chạy API hoặc PostgreSQL thật. Bước sau cần cập nhật kỳ vọng tham số getAll trong tests/opportunity.read.test.js (thêm null khi không lọc), bổ sung ca FR8 rồi chạy test sau khi nối React; kết quả 60/60 trước đó không phải kết quả của thay đổi FR8 này.
- API sản phẩm: theo yêu cầu người dùng, toàn bộ router dùng authenticate; POST/PATCH/DELETE chỉ cho MANAGER, GET cho tài khoản đã xác thực. node --check router PASS; npm.cmd test PASS 60/60, gồm test HTTP mới với 20 trường hợp (5 route × thiếu token/token sai/SALES/MANAGER), xác thực và service giả lập; yêu cầu bị chặn không gọi service. Chưa kiểm thử token thật/PostgreSQL thật.
- Bước 2–3: FR2 gộp điện thoại dưới tên khách hàng, cột Sản phẩm ngay sau Khách hàng và trước Nhu cầu; DataState nhận emptyMessage với mặc định cũ, trang danh sách dùng "Chưa có cơ hội bán hàng.". FR3 bỏ mã khách hàng/sản phẩm; client dịch lỗi OPPORTUNITY_NOT_FOUND và UNAUTHENTICATED sang thông báo tiếng Việt theo yêu cầu.
- Kiểm chứng bổ sung bước 2–3: build frontend PASS; ESLint cả 4 file React/API thay đổi PASS; 4/4 kiểm tra client với fetch giả lập PASS (404, 401, 403 và danh sách rỗng 200). Chưa kiểm thử trình duyệt/PostgreSQL thật; clone sạch vẫn để sau.
- FR2 danh sách và FR3 chi tiết: thêm customer_name/product_name/customer_phone qua JOIN, bảo toàn WHERE và tham số lọc quyền; service che điện thoại SALES trước phản hồi API, MANAGER nhận số đầy đủ; React hiển thị các trường này.
- Đã chạy: npm.cmd test PASS 59/59; build frontend PASS; ESLint hai trang chỉnh sửa PASS; git diff --check PASS. Lint toàn frontend FAIL vì hai lỗi set-state-in-effect có sẵn trong OpportunityReport.jsx và CreateOpportunityPage.jsx.
- Test mới dùng pool/repository/xác thực giả lập; kiểm tra SQL/params, che số, HTTP có quyền/ngoài quyền/không tồn tại/thiếu token. Chưa chạy PostgreSQL thật hoặc kiểm thử trình duyệt. Ngoài quyền vẫn trả 404 như code hiện tại, khác 403 trong API contract; xem nhật ký thiết kế. Clone sạch chưa thực hiện.

- ChatGPT Project CDTN1: noi phan tich bai giang, doi chieu case study, ra quyet dinh.
- Sau quyet dinh quan trong: cap nhat tom tat chinh xac vao file nay va/hoac `docs/thay-doi-thiet-ke.md`.
- Codex: doc file nay va cac file nguon trong repo, sau do moi sua code theo nhiem vu duoc phe duyet.
- Ket thuc phien Codex: ghi ket qua da kiem chung, file sua, test pass/fail, van de con lai vao file nay; muon ChatGPT Project biet thay doi thi can dua ban cap nhat/tep vao cuoc tro chuyen hoac nguon cua Project. **Khong co dong bo ngu canh tu dong hai chieu.**


## Cập nhật 01/11/2026 — Hoàn thiện quyền thao tác L3
- Thay đổi: xóa/chuyển giai đoạn/ghi kết quả nhận tài khoản xác thực; chỉ SALES thao tác cơ hội phụ trách, SQL giới hạn owner và store. changed_by lấy từ tài khoản xác thực. Xóa cơ hội có lịch sử bị FK chặn và trả 409 OPPORTUNITY_HAS_HISTORY.
- Vì sao: tránh vượt quyền qua gọi API trực tiếp; truy vết FR5, FR6, QT-14.
- Ảnh hưởng: 3 lớp Backend, test nghiệp vụ và giao diện đăng nhập/token; form tạo bỏ owner_id. Không thêm quản lý tài khoản.
- Kiểm chứng: 39/39 test tự động PASS với repository/kết nối giả lập; chưa chạy PostgreSQL thật hoặc kiểm thử trình duyệt. Build tại môi trường Linux bị chặn bởi binding native Windows trong ZIP; cần npm run build trên máy sinh viên.


## 01/11/2026 — Phễu và lịch sử (FR7, FR9)
- Phễu chỉ cho MANAGER, nhóm theo stage hiện tại trong cửa hàng; trả đủ bốn stage, kể cả 0.
- Lịch sử kiểm tra quyền xem cơ hội, sắp thời gian và history_id tăng dần. Thêm bảng hiển thị với loading/empty/error.
- Giao diện quản lý ẩn thao tác chuyển giai đoạn/ghi kết quả, Backend vẫn kiểm tra quyền.
- AI soạn code và test; kiểm chứng tự động và API PGlite, chưa kiểm thử trình duyệt/PostgreSQL 16 trên máy sinh viên.
