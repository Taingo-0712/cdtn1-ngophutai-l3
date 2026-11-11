# TEST REPORT — BUỔI 14 (KẾT QUẢ KIỂM THỬ VÀ KIỂM THỬ BỔ SUNG)

**Dự án:** Smart CRM — Mekong Mobile, luồng L3 Cơ hội bán hàng  
**Sinh viên:** Ngô Phú Tài · **Track:** SE  
**Phạm vi:** 12 test case theo kế hoạch ban đầu (7 unit, 3 integration, 2 system/API) và 3 ca kiểm thử bổ sung sau khi phát hiện lỗi (TC-13 đến TC-15).  
**Trạng thái:** 15/15 ca đã có kết quả PASS sau khi khắc phục ba lỗi. Tại thời điểm phát hiện, TC-13 đến TC-15 từng FAIL; bảng bên dưới ghi kết quả cuối cùng, đồng thời giữ lịch sử FAIL trước sửa.  
**Lưu ý nguồn kết quả:** TC-01 đến TC-12 được cập nhật từ các lần kiểm thử người thực hiện đã cung cấp trong quá trình làm bài. File đính kèm ban đầu là bản thiết kế chưa điền kết quả, nên cần đối chiếu lại tên ảnh minh chứng tại repo trước khi nộp.

**Quy ước:** PASS/FAIL trong cột cuối là **kết quả kiểm thử sau sửa (nếu có)**. Kết quả FAIL trước sửa được giữ tại cột “Kết quả thực tế” và ảnh minh chứng. ID `95`, `2`, `19`, `20` là ID đã quan sát trong **môi trường kiểm thử cụ thể**, không phải ID cố định cho mọi lần chạy. Không sử dụng ảnh unit/mock để thay thế bằng chứng PostgreSQL thật.

## 1. Bảng 15 test case (12 theo kế hoạch + 3 bổ sung)

| Mã | Tiền điều kiện | Các bước | Dữ liệu thử | Kết quả mong đợi | Mức ưu tiên | Kết quả thực tế | PASS / FAIL |
|---|---|---|---|---|---|---|---|
| TC-01 | Unit: repository giả lập; SALES hợp lệ; cơ hội CHOT, result=null | 1. Gọi service cập nhật cơ hội. 2. Kiểm tra giá trị gửi tới repository | `expected_value: "0"` | Service chấp nhận biên dưới, repository nhận số `0`; không phát sinh lỗi validation (không dùng unit mock làm bằng chứng COMMIT thật). | Cao | PASS: service chấp nhận `"0"` và chuyển giá trị `0` tới repository giả lập. | PASS |
| TC-02 | Unit: SALES hợp lệ; stub ghi dữ liệu | 1. Gọi service cập nhật cơ hội. 2. Xác nhận không ghi | `expected_value: -1` | Từ chối với `INVALID_EXPECTED_VALUE`; số lần gọi ghi dữ liệu bằng 0. | Cao | PASS: `-1` bị từ chối bằng `INVALID_EXPECTED_VALUE`; không gọi ghi dữ liệu. | PASS |
| TC-03 | Unit: cơ hội ở `TIEP_CAN`, chưa có kết quả; SALES là chủ sở hữu | 1. Gọi service chuyển giai đoạn. 2. Kiểm tra repository | `TIEP_CAN → TU_VAN` | Chuyển hợp lệ, repository được gọi đúng 1 lần với giai đoạn `TU_VAN`. | Cao | PASS: `TIEP_CAN → TU_VAN` hợp lệ; repository được gọi đúng theo giai đoạn mới. | PASS |
| TC-04 | Unit: cơ hội ở `CHOT`, result=null | 1. Gọi service ghi thất bại. 2. Xác nhận không lưu | `result: "THAT_BAI"`, `failure_reason: "   "` | Từ chối `FAILURE_REASON_REQUIRED`; repository không ghi kết quả. | Cao | PASS: `failure_reason` chỉ có khoảng trắng bị từ chối; không ghi kết quả. | PASS |
| TC-05 | Unit: tài khoản SALES hợp lệ | 1. Gọi service lấy phễu. 2. Kiểm tra repository | `role: "SALES"`, `store_id: 1` | `FORBIDDEN`; phương thức đọc phễu không được gọi. | Cao | PASS: SALES bị từ chối xem phễu; repository đọc phễu không được gọi. | PASS |
| TC-06 | Unit: SALES thuộc cửa hàng 1; repository giả trả cơ hội chứa số điện thoại | 1. Lấy danh sách với lọc giai đoạn. 2. Kiểm tra tham số gửi repository và số điện thoại | `stage: "TU_VAN"`, `phone: "0900000123"` | Vẫn truyền thông tin người dùng vào điều kiện truy vấn, lọc `TU_VAN`; số điện thoại trả về cho SALES là `090****123`. | Trung bình | PASS: lọc `TU_VAN` vẫn mang phạm vi người dùng và số điện thoại được che; 2 kiểm tra liên quan đạt. | PASS |
| TC-07 | Unit: cùng một dữ liệu khách hàng, hai vai trò | 1. Đọc danh sách/chi tiết với SALES. 2. Đọc với MANAGER | `phone: "0900000123"` | SALES nhận `090****123`; MANAGER được nhận `0900000123`; dữ liệu gốc không bị sửa. | Cao | PASS: SALES nhận số đã che, MANAGER nhận số đầy đủ trong kiểm thử phân quyền dữ liệu. | PASS |
| TC-08 | PostgreSQL thật `mekong_mobile_l3`, SALES đã đăng nhập, customer/product hợp lệ | 1. Gửi `POST /api/opportunities` bằng Postman. 2. SELECT cơ hội mới trong PostgreSQL. 3. Đối chiếu trạng thái và thông tin sở hữu | `customer_id: 3`, `product_id: 4`, `need_desc: "Kiem thu tich hop TC-08"`, `expected_value: 15000000` | Tạo được cơ hội ở `TIEP_CAN`, `result=NULL`, gắn customer/product và SALES hợp lệ | Cao | PASS: Postman tạo được cơ hội ID `95` với `customer_id=3`, `product_id=4`, `expected_value=15000000`; SELECT xác nhận `TIEP_CAN`, `result=NULL`. Đã thực hiện trên DB `mekong_mobile_l3` (khác DB TEST dự kiến); không có bằng chứng đã dọn bản ghi ID 95. | PASS |
| TC-09 | PostgreSQL TEST; cơ hội ở `TIEP_CAN`; số lịch sử ban đầu đã ghi | 1. Gây lỗi INSERT lịch sử có kiểm soát. 2. Thử chuyển `TU_VAN`. 3. Đọc lại bảng cơ hội và lịch sử. 4. Hoàn tác cách gây lỗi | `TIEP_CAN → TU_VAN`; lỗi INSERT trong transaction thử | Giao dịch rollback: stage vẫn `TIEP_CAN`, số dòng lịch sử không tăng; không còn thay đổi dở dang. | Cao | PASS: chạy Repository thật + PostgreSQL TEST với trigger gây lỗi lịch sử; cơ hội ID `2` giữ nguyên `TIEP_CAN`, lịch sử không tăng, trigger đã dọn. | PASS |
| TC-10 | Database TEST riêng (không dùng DB nghiệp vụ cá nhân); đã ghi số dòng các bảng | 1. Chạy migrations 001–008 và seeds theo README. 2. Ghi số lượng bản ghi. 3. Chạy lại cùng chuỗi. 4. So sánh | Migrations 001–008; seeds 001, 002, 004 | Cả hai lần không lỗi; số bản ghi bảng nền không tăng ngoài dự kiến; không sinh bản ghi trùng. | Cao | PASS: chạy lại migrations 001–008 và seeds 001/002/004 trên DB TEST; không tăng số bản ghi ngoài dự kiến. Lưu ý seed đăng nhập có thể cập nhật lại password hash. | PASS |
| TC-11 | Backend và PostgreSQL thử đang chạy; đăng nhập SALES, lấy token thật | 1. Đếm opportunity trước. 2. POST tạo cơ hội thiếu `customer_id`. 3. Đếm lại | `POST /api/opportunities`, body `{ "product_id": 1, "need_desc": "Mua điện thoại", "expected_value": 10000000 }` (điền `product_id` hợp lệ từ DB thử) | HTTP `400`, JSON `message: "MISSING_REQUIRED_FIELDS"`; số cơ hội trước/sau không đổi. | Cao | PASS: Postman HTTP `400`, `MISSING_REQUIRED_FIELDS`; truy vấn xác nhận không có cơ hội mang nội dung thử nghiệm. | PASS |
| TC-12 | Backend/PostgreSQL thử đang chạy; đăng nhập SALES; ID chọn chắc chắn không có | 1. Xác nhận ID không tồn tại trong DB. 2. GET chi tiết theo ID. | `GET /api/opportunities/999999` nếu ID này không tồn tại | HTTP `404`, JSON `message: "OPPORTUNITY_NOT_FOUND"`; không trả dữ liệu cơ hội khác. | Trung bình | PASS: xác nhận ID `999999` không tồn tại; Postman HTTP `404`, `OPPORTUNITY_NOT_FOUND`. | PASS |
| TC-13 | System/API; Backend có SALES hợp lệ; cơ hội ID `95` ở `TIEP_CAN`; API Contract quy định HTTP `409` | 1. Gửi `PATCH /api/opportunities/95/stage` với `BAO_GIA` (bỏ qua `TU_VAN`). 2. Quan sát HTTP Status trước sửa. 3. Sửa ánh xạ lỗi ở Route. 4. Gửi lại cùng dữ liệu | `{ "stage": "BAO_GIA" }` | Từ chối `INVALID_STAGE_TRANSITION`, HTTP `409`; giai đoạn không bị chuyển sai | Cao | **Trước sửa FAIL:** Postman trả `400` với `INVALID_STAGE_TRANSITION`. **Sau sửa PASS:** Postman trả `409` với cùng mã lỗi; 14/14 unit test chuyển giai đoạn PASS. | PASS |
| TC-14 | Unit: Service tạo cơ hội, repository giả lập; test kiểm tra dữ liệu trước khi ghi | 1. Gọi `createOpportunity()` với `expected_value=1.5`. 2. Xác minh từ chối và repository không được gọi. 3. Sửa kiểm tra số nguyên. 4. Chạy lại regression test | `customer_id: 1`, `product_id: 1`, `need_desc: "Kiem thu BUG-02"`, `expected_value: 1.5` | Từ chối `INVALID_EXPECTED_VALUE`, số lần gọi `repository.create` là `0` | Cao | **Trước sửa FAIL:** `Missing expected rejection`, Service nhận `1.5` và gọi Repository. **Sau sửa PASS:** regression test 1/1; toàn bộ test tại mốc sửa BUG-02 đạt 72/72. | PASS |
| TC-15 | Integration + System/API; PostgreSQL TEST `mekong_mobile_l3_tc10`; sản phẩm ID `19` có `is_active=false`; SALES hợp lệ | 1. Kiểm tra trạng thái sản phẩm. 2. Gọi tạo cơ hội qua Service/Repository thật trước sửa trong transaction và ROLLBACK. 3. Sửa kiểm tra `is_active` và ánh xạ lỗi. 4. Kiểm thử lại PostgreSQL thật và POST API tại cổng `3001` | `customer_id: 1`, `product_id: 19`, `need_desc: "Kiem thu san pham da ngung kinh doanh"`, `expected_value: 1000000` | Backend từ chối `INVALID_REFERENCE`, HTTP `400`, không tạo cơ hội với sản phẩm ngừng kinh doanh | Cao | **Trước sửa FAIL:** Service tạo được cơ hội thử ID `20` dù sản phẩm inactive; giao dịch được ROLLBACK và xác nhận ID `20` không còn. **Sau sửa PASS:** Service/PG thật trả `INVALID_REFERENCE`; Postman trả HTTP `400`; toàn bộ test 73/73 PASS. | PASS |

## 2. Truy vết, loại test và vị trí mã nguồn

| Mã | Yêu cầu / loại | Tầng | Nguồn thực hiện | Minh chứng (kiểm tra file thực tế) |
|---|---|---|---|---|
| TC-01 | FR4 · Giá trị biên đúng 0 | Unit | `tests/opportunity.update.test.js` (đã có) | `docs/screenshots/TC-01 – Giá trị bằng 0.png` |
| TC-02 | FR4 · Giá trị biên âm -1 | Unit | `tests/opportunity.update.test.js` (đã có) | `docs/screenshots/TC-02 – Giá trị âm.png` |
| TC-03 | FR5 · Luồng đúng | Unit | `tests/opportunity.stage.service.test.js` (đã có) | `docs/screenshots/TC-03 – Chuyển giai đoạn.png` |
| TC-04 | FR6 · Dữ liệu sai | Unit | `tests/opportunity.result.service.test.js` (đã có) | `docs/screenshots/TC-04 – Thiếu lý do thất bại.png` |
| TC-05 | FR7 / NFR2 · Bảo mật | Unit | `tests/opportunity.reports.test.js` (đã có) | `docs/screenshots/TC-05 – Phân quyền xem phiễu.png` |
| TC-06 | FR8 / QT-15 · Lọc và che số | Unit | `tests/opportunity.read.test.js` (đã có) | `docs/screenshots/TC-06 – Kiểm thử lọc giai đoạn và phân quyền.png` |
| TC-07 | FR2, FR3 / QT-15 · Bảo mật dữ liệu | Unit | `tests/opportunity.read.test.js` (đã có) | `docs/screenshots/TC-07 – Bảo vệ số điện thoại.png` |
| TC-08 | FR1 · Luồng đúng, dữ liệu thực | Integration/API | Postman POST + SELECT PostgreSQL thật, cơ hội ID `95` | `docs/screenshots/TC-08 – Tạo cơ hội_API.png`, `docs/screenshots/TC-08 – Tạo cơ hội_DB.png` |
| TC-09 | FR5, FR9 / NFR3 · Tính nhất quán | Integration | Repository thật + PostgreSQL TEST, trigger gây lỗi lịch sử có kiểm soát, xác nhận ROLLBACK ID `2` | `docs/screenshots/TC-09-Integration-RepositoryThat-PostgreSQLThat-LoiGhiLichSu-CoHoi2.png`, `docs/screenshots/TC-09-Integration-XacNhanRollback-GiuNguyenGiaiDoanVaLichSu-CoHoi2.png`, `docs/screenshots/TC-09-SQL-TrucTiep-RollbackKhiGhiLichSuLoi-CoHoi95.png` |
| TC-10 | Tái lập hệ thống | Integration / môi trường | Chạy migration + seed hai lần trên DB thử theo README | `docs/screenshots/TC-10-Migration-ChayLaiLan2-KhongTaoTrung.png`, `docs/screenshots/TC-10-Seed001-KhongTaoTrung(1).png`, `docs/screenshots/TC-10-Seed001-KhongTaoTrung(2).png`, `docs/screenshots/TC-10-Seed002-KhongTaoTrung(1).png`, `docs/screenshots/TC-10-Seed002-KhongTaoTrung(2).png`, `docs/screenshots/TC-10-Seed002-KhongTaoTrung(3).png`, `docs/screenshots/TC-10-Seed004-KiemTraKhongTrungDuLieu-Lan2.png` |
| TC-11 | FR1 · Dữ liệu sai, HTTP 400 | System/API | Postman hoặc script gọi backend + database thật | `docs/screenshots/TC-11 — Kiểm thử API tạo cơ hội khi thiếu customer_id.png` |
| TC-12 | FR3 · ID không tồn tại, HTTP 404 | System/API | Postman hoặc script gọi backend + database thật | `docs/screenshots/TC-12 — Kiểm thử xem cơ hội không tồn tại.png` |
| TC-13 | FR5 · Chuyển giai đoạn / BUG-01 · Sai HTTP Status | System/API, unit liên quan | `src/routes/opportunity.routes.js`; Postman; `tests/opportunity.stage.service.test.js` | `docs/screenshots/TC-13-API-KetQuaTest-HTTP400-FAIL.png`, `docs/screenshots/BUG-01-SauSua-HTTP409.png` |
| TC-14 | FR1 · Tạo cơ hội / BUG-02 · Giá trị thập phân | Unit (repository mock) | `src/services/opportunity.service.js`; `tests/opportunity.service.test.js` | `docs/screenshots/TC-14-Unit-KetQuaTest-GiaTriThapPhan-FAIL.png`, `docs/screenshots/BUG-02-SauSua-TuChoiThapPhan_TestPASS.png` |
| TC-15 | FR1 · Tạo cơ hội / BUG-03 · Sản phẩm ngừng kinh doanh | Integration (PG thật) + System/API + Unit mock | `src/repositories/opportunity.repository.js`, `src/routes/opportunity.routes.js`; `tests/opportunity.create.repository.test.js`; Postman | `docs/screenshots/TC-15-Integration-KetQuaTest-SanPhamNgung-FAIL.png`, `docs/screenshots/BUG-03-SauSua-TuChoiTaoCoHoiSPNgungKinhDoanh_IntegrationPASS.png`, `docs/screenshots/BUG-03-SauSua-TuChoiTaoCoHoiSPNgungKinhDoanh_API-HTTP400.png`; `docs/screenshots/BUG-03-SauSua-TuChoiTaoCoHoiSPNgungKinhDoanh_TestPASS.png` |

**Nhóm yêu cầu được bao phủ:** Luồng đúng (TC-03, TC-08); giá trị biên và kiểm tra định dạng số (TC-01, TC-02, TC-14); dữ liệu sai / ngoại lệ API (TC-04, TC-11, TC-12, TC-13, TC-15); bảo mật / chất lượng dữ liệu (TC-05, TC-06, TC-07, TC-09); tái lập môi trường (TC-10).

**Liên kết commit sửa lỗi:** [BUG-01 — `36204ce`](https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/36204ce) · [BUG-02 — `71f0e62`](https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/71f0e62) · [BUG-03 — `ccb4417`](https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/ccb4417).

*Tên ảnh TC-13 đến TC-15 tham chiếu đúng tên file thực tế trong `screenshots.zip`: ảnh FAIL dùng tiền tố `TC-`, một số ảnh Debug/PASS dùng tiền tố `BUG-`. Không cần đổi tên ảnh.*

## 3. Tổng kết kết quả

| Chỉ số | Kết quả | Ghi chú |
|---|---:|---|
| Ca trong kế hoạch ban đầu | 12 | TC-01 đến TC-12; kết quả đã được cung cấp trong quá trình làm bài |
| Ca bổ sung sau khi phát hiện lỗi | 3 | TC-13 đến TC-15; **đã có FAIL trước sửa** và PASS sau sửa |
| Tổng số ca có kết quả sau sửa | **15/15** | **15 PASS, 0 FAIL còn mở** |
| Bộ kiểm thử tự động sau sửa BUG-03 | **73/73 PASS** | Kết quả `npm test`, không đồng nghĩa toàn bộ 15 ca đều là unit test |
| Lỗi đã sửa và có commit riêng | **3/3** | BUG-01, BUG-02, BUG-03 |

**Diễn biến:** 12 ca ban đầu đã được báo cáo đạt yêu cầu. Trong quá trình kiểm thử bổ sung, phát hiện 3 lỗi: sai HTTP Status khi chuyển giai đoạn, chấp nhận giá trị tiền thập phân khi tạo cơ hội, và chấp nhận sản phẩm ngừng kinh doanh. Mỗi lỗi được tái hiện trước sửa, sửa bằng commit riêng và kiểm thử lại đạt yêu cầu.

**Phạm vi chứng cứ cần trình bày đúng:** TC-08 thực tế kiểm chứng trên DB `mekong_mobile_l3` thay vì DB thử độc lập như thiết kế ban đầu; TC-14 sử dụng repository mock; TC-15 có cả kiểm thử mock, PostgreSQL thật và API HTTP. Không khẳng định TC-14 là kiểm thử PostgreSQL thật hoặc coi 73 unit/automated tests là 15 ca trong bảng.

## 4. Checklist ảnh và tài liệu

- [x] Đã có kết quả kiểm thử cho TC-01 đến TC-15; ba ca bổ sung ghi rõ FAIL trước sửa, PASS sau sửa.
- [x] Ba lỗi đều có commit sửa riêng và đã được push lên `main`.
- [x] Đã chạy kiểm thử hồi quy và `npm test`: **73 PASS, 0 FAIL** sau sửa BUG-03.
- [ ] Đối chiếu **đường dẫn/ảnh thực tế** của TC-01 đến TC-15 trong `docs/screenshots/`; bổ sung ảnh còn thiếu.
- [ ] Hoàn thiện `docs/bug-log.md`, liên kết TC-13/14/15 và commit tương ứng.
- [ ] Commit/push Test Report, Bug Log và ảnh chứng cứ; kiểm tra các link GitHub trước khi nộp.
