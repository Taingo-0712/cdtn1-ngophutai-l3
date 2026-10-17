# L3 – Cơ hội bán hàng và phễu bán

**Sinh viên:** Ngô Phú Tài – MSSV: 2374802010441 – Track SE  
**Học phần:** Chuyên đề Tốt nghiệp 1, HK1 2026–2027  
**Case study:** Smart CRM – Mekong Mobile

## 1. Mục tiêu

Xây dựng một ứng dụng web hỗ trợ nhân viên bán hàng ghi nhận và theo dõi cơ hội từ khách hàng quan tâm.

Cơ hội được quản lý qua các giai đoạn:

- Tiếp cận
- Tư vấn
- Báo giá
- Chốt

Nhân viên bán hàng có thể tạo, xem và cập nhật thông tin cơ hội. Quản lý cửa hàng có thể theo dõi tình trạng các cơ hội trong phễu bán.

Phạm vi hiện tại tập trung vào quản lý cơ hội bán hàng và phễu bán; các chức năng dự báo doanh thu chưa thuộc module cốt lõi.

## 2. Yêu cầu môi trường

Môi trường phát triển hiện tại:

- Node.js
- npm
- PostgreSQL 16
- Git
- Visual Studio Code

Công nghệ sử dụng:

- JavaScript
- Node.js
- Express.js
- PostgreSQL
- Thư viện `pg`
- Thư viện `dotenv`
- Bootstrap dự kiến sử dụng cho phần giao diện

Các biến môi trường được cấu hình trong file `.env`.

File cấu hình mẫu:

```text
.env.example
```

Các biến cấu hình chính:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET
PORT
```

Lưu ý: file `.env` chứa thông tin cấu hình cục bộ và không được commit lên GitHub.

## 3. Hướng dẫn chạy

### 3.1. Cài đặt thư viện

Sau khi clone repository:

```bash
npm install
```

### 3.2. Chuẩn bị cơ sở dữ liệu

Database hiện tại:

```text
mekong_mobile_l3
```

Chạy migration theo thứ tự trong thư mục:

```text
migrations/
```

Ví dụ:

```bash
psql -U postgres -d mekong_mobile_l3 -f migrations/001_create_store.sql
psql -U postgres -d mekong_mobile_l3 -f migrations/002_create_app_user.sql
psql -U postgres -d mekong_mobile_l3 -f migrations/003_create_customer.sql
psql -U postgres -d mekong_mobile_l3 -f migrations/004_create_product.sql
psql -U postgres -d mekong_mobile_l3 -f migrations/005_create_opportunity.sql
psql -U postgres -d mekong_mobile_l3 -f migrations/006_create_opportunity_stage_history.sql
psql -U postgres -d mekong_mobile_l3 -f migrations/007_create_indexes.sql
```

Migration đã được kiểm tra chạy lại lần thứ hai mà không tạo trùng bảng hoặc index.

### 3.3. Seed dữ liệu mẫu

Chạy:

```bash
psql -U postgres -d mekong_mobile_l3 -f seeds/001_seed_demo.sql
```

Seed đã được kiểm tra chạy lại nhiều lần mà không tạo trùng bản ghi.

### 3.4. Chạy ứng dụng

```bash
node src/index.js
```

Server chạy mặc định tại:

```text
http://localhost:3000
```

Kiểm tra trạng thái hệ thống:

```text
GET /health
```

Kết quả mong đợi:

```json
{
  "status": "ok",
  "database": "connected"
}
```

Kiểm tra danh sách cơ hội:

```text
GET /api/opportunities
```

## 4. Cấu trúc thư mục

```text
data/
docs/
migrations/
seeds/
src/
├── repositories/
├── routes/
├── services/
├── db.js
└── index.js
tests/
.env.example
.gitignore
package.json
package-lock.json
README.md
```

Ý nghĩa:

- `docs/`: tài liệu, khai báo sử dụng AI và ảnh minh chứng.
- `migrations/`: các file tạo cấu trúc cơ sở dữ liệu.
- `seeds/`: dữ liệu mẫu phục vụ kiểm thử và phát triển.
- `src/routes/`: định nghĩa endpoint API.
- `src/services/`: xử lý nghiệp vụ.
- `src/repositories/`: truy cập cơ sở dữ liệu.
- `src/db.js`: cấu hình kết nối PostgreSQL.
- `tests/`: mã kiểm thử.
- `data/`: dữ liệu mẫu hoặc dữ liệu phục vụ module.

## 5. Kiểm thử

Project hiện sử dụng Node.js built-in test runner.

Chạy kiểm thử:

```bash
npm test
```

Unit test hiện tại kiểm tra quy tắc:

```text
Không cho phép tạo cơ hội khi expected_value < 0.
```

Kết quả gần nhất:

```text
tests 1
pass 1
fail 0
```

## 6. Trạng thái hiện tại

### Buổi 1–2

- [x] Chọn luồng L3 – Cơ hội bán hàng và phễu bán.
- [x] Khởi tạo repository GitHub.
- [x] Khởi tạo project Node.js.
- [x] Cài Express.
- [x] Tạo cấu trúc thư mục ban đầu.
- [x] Tạo `.gitignore`.
- [x] Tạo `.env.example`.
- [x] Tạo endpoint smoke test `/health`.
- [x] Kiểm tra smoke test chạy thành công.

### Buổi 3–4

- [x] Phân tích yêu cầu cho luồng L3.
- [x] Xây dựng User Story.
- [x] Xác định Functional Requirements và Non-functional Requirements.
- [x] Xây dựng Use Case Diagram.
- [x] Đặc tả Use Case quan trọng.
- [x] Xây dựng API Contract.
- [x] Hoàn thiện SRS.
- [x] Xây dựng bảng truy vết yêu cầu.

### Buổi 5–6

- [x] Thiết kế kiến trúc phân lớp.
- [x] Thiết kế ERD.
- [x] Xác định 6 bảng dữ liệu:
  - `store`
  - `app_user`
  - `customer`
  - `product`
  - `opportunity`
  - `opportunity_stage_history`
- [x] Xác định khóa chính, khóa ngoại và các ràng buộc dữ liệu.
- [x] Hoàn thiện Bài tập 1.
- [x] Ghi nhận phản hồi BT1.
- [x] Tạo `docs/thay-doi-thiet-ke.md`.

### Buổi 7–8

- [x] Dựng cấu trúc mã nguồn theo 3 lớp:
  - `routes`
  - `services`
  - `repositories`
- [x] Cài thư viện PostgreSQL `pg`.
- [x] Cài `dotenv`.
- [x] Tạo database `mekong_mobile_l3`.
- [x] Xây dựng migration cho 6 bảng.
- [x] Tạo index phục vụ truy vấn.
- [x] Kiểm tra migration chạy lại không phát sinh lỗi.
- [x] Tạo seed dữ liệu mẫu.
- [x] Kiểm tra seed chạy lại không tạo trùng dữ liệu.
- [x] Kết nối Node.js với PostgreSQL.
- [x] Xây dựng repository cho entity `opportunity`.
- [x] Xây dựng service xử lý nghiệp vụ.
- [x] Xây dựng route API.
- [x] Endpoint `GET /api/opportunities` hoạt động.
- [x] Endpoint `/health` xác nhận kết nối database thành công.
- [x] Tạo unit test đầu tiên cho business layer.
- [x] Unit test đạt `1 PASS, 0 FAIL`.

### Công việc tiếp theo

- [ ] Kiểm thử đầy đủ các API CRUD.
- [ ] Hoàn thiện xử lý cập nhật giai đoạn cơ hội.
- [ ] Ghi lịch sử thay đổi giai đoạn vào `opportunity_stage_history`.
- [ ] Bổ sung các business rule còn lại.
- [ ] Bổ sung thêm unit test và integration test.
- [ ] Hoàn thiện giao diện web.
