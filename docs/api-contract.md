# API Contract — L3: Cơ hội bán hàng và phễu bán

**Môn học:** Chuyên đề tốt nghiệp 1 · **Track:** SE  
**Ngày:** 09/10/2026 · **Phiên bản:** 0.2  
**Tài liệu liên quan:** `docs/srs.md` — 9 User Story, 9 FR.

## 1. Quy ước chung

- Đường dẫn gốc: `/api`. Backend dự kiến: Node.js/Express; CSDL: PostgreSQL.
- Tên trường JSON dùng `snake_case`, ví dụ `customer_id`, `expected_value`, `created_at`.
- Request có body và response dùng `application/json`, mã hóa UTF-8. GET không có request body; đầu vào nằm ở path/query.
- Mọi endpoint yêu cầu `Authorization: Bearer <access_token>`. Backend lấy vai trò, mã nhân viên và cửa hàng từ phiên xác thực; không nhận chúng từ body để cấp quyền.
- Nhân viên chỉ truy cập cơ hội mình phụ trách trong cửa hàng. Quản lý được đọc danh sách/chi tiết và xem phễu của cửa hàng phụ trách; không được tạo hoặc sửa cơ hội trong phạm vi bản này.
- Số điện thoại trả về cho nhân viên luôn được che, ví dụ `090****567`; quản lý được xem đầy đủ. Không chỉ che tại giao diện.
- Các ID là số nguyên dương. Tiền dùng số nguyên VND; thời điểm dùng ISO 8601 UTC (hậu tố `Z`). Giá trị tiền tối đa và độ dài dưới đây là đề xuất kỹ thuật để triển khai validation.
- Các JSON mẫu sử dụng dữ liệu mô phỏng. Hợp đồng mô tả hành vi cần triển khai, chưa phải API đã chạy.
- Áp dụng các quy tắc đề xuất BR1–BR6 của SRS. Nếu các quy tắc thay đổi sau rà soát, cập nhật hợp đồng tương ứng.

| Giá trị API | Ý nghĩa |
|---|---|
| CONTACT | Tiếp cận |
| CONSULTING | Tư vấn |
| QUOTATION | Báo giá |
| CLOSED | Chốt |
| WON / LOST / null | Thành công / Thất bại / Chưa ghi nhận kết quả |

## 2. Danh sách endpoint và truy vết

| Phương thức | Endpoint | Mục đích | Quyền | Truy vết |
|---|---|---|---|---|
| POST | `/api/opportunities` | Tạo cơ hội | Nhân viên | US1 / FR1 / UC01 — MUST |
| GET | `/api/opportunities` | Xem danh sách; lọc theo giai đoạn | Nhân viên, quản lý | US2 / FR2 / UC02 — MUST; US8 / FR8 / UC08 — COULD |
| GET | `/api/opportunities/{id}` | Xem chi tiết | Nhân viên, quản lý | US3 / FR3 / UC03 — MUST |
| PATCH | `/api/opportunities/{id}` | Sửa thông tin | Nhân viên phụ trách | US4 / FR4 / UC04 — SHOULD |
| PATCH | `/api/opportunities/{id}/stage` | Chuyển giai đoạn và ghi lịch sử | Nhân viên phụ trách | US5 / FR5 / UC05 — MUST |
| PATCH | `/api/opportunities/{id}/result` | Ghi nhận kết quả | Nhân viên phụ trách | US6 / FR6 / UC06 — SHOULD |
| GET | `/api/reports/sales-funnel` | Thống kê phễu theo cửa hàng | Quản lý | US7 / FR7 / UC07 — SHOULD |
| GET | `/api/opportunities/{id}/stage-history` | Xem lịch sử chuyển giai đoạn | Nhân viên phụ trách | US9 / FR9 / UC09 — SHOULD |

## 3. Mã HTTP và định dạng lỗi

| HTTP | Ý nghĩa |
|---|---|
| 200 | Đọc hoặc cập nhật thành công; danh sách rỗng vẫn trả 200. |
| 201 | Tạo cơ hội thành công. |
| 400 | JSON sai cú pháp, thiếu/sai trường, sai query/path hoặc mã tham chiếu không hợp lệ. |
| 401 | Thiếu token, token không hợp lệ hoặc hết hạn. |
| 403 | Sai vai trò hoặc truy cập dữ liệu ngoài phạm vi. |
| 404 | ID cơ hội không tồn tại, sau khi đã xác thực và kiểm tra quyền vai trò. |
| 409 | Dữ liệu có cấu trúc hợp lệ nhưng xung đột trạng thái nghiệp vụ hiện tại. |
| 500 | Lỗi máy chủ/CSDL; không trả stack trace hay thông tin bí mật. |

Mọi lỗi dùng cùng cấu trúc; `details` là mảng rỗng nếu lỗi không gắn với trường cụ thể.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ.",
    "details": [
      {
        "field": "expected_value",
        "message": "Phải là số nguyên từ 0 đến 1000000000000."
      }
    ]
  }
}
```
| Mã lỗi | HTTP | Trường hợp |
|---|---|---|
| INVALID_JSON / VALIDATION_ERROR | 400 | JSON không đọc được hoặc vi phạm bảng validation. |
| INVALID_REFERENCE | 400 | Mã khách hàng/sản phẩm không tồn tại hoặc không được phép sử dụng; không tiết lộ dữ liệu ngoài quyền. |
| UNAUTHENTICATED | 401 | Phiên xác thực không hợp lệ. |
| FORBIDDEN | 403 | Vai trò không được gọi endpoint hoặc cơ hội ngoài phạm vi. |
| OPPORTUNITY_NOT_FOUND | 404 | Không tồn tại cơ hội theo ID. |
| INVALID_STAGE_TRANSITION | 409 | Bỏ bước, quay lại hoặc chuyển cùng giai đoạn. |
| OPPORTUNITY_FINALIZED | 409 | Cơ hội đã có kết quả, không được sửa. |
| RESULT_NOT_ALLOWED | 409 | Ghi kết quả khi chưa ở CLOSED. |
| INTERNAL_ERROR | 500 | Lỗi xử lý; thao tác ghi phải hoàn tác khi thất bại. |

## 4. Request và Response mẫu

Các ID ví dụ: nhân viên `101`, cửa hàng `1`, khách hàng `201`, sản phẩm `301`, cơ hội `1001`. Từng ví dụ có trạng thái ban đầu riêng; không bắt buộc chạy liên tiếp theo thứ tự tài liệu.

### 4.1. Tạo cơ hội — POST /api/opportunities

**Request body:**
```json
{
  "customer_id": 201,
  "product_id": 301,
  "need": "Mua điện thoại 256GB",
  "expected_value": 12000000
}
```
**Response 201:**
```json
{
  "data": {
    "id": 1001,
    "customer_id": 201,
    "product_id": 301,
    "need": "Mua điện thoại 256GB",
    "expected_value": 12000000,
    "stage": "CONTACT",
    "result": null,
    "loss_reason": null,
    "assigned_employee_id": 101,
    "store_id": 1,
    "created_at": "2026-10-06T13:00:00Z",
    "updated_at": "2026-10-06T13:00:00Z"
  }
}
```
Backend tự gán mã, người phụ trách và cửa hàng từ phiên hiện tại; giai đoạn ban đầu CONTACT, chưa có kết quả. Không ghi một lần chuyển giai đoạn giả khi tạo mới.

**HTTP:** 201; 400 (validation/tham chiếu); 401; 403 (không phải nhân viên); 500.

**Response 400 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu tạo cơ hội không hợp lệ.",
    "details": [
      {
        "field": "need",
        "message": "Nhu cầu phải có từ 1 đến 500 ký tự."
      }
    ]
  }
}
```

**Response 403 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Chỉ nhân viên bán hàng được tạo cơ hội.",
    "details": []
  }
}
```

### 4.2. Danh sách và lọc — GET /api/opportunities

**Request mẫu:** `GET /api/opportunities?stage=CONSULTING&page=1&page_size=20`  
Không có body. Bỏ `stage` để xem tất cả giai đoạn trong phạm vi được phép.

**Response 200:**
```json
{
  "data": [
    {
      "id": 1001,
      "customer": {
        "id": 201,
        "name": "Khách hàng mô phỏng 01",
        "phone": "090****567"
      },
      "product": {
        "id": 301,
        "name": "Điện thoại mẫu 256GB"
      },
      "stage": "CONSULTING",
      "result": null,
      "expected_value": 12000000
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 1,
    "total_pages": 1
  }
}
```
Sắp xếp mặc định `created_at` giảm dần, sau đó `id` giảm dần. Phân quyền áp dụng trước lọc và phân trang. Không có kết quả: `data: []`, `total_items: 0`, `total_pages: 0`; vẫn trả trang được yêu cầu. Trang vượt tổng số trang trả `data: []` và giữ đúng tổng bản ghi. Bỏ bộ lọc trả danh sách theo quyền hiện tại.

**HTTP:** 200; 400 (query sai); 401; 403 (vai trò không hỗ trợ); 500.

**Response 400 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Bộ lọc giai đoạn không hợp lệ.",
    "details": [
      {
        "field": "stage",
        "message": "Giai đoạn phải là CONTACT, CONSULTING, QUOTATION hoặc CLOSED."
      }
    ]
  }
}
```

**Response 401 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
    "details": []
  }
}
```

### 4.3. Chi tiết — GET /api/opportunities/{id}

**Request mẫu:** `GET /api/opportunities/1001` — không có body.

**Response 200 cho nhân viên phụ trách:**
```json
{
  "data": {
    "id": 1001,
    "customer_id": 201,
    "product_id": 301,
    "need": "Mua điện thoại 256GB",
    "expected_value": 12000000,
    "stage": "CONTACT",
    "result": null,
    "loss_reason": null,
    "assigned_employee_id": 101,
    "store_id": 1,
    "created_at": "2026-10-06T13:00:00Z",
    "updated_at": "2026-10-06T13:00:00Z",
    "customer": {
      "id": 201,
      "name": "Khách hàng mô phỏng 01",
      "phone": "090****567"
    },
    "product": {
      "id": 301,
      "name": "Điện thoại mẫu 256GB"
    }
  }
}
```
Quản lý cùng đơn vị nhận cùng cấu trúc, trường `customer.phone` là số đầy đủ. Người ngoài quyền không được nhận dữ liệu chi tiết.

**HTTP:** 200; 400 (ID sai); 401; 403; 404; 500.

**Response 403 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Bạn không có quyền xem cơ hội này.",
    "details": []
  }
}
```

**Response 404 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "OPPORTUNITY_NOT_FOUND",
    "message": "Không tìm thấy cơ hội.",
    "details": []
  }
}
```

### 4.4. Cập nhật thông tin — PATCH /api/opportunities/{id}

**Request mẫu:** `PATCH /api/opportunities/1001`
```json
{
  "need": "Mua điện thoại 512GB",
  "expected_value": 15000000
}
```
**Response 200:**
```json
{
  "data": {
    "id": 1001,
    "customer_id": 201,
    "product_id": 301,
    "need": "Mua điện thoại 512GB",
    "expected_value": 15000000,
    "stage": "CONTACT",
    "result": null,
    "loss_reason": null,
    "assigned_employee_id": 101,
    "store_id": 1,
    "created_at": "2026-10-06T13:00:00Z",
    "updated_at": "2026-10-06T14:00:00Z"
  }
}
```
Chỉ cho sửa `product_id`, `need`, `expected_value`; trường bỏ qua giữ nguyên. Cơ hội đã có kết quả bị khóa. Validation thất bại không lưu bất kỳ phần thay đổi nào.

**HTTP:** 200; 400; 401; 403; 404; 409 (OPPORTUNITY_FINALIZED); 500.

**Response 400 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Giá trị dự kiến không hợp lệ.",
    "details": [
      {
        "field": "expected_value",
        "message": "Giá trị dự kiến phải là số nguyên từ 0 đến 1000000000000 VND."
      }
    ]
  }
}
```

**Response 409 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "OPPORTUNITY_FINALIZED",
    "message": "Cơ hội đã có kết quả, không được chỉnh sửa.",
    "details": []
  }
}
```

### 4.5. Chuyển giai đoạn — PATCH /api/opportunities/{id}/stage

**Điều kiện mẫu:** Cơ hội 1001 đang ở CONTACT, chưa có kết quả.  
**Request:** `PATCH /api/opportunities/1001/stage`
```json
{
  "stage": "CONSULTING"
}
```
**Response 200:**
```json
{
  "data": {
    "id": 1001,
    "stage": "CONSULTING",
    "updated_at": "2026-10-06T14:05:00Z",
    "stage_log": {
      "id": 5001,
      "from_stage": "CONTACT",
      "to_stage": "CONSULTING",
      "changed_by": 101,
      "changed_at": "2026-10-06T14:05:00Z"
    }
  }
}
```
Chỉ chấp nhận CONTACT → CONSULTING → QUOTATION → CLOSED. Backend kiểm tra trạng thái hiện tại trong cùng giao dịch cập nhật và ghi lịch sử; khóa bản ghi hoặc dùng cơ chế tương đương để tránh hai yêu cầu đồng thời tạo lịch sử trùng. Mỗi lần chuyển thành công tạo đúng một dòng lịch sử. Nếu ghi lịch sử lỗi, hoàn tác thay đổi giai đoạn và trả 500. Gửi lại cùng giai đoạn sau lần thành công trả 409.

**Response 409 khi chuyển CONTACT → QUOTATION:**
```json
{
  "error": {
    "code": "INVALID_STAGE_TRANSITION",
    "message": "Chỉ được chuyển sang giai đoạn kế tiếp.",
    "details": [
      {
        "field": "stage",
        "message": "Giai đoạn tiếp theo hợp lệ là CONSULTING."
      }
    ]
  }
}
```
**HTTP:** 200; 400 (giá trị stage không thuộc danh mục); 401; 403; 404; 409 (chuyển không hợp lệ/đã có kết quả); 500.

**Response 403 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Bạn không có quyền chuyển giai đoạn cơ hội này.",
    "details": []
  }
}
```

**Response 500 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Không thể lưu thay đổi; giai đoạn và lịch sử được giữ nguyên.",
    "details": []
  }
}
```

### 4.6. Ghi kết quả — PATCH /api/opportunities/{id}/result

**Điều kiện mẫu:** Cơ hội đang ở CLOSED, chưa có kết quả.  
**Request:** `PATCH /api/opportunities/1001/result`
```json
{
  "result": "LOST",
  "loss_reason": "Khách chọn cửa hàng khác"
}
```
**Response 200:**
```json
{
  "data": {
    "id": 1001,
    "stage": "CLOSED",
    "result": "LOST",
    "loss_reason": "Khách chọn cửa hàng khác",
    "updated_at": "2026-10-06T14:30:00Z"
  }
}
```
**Request thành công bán hàng:**
```json
{
  "result": "WON"
}
```
Với WON, response có `result: "WON"`, `loss_reason: null`, cùng các trường còn lại như mẫu trên. Cơ hội giữ nguyên giai đoạn CLOSED. Ghi kết quả chỉ được thực hiện một lần; các lần sửa tiếp theo trả 409.

**HTTP:** 200; 400 (kết quả/lý do sai); 401; 403; 404; 409 (chưa CLOSED hoặc đã có kết quả); 500.

**Response 400 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Thiếu lý do thất bại hợp lệ.",
    "details": [
      {
        "field": "loss_reason",
        "message": "Lý do thất bại phải có từ 1 đến 500 ký tự."
      }
    ]
  }
}
```

**Response 409 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "RESULT_NOT_ALLOWED",
    "message": "Chỉ được ghi kết quả khi cơ hội ở giai đoạn CLOSED.",
    "details": []
  }
}
```

### 4.7. Phễu bán — GET /api/reports/sales-funnel

**Request:** `GET /api/reports/sales-funnel` — không có body/query. Cửa hàng lấy từ phiên quản lý; bản này giả định mỗi tài khoản quản lý có một cửa hàng đang phụ trách.

**Response 200:**
```json
{
  "data": {
    "store_id": 1,
    "stages": [
      {
        "stage": "CONTACT",
        "count": 2
      },
      {
        "stage": "CONSULTING",
        "count": 1
      },
      {
        "stage": "QUOTATION",
        "count": 0
      },
      {
        "stage": "CLOSED",
        "count": 3
      }
    ],
    "total": 6
  }
}
```
Luôn trả đủ bốn giai đoạn đúng thứ tự. Mỗi cơ hội được đếm một lần theo giai đoạn hiện tại. CLOSED gồm chưa ghi kết quả, WON và LOST; không dùng số này làm số giao dịch thành công. Cửa hàng không có cơ hội trả mọi `count` và `total` bằng 0. Gửi query `store_id` bị từ chối 400 vì endpoint không nhận trường này, không thay đổi phạm vi dữ liệu; nhân viên gọi endpoint bị từ chối 403.

**HTTP:** 200; 400 (query không hỗ trợ); 401; 403; 500.

**Response 403 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Chỉ quản lý cửa hàng được xem phễu bán hàng.",
    "details": []
  }
}
```

**Response 400 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Endpoint không nhận tham số cửa hàng.",
    "details": [
      {
        "field": "store_id",
        "message": "Không được truyền store_id; cửa hàng lấy từ phiên xác thực."
      }
    ]
  }
}
```

### 4.8. Lịch sử — GET /api/opportunities/{id}/stage-history

**Request:** `GET /api/opportunities/1001/stage-history` — không có body/query.

**Response 200:**
```json
{
  "data": [
    {
      "id": 5001,
      "opportunity_id": 1001,
      "from_stage": "CONTACT",
      "to_stage": "CONSULTING",
      "changed_by": {
        "id": 101,
        "name": "Nhân viên mô phỏng 01"
      },
      "changed_at": "2026-10-06T09:00:00Z"
    },
    {
      "id": 5002,
      "opportunity_id": 1001,
      "from_stage": "CONSULTING",
      "to_stage": "QUOTATION",
      "changed_by": {
        "id": 101,
        "name": "Nhân viên mô phỏng 01"
      },
      "changed_at": "2026-10-06T14:00:00Z"
    }
  ]
}
```
Sắp xếp theo `changed_at` tăng dần, cùng thời điểm thì `id` tăng dần. Chưa chuyển giai đoạn trả `{"data": []}`. Chỉ nhân viên phụ trách được xem lịch sử. Quản lý gọi endpoint này bị từ chối 403 trong phạm vi phiên bản hiện tại. Kiểm tra quyền trên cơ hội trước khi truy vấn lịch sử.

**HTTP:** 200; 400; 401; 403; 404; 500.

**Response 403 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Chỉ nhân viên phụ trách được xem lịch sử cơ hội.",
    "details": []
  }
}
```

**Response 404 — ví dụ lỗi:**
```json
{
  "error": {
    "code": "OPPORTUNITY_NOT_FOUND",
    "message": "Không tìm thấy cơ hội.",
    "details": []
  }
}
```

## 5. Bảng validation đầu vào

Áp dụng phía backend. Không ép chuỗi số trong JSON thành số; từ chối `null` trừ trường được cho phép rõ ràng. Body phải là JSON object. Từ chối trường body/query ngoài danh sách bằng 400; việc này ngăn người dùng tự gán `store_id`, `assigned_employee_id`, thời điểm hoặc kết quả qua endpoint không phù hợp.

| Endpoint / vị trí | Trường | Bắt buộc | Kiểu | Quy tắc  Thông báo lỗi khi vi phạm |
|---|---|---|---|------|
| Tất cả / header | Authorization | Có | Chuỗi | Bearer token hợp lệ, chưa hết hạn; lỗi trả 401. Token do hạ tầng xác thực cấp.  Thiếu hoặc sai Bearer token; phiên đăng nhập đã hết hạn. |
| Các endpoint có `{id}` / path | id | Có | Chuỗi biểu diễn số nguyên | Chỉ chữ số, giá trị 1–2147483647; không số âm, thập phân hoặc ký tự khác.  Mã cơ hội phải là số nguyên từ 1 đến 2147483647. |
| POST / body | customer_id | Có | Số nguyên | 1–2147483647; tham chiếu khách hàng tồn tại, được phép sử dụng.  Mã khách hàng không hợp lệ hoặc không được phép sử dụng. |
| POST / body; PATCH thông tin / body | product_id | POST: có; PATCH: tùy chọn | Số nguyên | 1–2147483647; sản phẩm phải tồn tại và được phép sử dụng.  Mã sản phẩm không hợp lệ hoặc không được phép sử dụng. |
| POST / body; PATCH thông tin / body | need | POST: có; PATCH: tùy chọn | Chuỗi | Trim đầu/cuối; 1–500 ký tự sau trim.  Nhu cầu phải có từ 1 đến 500 ký tự. |
| POST / body; PATCH thông tin / body | expected_value | POST: có; PATCH: tùy chọn | Số nguyên | 0–1000000000000 VND; không chấp nhận chuỗi hoặc số thập phân.  Giá trị dự kiến phải là số nguyên từ 0 đến 1000000000000 VND. |
| PATCH thông tin / body | Toàn bộ body | Có | Object | Có ít nhất một trong product_id, need, expected_value; `{}` trả 400. Không sửa customer_id.  Phải cung cấp ít nhất một trường được phép cập nhật. |
| GET danh sách / query | stage | Không | Chuỗi | Một trong CONTACT, CONSULTING, QUOTATION, CLOSED; phân biệt hoa/thường; chuỗi rỗng trả 400.  Giai đoạn phải là CONTACT, CONSULTING, QUOTATION hoặc CLOSED. |
| GET danh sách / query | page | Không | Chuỗi biểu diễn số nguyên | 1–1000000; mặc định 1; tham số lặp bị từ chối.  page phải là số nguyên từ 1 đến 1000000 và chỉ xuất hiện một lần. |
| GET danh sách / query | page_size | Không | Chuỗi biểu diễn số nguyên | 1–100; mặc định 20; tham số lặp bị từ chối.  page_size phải là số nguyên từ 1 đến 100 và chỉ xuất hiện một lần. |
| PATCH stage / body | stage | Có | Chuỗi | Thuộc bốn giá trị giai đoạn; sai danh mục trả 400, đúng danh mục nhưng chuyển sai bước trả 409.  Giai đoạn không hợp lệ (400); chỉ được chuyển sang giai đoạn kế tiếp (409). |
| PATCH result / body | result | Có | Chuỗi | Chỉ WON hoặc LOST; không chấp nhận null.  Kết quả phải là WON hoặc LOST. |
| PATCH result / body | loss_reason | Có nếu LOST | Chuỗi hoặc null | LOST: trim, dài 1–500 ký tự. WON: chỉ được bỏ qua hoặc null; gửi chuỗi trả 400.  LOST: lý do phải có từ 1 đến 500 ký tự; WON: lý do phải được bỏ qua hoặc null. |

Với query, không chấp nhận tham số lặp hoặc dạng mảng/object. Body của GET không được sử dụng làm đầu vào. Các trường `id`, `stage`, `result`, `loss_reason`, `assigned_employee_id`, `store_id`, `created_at`, `updated_at` trong response do máy chủ quản lý hoặc chỉ được sửa qua endpoint chuyên biệt như trên.

## 6. Ràng buộc response và kiểm chứng

| Nhóm dữ liệu | Quy tắc |
|---|---|
| Cơ hội | ID/tham chiếu là số nguyên dương; need và expected_value thỏa Mục 5; result/loss_reason tuân theo trạng thái nghiệp vụ. |
| Khách hàng/sản phẩm | name là chuỗi lấy từ dữ liệu tham chiếu; phone được che theo vai trò. |
| Thời gian | ISO 8601 UTC; updated_at cập nhật sau mỗi lần thay đổi thành công. |
| Phân trang | total_items/total_pages là số nguyên ≥ 0; tổng được tính sau phân quyền và lọc. |
| Phễu | count/total là số nguyên ≥ 0; total bằng tổng count của bốn giai đoạn. |
| Lịch sử | Chỉ chứa các lần chuyển thành công; from_stage/to_stage đúng bước; có người và thời điểm thực hiện. |
| Lỗi | Có error.code, error.message và error.details; details chứa field/message khi liên quan validation. |

Kiểm chứng dự kiến bằng Postman theo TC01–TC28 trong SRS. Với TC19, endpoint phễu không nhận tham số cửa hàng nên yêu cầu cố truyền `store_id` được trả 400; kết quả cốt lõi vẫn là không tiết lộ dữ liệu cửa hàng khác. Kiểm tra bổ sung PATCH ngoài quyền để bao phủ NFR2; kiểm tra transaction rollback theo TC14. API phải tuân theo các ngưỡng NFR trong SRS; tài liệu này không xác nhận các test đã chạy hoặc đạt.

### 6.1. Đối chiếu mô hình dữ liệu

Các trường body `customer_id`, `product_id`, `need`, `expected_value`, `stage`, `result`, `loss_reason` cần được đối chiếu với ERD L3 khi hoàn thiện mô hình dữ liệu. Chưa xác nhận bước đối chiếu ERD trong phiên bản này. Các giới hạn số là ngưỡng thiết kế đề xuất, không phải số đo hiệu năng thực tế.
