# BUG LOG — BUỔI 14

**Dự án:** Smart CRM — Mekong Mobile · Luồng L3 Cơ hội bán hàng  
**Sinh viên:** Ngô Phú Tài · **Track:** SE  
**Cập nhật:** 11/11/2026  
**Tài liệu liên quan:** [`test-plan.md`](test-plan.md) · [`test-report.md`](test-report.md) · [`api-contract.md`](api-contract.md)

## 1. Bảng tổng hợp lỗi

| Bug ID | Test Case | Mức độ | Tóm tắt lỗi | Trạng thái sau kiểm thử lại | Commit sửa lỗi |
|---|---|---|---|---|---|
| **BUG-01** | **TC-13** | **Minor** | Chuyển giai đoạn sai quy tắc trả HTTP `400` thay vì `409` như API Contract | **Đã sửa — PASS** | [`36204ce`](https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/36204ce) |
| **BUG-02** | **TC-14** | **Medium** | Service tạo cơ hội chấp nhận `expected_value = 1.5` mặc dù giá trị tiền phải là số nguyên VND | **Đã sửa — PASS** | [`71f0e62`](https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/71f0e62) |
| **BUG-03** | **TC-15** | **Major** | Backend cho phép tạo cơ hội với sản phẩm có `is_active = false` | **Đã sửa — PASS** | [`ccb4417`](https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/ccb4417) |

**Cơ sở mức độ:** BUG-01 ảnh hưởng hợp đồng phản hồi HTTP nhưng logic nghiệp vụ vẫn chặn thao tác sai; BUG-02 là lỗi validation có nguy cơ làm sai dữ liệu tiền (chưa có bằng chứng PostgreSQL thực sự làm tròn); BUG-03 ảnh hưởng trực tiếp tính hợp lệ dữ liệu bán hàng, vì cho phép tạo cơ hội mới với sản phẩm đã ngừng kinh doanh. Phân loại mức độ là **đánh giá tác động trong dự án**, cần điều chỉnh nếu rubric môn học định nghĩa Minor/Medium/Major khác.

## 2. Chi tiết từng bug

### BUG-01 — Trả sai HTTP Status khi chuyển giai đoạn không hợp lệ

| Thuộc tính | Nội dung |
|---|---|
| **Test Case** | TC-13 · FR5 / UC05 — Chuyển giai đoạn cơ hội |
| **Mức độ** | Minor |
| **Môi trường** | Backend Express cổng `3000`; Postman; SALES có quyền đối với cơ hội thử |
| **Tiền điều kiện** | Cơ hội ID `95` ở `TIEP_CAN`, chưa có kết quả; API Contract quy định HTTP `409` cho `INVALID_STAGE_TRANSITION` |
| **Các bước tái hiện** | 1. Đăng nhập SALES. 2. Gửi `PATCH /api/opportunities/95/stage` với `{ "stage": "BAO_GIA" }`. 3. Quan sát status và JSON trả về. |
| **Mong đợi** | HTTP `409 Conflict`, `{ "message": "INVALID_STAGE_TRANSITION" }`; không cho chuyển bỏ qua `TU_VAN` |
| **Thực tế trước sửa** | HTTP **`400 Bad Request`**, thông báo `INVALID_STAGE_TRANSITION` dù từ chối đúng nghiệp vụ |
| **Nguyên nhân xác định** | `src/routes/opportunity.routes.js` gom `INVALID_STAGE` và `INVALID_STAGE_TRANSITION` vào cùng nhánh trả `400` |
| **Cách sửa** | Tách xử lý: `INVALID_STAGE_TRANSITION` → `409`; `INVALID_STAGE` → `400`; giữ nguyên kiểm tra chuyển giai đoạn tại Service/Repository |
| **Kiểm thử lại** | Postman trả HTTP **`409`**, `INVALID_STAGE_TRANSITION`; 14/14 bài test Service/Repository chuyển giai đoạn PASS |
| **Commit** | [`36204ce` — sửa ánh xạ HTTP 409](https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/36204ce) |

**Minh chứng (tên file theo quy ước mới):**

- Kết quả Test Case trước sửa: [`TC-13-API-KetQuaTest-HTTP400-FAIL.png`](screenshots/TC-13-API-KetQuaTest-HTTP400-FAIL.png)
- Debug/Retest sau sửa: [`BUG-01-SauSua-HTTP409.png`](screenshots/BUG-01-SauSua-HTTP409.png)

**Ghi chú trung thực:** Ảnh HTTP 400 được chụp khi **tái hiện lại phiên bản code cũ từ Git**, không phải ảnh chụp ngay thời điểm phát hiện lỗi ban đầu. Sau đó đã khôi phục bản sửa, kiểm thử HTTP 409 và commit.

### BUG-02 — Chấp nhận giá trị tiền thập phân khi tạo cơ hội

| Thuộc tính | Nội dung |
|---|---|
| **Test Case** | TC-14 · FR1 — Tạo cơ hội bán hàng |
| **Mức độ** | Medium |
| **Môi trường** | Node.js Unit Test, Repository giả lập; không ghi PostgreSQL thật |
| **Tiền điều kiện** | Dữ liệu tham chiếu đầu vào hợp lệ; nghiệp vụ yêu cầu `expected_value` là số nguyên VND |
| **Các bước tái hiện** | 1. Gọi `createOpportunity()` với `expected_value: 1.5`. 2. Kiểm tra Service có từ chối hay vẫn gọi Repository. 3. Chạy regression test yêu cầu phát sinh `INVALID_EXPECTED_VALUE`. |
| **Mong đợi** | Service trả lỗi `INVALID_EXPECTED_VALUE`; `repository.create()` không được gọi |
| **Thực tế trước sửa** | Service chấp nhận `1.5`, gọi Repository; Unit Test FAIL với `AssertionError: Missing expected rejection` |
| **Nguyên nhân xác định** | `src/services/opportunity.service.js` sử dụng `Number.isFinite(Number(expected_value))`, chỉ kiểm tra số hữu hạn chứ không bắt buộc số nguyên |
| **Cách sửa** | Chuyển sang `Number.isSafeInteger(Number(expected_value))`; giữ kiểm tra không âm và bổ sung giới hạn trên `999999999999999` |
| **Kiểm thử lại** | Regression Test TC-14 PASS 1/1; toàn bộ `npm test` tại thời điểm sửa BUG-02 đạt 72/72 PASS |
| **Commit** | [`71f0e62` — sửa validation khi tạo cơ hội](https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/71f0e62) |

**Minh chứng (tên file theo quy ước mới):**

- Kết quả Test Case trước sửa: [`TC-14-Unit-KetQuaTest-GiaTriThapPhan-FAIL.png`](screenshots/TC-14-Unit-KetQuaTest-GiaTriThapPhan-FAIL.png)
- Debug/Retest sau sửa: [`BUG-02-SauSua-TuChoiThapPhan_TestPASS.png`](screenshots/BUG-02-SauSua-TuChoiThapPhan_TestPASS.png)

**Phạm vi bằng chứng:** Kết quả tái hiện BUG-02 được xác nhận ở **Service với Repository mock**. Không khẳng định có bản ghi tiền `1.5` được lưu hoặc bị PostgreSQL làm tròn trong database thật.

### BUG-03 — Tạo cơ hội với sản phẩm đã ngừng kinh doanh

| Thuộc tính | Nội dung |
|---|---|
| **Test Case** | TC-15 · FR1 — Tạo cơ hội bán hàng |
| **Mức độ** | **Major** — ảnh hưởng tính hợp lệ dữ liệu nghiệp vụ |
| **Môi trường** | PostgreSQL TEST `mekong_mobile_l3_tc10`, Service/Repository thật; API Postman chạy trên Backend thử `http://localhost:3001` |
| **Tiền điều kiện** | Sản phẩm `product_id = 19` có `is_active = false`; `customer_id = 1` hợp lệ; tài khoản SALES hợp lệ |
| **Các bước tái hiện** | 1. Xác nhận sản phẩm ID `19` ngừng kinh doanh bằng SQL. 2. Gọi tạo cơ hội dùng sản phẩm `19` trên DB TEST. 3. Quan sát kết quả; ROLLBACK và SELECT xác nhận không còn bản ghi thử. |
| **Mong đợi** | Từ chối tạo cơ hội mới gắn sản phẩm ngừng kinh doanh; `INVALID_REFERENCE`, API HTTP `400` |
| **Thực tế trước sửa** | Service/Repository với PostgreSQL thật trả `CREATE_ACCEPTED`, cơ hội thử ID `20` gắn sản phẩm `19`; sau đó `ROLLBACK` và SELECT xác nhận không còn cơ hội ID `20` |
| **Nguyên nhân xác định** | `src/repositories/opportunity.repository.js` dùng `INSERT ... VALUES` chỉ dựa vào FK tồn tại, không lọc `product.is_active`; Route tạo cơ hội chưa ánh xạ `error.message === "INVALID_REFERENCE"` |
| **Cách sửa** | Dùng `INSERT ... SELECT FROM product WHERE product_id = $2 AND is_active = TRUE RETURNING *`; không có dòng trả về thì phát sinh `INVALID_REFERENCE`; Route ánh xạ lỗi này thành HTTP `400` |
| **Kiểm thử lại** | PostgreSQL thật trả `INVALID_REFERENCE`, đã ROLLBACK; Postman `POST http://localhost:3001/api/opportunities` trả HTTP `400` và `INVALID_REFERENCE`; Unit regression PASS, toàn bộ `npm test` 73/73 PASS |
| **Commit** | [`ccb4417` — ngăn tạo cơ hội với sản phẩm đã ngừng kinh doanh](https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/ccb4417) |

**Minh chứng (tên file theo quy ước mới):**

- Kết quả Test Case trước sửa (PostgreSQL thật): [`TC-15-Integration-KetQuaTest-SanPhamNgung-FAIL.png`](screenshots/TC-15-Integration-KetQuaTest-SanPhamNgung-FAIL.png)
- Debug/Retest sau sửa (PostgreSQL thật): [`BUG-03-SauSua-TuChoiTaoCoHoiSPNgungKinhDoanh_IntegrationPASS.png`](screenshots/BUG-03-SauSua-TuChoiTaoCoHoiSPNgungKinhDoanh_IntegrationPASS.png)
- Debug/Retest sau sửa (Postman HTTP): [`BUG-03-SauSua-TuChoiTaoCoHoiSPNgungKinhDoanh_API-HTTP400.png`](screenshots/BUG-03-SauSua-TuChoiTaoCoHoiSPNgungKinhDoanh_API-HTTP400.png)
- Debug/Retest sau sửa (Test Unit): [`BUG-03-SauSua-TuChoiTaoCoHoiSPNgungKinhDoanh_TestPASS.png`](screenshots/BUG-03-SauSua-TuChoiTaoCoHoiSPNgungKinhDoanh_TestPASS.png)

**Ghi chú:** Giao diện React vốn đã ẩn sản phẩm không hoạt động khỏi danh sách lựa chọn; lỗi nằm ở **Backend**, khi gọi Service/API trực tiếp. Không coi việc cố tình tạo sản phẩm thử `is_active=false` là hành động tạo ra lỗi phần mềm; đó là bước chuẩn bị dữ liệu để tái hiện lỗi có sẵn.

## 3. Tổng kết kiểm thử sửa lỗi

| Chỉ số | Kết quả |
|---|---|
| Lỗi đã tái hiện, sửa và có commit riêng | **3/3** |
| Minor / Medium / Major | 1 / 1 / 1 |
| Ca liên kết | TC-13, TC-14, TC-15 |
| Kết quả kiểm thử ban đầu | **3 FAIL** (mỗi ca bổ sung đã phát hiện lỗi ở lần thử ban đầu) |
| Kết quả kiểm thử lại | **3 PASS** |
| `npm test` sau sửa BUG-03 | **73 PASS / 0 FAIL** |
| Nhánh chứa commit | `main` |

**Chú ý phạm vi:** 3/3 PASS là ba ca kiểm thử lại của bug, không phải kết quả chung của 73 bài test. `npm test` và kiểm thử Postman/PostgreSQL là các tập bằng chứng khác nhau, cùng góp phần xác nhận bản sửa.

## 4. Trước khi nộp

- [x] Ba bug có bằng chứng trước sửa và kiểm thử lại sau sửa.
- [x] Ba bug đã có commit riêng trên GitHub: `36204ce`, `71f0e62`, `ccb4417`.
- [x] Bộ kiểm thử tự động sau sửa BUG-03: 73/73 PASS.
- [x] **Kiểm tra ảnh thực tế đã đổi tên đúng** với liên kết `screenshots/...` ở trên; sửa tên link nếu khác.
- [x] Đồng bộ tên ảnh và mã TC trong [`test-report.md`](test-report.md), rồi kiểm tra tất cả link trước khi nộp.
- [ ] Commit và push các tài liệu `test-plan.md`, `test-report.md`, `bug-log.md` và ảnh minh chứng.

## 5. Dòng tóm tắt cho README/báo cáo

```text
Bug Log: docs/bug-log.md
- BUG-01 · Minor · Sai HTTP 400/409 khi chuyển giai đoạn · https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/36204ce
- BUG-02 · Medium · Chấp nhận tiền thập phân khi tạo cơ hội · https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/71f0e62
- BUG-03 · Major · Cho phép dùng sản phẩm ngừng kinh doanh · https://github.com/Taingo-0712/cdtn1-ngophutai-l3/commit/ccb4417
```
