# TEST PLAN — BUỔI 14 (15 TEST CASE)

**Dự án:** Smart CRM — Mekong Mobile · Luồng L3 Cơ hội bán hàng  
**Sinh viên:** Ngô Phú Tài · **Track:** SE  
**Phiên bản cập nhật:** 11/11/2026  
**Tài liệu liên quan:** [`test-report.md`](test-report.md) · [`bug-log.md`](bug-log.md) · [`api-contract.md`](api-contract.md)

> **Nguồn lập kế hoạch:** TC-01 đến TC-12 được giữ theo nội dung bản Test Report 12 ca đã cung cấp (7 Unit, 3 Integration, 2 System/API). TC-13 đến TC-15 **được bổ sung sau quá trình kiểm thử, khi các lỗi đã được phát hiện**, nhằm tái hiện và kiểm thử hồi quy. Đây là Test Plan cập nhật, **không phải** bằng chứng rằng cả 15 ca đã có trong kế hoạch ban đầu. Bản gốc `docs/test-plan.md` chưa được cung cấp để so sánh từng dòng; cần đối chiếu với file trên máy trước khi thay thế.

## 1. Mục tiêu và phạm vi

- Kiểm tra các quy tắc tạo, đọc, sửa cơ hội; chuyển giai đoạn; ghi kết quả và phễu; phân quyền và che số điện thoại; tính nhất quán giao dịch; khả năng tái lập môi trường.
- Kiểm tra các trường hợp đúng, giá trị biên, dữ liệu sai, lỗi nghiệp vụ và phản hồi HTTP.
- Giữ **12 ca trong kế hoạch ban đầu** và bổ sung **3 ca phát sinh**: TC-13 (BUG-01), TC-14 (BUG-02), TC-15 (BUG-03).
- **Phân biệt:** Test Plan mô tả cách kiểm thử và kết quả *mong đợi*; kết quả FAIL trước sửa / PASS sau sửa nằm trong Test Report và Bug Log.

## 2. Môi trường và nguyên tắc thực hiện

| Thành phần | Thiết lập / nguyên tắc |
|---|---|
| Backend | Node.js / Express, môi trường chạy cục bộ; API thường ở `http://localhost:3000` |
| Database | PostgreSQL 16; ưu tiên database thử riêng `mekong_mobile_l3_tc10` cho ca có tác động dữ liệu |
| API thử độc lập | Có thể chạy `http://localhost:3001` với `DB_NAME=mekong_mobile_l3_tc10`, không nhầm với DB chính |
| Công cụ | Node.js test runner (`node --test`, `npm test`), Postman, PostgreSQL/SQL, VS Code |
| Vai trò | SALES và MANAGER; token phải được lấy từ đúng Backend và môi trường đang thử |
| Cô lập dữ liệu | Dùng transaction/ROLLBACK hoặc dữ liệu thử có thể dọn; kiểm tra database trước lệnh ghi |
| Minh chứng | Ảnh có thông tin dữ liệu thử và kết quả; **không đưa mật khẩu, JWT hoặc thông tin nhạy cảm vào ảnh** |

## 3. Bảng Test Case

### 3.1. Nhóm theo kế hoạch ban đầu — TC-01 đến TC-12

| Mã | Mô tả Test Case | Truy vết / loại | Tiền điều kiện | Các bước thực hiện | Dữ liệu thử | Kết quả mong đợi | Ưu tiên |
|---|---|---|---|---|---|---|---|
| **TC-01** | Kiểm tra giá trị dự kiến bằng 0 được chấp nhận khi sửa cơ hội. | FR4 · Unit, biên dưới | Repository giả lập; SALES hợp lệ; cơ hội ở `CHOT` và chưa có kết quả | Gọi service sửa cơ hội; kiểm tra giá trị truyền xuống repository | `expected_value: "0"` | Chấp nhận giá trị biên 0; repository nhận số `0`; không phát sinh lỗi validation | Cao |
| **TC-02** | Kiểm tra từ chối giá trị tiền âm khi sửa cơ hội. | FR4 · Unit, giá trị âm | SALES hợp lệ; giả lập tầng ghi dữ liệu | Gọi service sửa cơ hội với giá trị âm; xác nhận không gọi ghi dữ liệu | `expected_value: -1` | Từ chối `INVALID_EXPECTED_VALUE`; số lần gọi ghi bằng 0 | Cao |
| **TC-03** | Kiểm tra chuyển giai đoạn đúng trình tự từ Tiếp cận sang Tư vấn. | FR5 · Unit, luồng đúng | SALES sở hữu cơ hội ở `TIEP_CAN`, chưa có kết quả | Gọi service chuyển sang `TU_VAN`; đối chiếu tham số repository | `TIEP_CAN → TU_VAN` | Chấp nhận, repository được gọi đúng một lần với `TU_VAN` | Cao |
| **TC-04** | Kiểm tra không ghi kết quả thất bại khi lý do chỉ có khoảng trắng. | FR6 · Unit, dữ liệu sai | Cơ hội ở `CHOT`, chưa có kết quả | Thử ghi kết quả thất bại với lý do chỉ có khoảng trắng; kiểm tra ghi dữ liệu | `result: "THAT_BAI"`; `failure_reason: "   "` | Từ chối `FAILURE_REASON_REQUIRED`; không lưu kết quả | Cao |
| **TC-05** | Kiểm tra nhân viên SALES không được truy cập báo cáo phễu quản lý. | FR7 / NFR2 · Unit, phân quyền | Tài khoản SALES hợp lệ | Gọi service lấy phễu; kiểm tra việc gọi repository | `role: "SALES"`, `store_id: 1` | Trả `FORBIDDEN`; không gọi repository lấy phễu | Cao |
| **TC-06** | Kiểm tra lọc cơ hội theo giai đoạn đồng thời giữ phạm vi quyền và che số điện thoại. | FR8 / QT-15 · Unit, lọc và che số | SALES cửa hàng 1; repository giả trả cơ hội có SĐT | Gọi lấy danh sách lọc giai đoạn; kiểm tra tham số quyền và số đã che | `stage: "TU_VAN"`; `phone: "0900000123"` | Giữ phạm vi truy vấn theo người dùng, lọc đúng `TU_VAN`; SALES thấy `090****123` | Trung bình |
| **TC-07** | Kiểm tra số điện thoại hiển thị phù hợp với từng vai trò SALES và MANAGER. | FR2, FR3 / QT-15 · Unit, dữ liệu theo vai trò | Có cùng dữ liệu khách hàng cho SALES và MANAGER | Đọc bằng SALES và MANAGER; đối chiếu SĐT và dữ liệu gốc | `phone: "0900000123"` | SALES nhận `090****123`; MANAGER nhận số đầy đủ; không sửa dữ liệu gốc | Cao |
| **TC-08** | Kiểm tra tạo cơ hội hợp lệ và dữ liệu được lưu đúng trong PostgreSQL. | FR1 · Integration/API, luồng đúng | Backend/DB có dữ liệu khách hàng, sản phẩm và SALES hợp lệ | POST tạo cơ hội; truy vấn PostgreSQL đối chiếu bản ghi; dọn dữ liệu thử nếu phù hợp | `need_desc: "Mua điện thoại"`, `expected_value: 10000000`; ID tham chiếu lấy từ DB | Tạo đúng một cơ hội `TIEP_CAN`, `result=NULL`, owner và FK hợp lệ | Cao |
| **TC-09** | Kiểm tra giao dịch được hoàn tác khi ghi lịch sử chuyển giai đoạn thất bại. | FR5, FR9 / NFR3 · Integration, rollback | PostgreSQL TEST; cơ hội ở `TIEP_CAN`; đã ghi số dòng lịch sử ban đầu | Gây lỗi có kiểm soát khi INSERT lịch sử; gọi chuyển `TU_VAN`; đọc lại stage/lịch sử; dọn cơ chế gây lỗi | `TIEP_CAN → TU_VAN`; gây lỗi ghi lịch sử | Giao dịch ROLLBACK; stage không đổi; lịch sử không tăng | Cao |
| **TC-10** | Kiểm tra chạy lại migrations và seeds không phát sinh dữ liệu trùng. | Môi trường · Integration, tái lập | Database TEST riêng; đã ghi số dòng các bảng | Chạy migrations/seeds; ghi số dòng; chạy lại; so sánh kết quả | Migrations `001–008`, seeds `001`, `002`, `004` | Chạy lại không lỗi và không sinh trùng bản ghi ngoài dự kiến | Cao |
| **TC-11** | Kiểm tra API từ chối tạo cơ hội thiếu mã khách hàng. | FR1 · System/API, thiếu dữ liệu | Backend + PostgreSQL; SALES có token hợp lệ | Đếm cơ hội; POST thiếu `customer_id`; đếm/kiểm tra lại | Body có `product_id`, `need_desc`, `expected_value` nhưng thiếu `customer_id` | HTTP `400`, `MISSING_REQUIRED_FIELDS`; không tạo bản ghi mới | Cao |
| **TC-12** | Kiểm tra API trả lỗi 404 khi xem cơ hội không tồn tại. | FR3 · System/API, không tồn tại | Backend + PostgreSQL; token SALES; ID chắc chắn không tồn tại | Xác nhận ID không tồn tại; GET chi tiết | `GET /api/opportunities/999999` (nếu chưa tồn tại) | HTTP `404`, `OPPORTUNITY_NOT_FOUND`; không lộ cơ hội khác | Trung bình |

### 3.2. Ca bổ sung sau khi phát hiện lỗi — TC-13 đến TC-15

| Mã | Mô tả Test Case | Truy vết / loại | Tiền điều kiện | Các bước thực hiện | Dữ liệu thử | Kết quả mong đợi | Ưu tiên |
|---|---|---|---|---|---|---|---|
| **TC-13** | Kiểm tra API trả HTTP 409 khi chuyển giai đoạn bỏ bước. | FR5 / BUG-01 · System/API | SALES có quyền với cơ hội ở `TIEP_CAN`; API Contract quy định `INVALID_STAGE_TRANSITION` → HTTP `409` | Gửi PATCH chuyển bỏ bước; kiểm tra HTTP Status và body; chạy lại sau sửa | `PATCH /api/opportunities/95/stage`; `{ "stage": "BAO_GIA" }` (ID theo môi trường) | Từ chối chuyển sai; HTTP `409`, `INVALID_STAGE_TRANSITION`; không cập nhật sai giai đoạn | Cao |
| **TC-14** | Kiểm tra tạo cơ hội từ chối giá trị tiền thập phân. | FR1 / BUG-02 · Unit, validation | Service tạo cơ hội; repository mock, SALES hợp lệ | Gọi `createOpportunity()` với số thập phân; xác nhận phát sinh lỗi và không gọi ghi; chạy lại sau sửa | `customer_id: 1`, `product_id: 1`, `expected_value: 1.5` | Từ chối `INVALID_EXPECTED_VALUE`; `repository.create` không được gọi | Cao |
| **TC-15** | Kiểm tra từ chối tạo cơ hội với sản phẩm đã ngừng kinh doanh. | FR1 / BUG-03 · Integration + System/API | PostgreSQL TEST `mekong_mobile_l3_tc10`; sản phẩm ID `19` có `is_active=false`; customer và SALES hợp lệ | Xác nhận trạng thái sản phẩm; thử tạo qua Service/Repository và API; dùng ROLLBACK/dọn dữ liệu; kiểm thử lại sau sửa | `customer_id: 1`, `product_id: 19`, `expected_value: 1000000`; `POST /api/opportunities` | Không tạo cơ hội; trả `INVALID_REFERENCE`, API trả HTTP `400` | Cao |

**Thời điểm bổ sung:** TC-13, TC-14 và TC-15 được thêm **sau khi** phát hiện các lỗi tương ứng, để xác minh nguyên nhân và tránh tái phát. Không sửa lại bản ghi TC-01–TC-12 thành các ca FAIL nếu chúng đã PASS ở phạm vi khác.


## 4. Tiêu chí hoàn thành và báo cáo

- Mỗi test case có điều kiện, dữ liệu, bước thử, mong đợi rõ ràng; kết quả thực tế và PASS/FAIL ghi **trong [`test-report.md`](test-report.md)**, không ghi đè hồi tố vào kế hoạch.
- Khi FAIL: ghi nhận Bug ID, bằng chứng trước sửa, commit sửa, kết quả Debug/Retest sau sửa.
- Với TC-13 đến TC-15: kết quả ban đầu **FAIL**, sau sửa **PASS** theo bằng chứng thực hiện; tham chiếu [`bug-log.md`](bug-log.md).
- Kết quả thực hiện cuối do người kiểm thử cung cấp: **15/15 ca PASS sau sửa; `npm test`: 73/73 PASS**. Đây là thông tin đối chiếu với Test Report, **không có nghĩa 73 test tự động trùng với 15 Test Case của kế hoạch**.
