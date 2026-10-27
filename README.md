# L3 – Cơ hội bán hàng và phễu bán

**Sinh viên:** Ngô Phú Tài – MSSV: 2374802010441 – Track SE  
**Học phần:** Chuyên đề Tốt nghiệp 1, HK1 2026–2027  
**Case study:** Smart CRM – Mekong Mobile

## 1. Mục tiêu

Xây dựng ứng dụng web hỗ trợ nhân viên bán hàng tạo, theo dõi và cập nhật cơ hội từ khách hàng quan tâm theo quy trình:

**Tiếp cận → Tư vấn → Báo giá → Chốt → Ghi nhận kết quả (Thành công/Thất bại)**.

Nhân viên có thể tạo, xem danh sách, xem chi tiết, chuyển giai đoạn theo thứ tự và ghi nhận kết quả chốt (nhập lý do nếu thất bại). Dữ liệu được lưu trong PostgreSQL; lịch sử chuyển giai đoạn được ghi vào bảng riêng.

Phạm vi hiện tại tập trung vào quản lý cơ hội bán hàng và luồng nghiệp vụ L3. Báo cáo phễu bán hàng và phân quyền đăng nhập thực tế chưa được xác nhận hoàn thiện; dự báo doanh thu không thuộc module cốt lõi hiện tại.

## 2. Yêu cầu môi trường

- Node.js và npm (kiểm tra: `node --version`, `npm --version`)
- PostgreSQL 16, công cụ `psql` (hoặc pgAdmin để chạy SQL)
- Git, Visual Studio Code (khuyến nghị)
- Trình duyệt web; Postman phục vụ kiểm thử API (tùy chọn)

**Công nghệ:** JavaScript, Node.js, Express.js, thư viện `pg`, `dotenv`, PostgreSQL; React và Vite cho Frontend, CSS cho giao diện.

Backend đọc cấu hình từ file `.env` tại thư mục gốc. Dùng `.env.example` làm mẫu với các biến `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` (dự phòng), `PORT`. Tệp `.env` và các thông tin xác thực không được đưa vào kho mã nguồn.

**Giới hạn hiện tại:** Chức năng xác thực JWT và phân quyền người dùng chưa được triển khai hoàn chỉnh; biến `JWT_SECRET` trong cấu hình không đại diện cho một cơ chế đăng nhập đã hoạt động.

## 3. Hướng dẫn cài đặt và chạy

Các lệnh dưới đây chạy trong **PowerShell / Terminal của VS Code**, trừ khi có ghi khác. Dùng **hai Terminal riêng** cho Backend và Frontend.

### 3.1. Clone repository và mở project

```powershell
git clone https://github.com/Taingo-0712/cdtn1-ngophutai-l3.git
cd cdtn1-ngophutai-l3
```

Trong lệnh trên, `<REPOSITORY_URL>` là địa chỉ GitHub của dự án. Với mã nguồn đã có sẵn trên máy, có thể mở trực tiếp thư mục gốc `cdtn1-ngophutai-l3`.

### 3.2. Cài thư viện Backend và Frontend

Tại thư mục gốc:

```powershell
npm install
```

Tiếp theo:

```powershell
cd frontend
npm install
cd ..
```

Backend và Frontend quản lý thư viện độc lập thông qua hai tệp `package.json` tương ứng.

### 3.3. Cấu hình PostgreSQL

Khởi động PostgreSQL và tạo database một lần (chạy với tài khoản PostgreSQL có quyền tạo database):

```powershell
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE mekong_mobile_l3;"
```

Nếu database đã tồn tại, bỏ qua bước tạo database để bảo toàn dữ liệu hiện có. Khi `psql` không được nhận diện, chạy `psql.exe` từ thư mục `bin` của PostgreSQL hoặc dùng pgAdmin để tạo database.

Tại thư mục gốc, tạo `.env` từ file mẫu:

```powershell
Copy-Item .env.example .env
```

Thiết lập các thông số kết nối PostgreSQL trong `.env` theo môi trường triển khai. Cấu hình tham khảo:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mekong_mobile_l3
DB_USER=postgres
DB_PASSWORD=<POSTGRESQL_PASSWORD>
PORT=3000
```

Giá trị `<POSTGRESQL_PASSWORD>` được cấu hình theo tài khoản PostgreSQL tương ứng. Tệp `.env` chứa thông tin kết nối nhạy cảm và được loại trừ khỏi kho mã nguồn thông qua `.gitignore`. Biến `JWT_SECRET` hiện chưa được sử dụng cho cơ chế xác thực hoàn chỉnh. Tên database trong `.env` phải trùng với database đã thực hiện migration.

### 3.4. Chạy migration theo đúng thứ tự

Tại **thư mục gốc**, chạy từng lệnh (tùy chọn `-v ON_ERROR_STOP=1` để dừng khi SQL lỗi):

```powershell
psql -v ON_ERROR_STOP=1 -U postgres -d mekong_mobile_l3 -f migrations/001_create_store.sql
psql -v ON_ERROR_STOP=1 -U postgres -d mekong_mobile_l3 -f migrations/002_create_app_user.sql
psql -v ON_ERROR_STOP=1 -U postgres -d mekong_mobile_l3 -f migrations/003_create_customer.sql
psql -v ON_ERROR_STOP=1 -U postgres -d mekong_mobile_l3 -f migrations/004_create_product.sql
psql -v ON_ERROR_STOP=1 -U postgres -d mekong_mobile_l3 -f migrations/005_create_opportunity.sql
psql -v ON_ERROR_STOP=1 -U postgres -d mekong_mobile_l3 -f migrations/006_create_opportunity_stage_history.sql
psql -v ON_ERROR_STOP=1 -U postgres -d mekong_mobile_l3 -f migrations/007_create_indexes.sql
```

Các bảng chính: `store`, `app_user`, `customer`, `product`, `opportunity`, `opportunity_stage_history`.

### 3.5. Seed dữ liệu mẫu

```powershell
psql -v ON_ERROR_STOP=1 -U postgres -d mekong_mobile_l3 -f seeds/001_seed_demo.sql
```

Chỉ seed sau khi tạo bảng. Theo kết quả đã ghi nhận từ Sprint 1, migration và seed đã được kiểm tra chạy lại không tạo trùng dữ liệu; vẫn cần kiểm tra lại khi clone trên máy sạch.

### 3.6. Khởi động Backend (Terminal 1)

Tại thư mục gốc:

```powershell
npm start
```

Mặc định: `http://localhost:3000`. Kiểm tra bằng trình duyệt hoặc Postman:

- `GET http://localhost:3000/health` → dự kiến `{ "status": "ok", "database": "connected" }`.
- `GET http://localhost:3000/api/opportunities` → danh sách cơ hội JSON.

Trường hợp kết nối cơ sở dữ liệu thất bại, kiểm tra thông số trong `.env`, trạng thái dịch vụ PostgreSQL và kết quả migration.

### 3.7. Khởi động Frontend React (Terminal 2)

Mở Terminal **khác**, từ thư mục gốc:

```powershell
cd frontend
npm run dev
```

Mở URL do Vite in trong Terminal, thường là `http://localhost:5173`.

Frontend sử dụng Vite proxy cho `/api` đến Backend ở `http://localhost:3000`. Backend và Frontend cần hoạt động đồng thời. Nếu cổng Backend thay đổi, cấu hình proxy trong `frontend/vite.config.js` cần được cập nhật tương ứng.

Các thao tác trên giao diện: tạo cơ hội → xem chi tiết → chuyển lần lượt `TIEP_CAN → TU_VAN → BAO_GIA → CHOT` → ghi nhận `THANH_CONG` hoặc `THAT_BAI` (có lý do) → xem lại danh sách.

Để dừng từng tiến trình, chọn đúng Terminal và nhấn `Ctrl + C`.

### 3.8. Chạy kiểm thử

Tại **thư mục gốc**, chạy:

```powershell
npm test
```

Kết quả lần chạy gần nhất (27/10/2026): **24 tests, 24 pass, 0 fail**. Kết quả có thể được tái kiểm chứng bằng lệnh trên trong môi trường triển khai tương ứng.

Kiểm tra chất lượng mã Frontend (khi script `lint` được khai báo trong `frontend/package.json`):

```powershell
cd frontend
npm run lint
```

### 3.9. Kiểm tra chạy lại từ bản clone mới

Việc kiểm chứng khả năng tái triển khai được thực hiện bằng cách clone repository vào một thư mục độc lập, thực hiện lại các bước từ mục **3.1 đến 3.8** và xác nhận Backend, Frontend, `GET /health` cùng `npm test` hoạt động theo tài liệu. **Trạng thái: chưa xác nhận hoàn tất kiểm thử clone độc lập.**

## 4. Cấu trúc thư mục

```text
cdtn1-ngophutai-l3/
├── data/                        # Dữ liệu phục vụ module (nếu có)
├── docs/                        # Tài liệu, AI disclosure, ảnh minh chứng
├── frontend/                    # React + Vite
│   └── src/
│       ├── api/                 # client.js, opportunities.api.js
│       ├── components/          # DataState, OpportunityResult, ...
│       └── pages/               # Danh sách, chi tiết, tạo cơ hội
├── migrations/                  # Tạo bảng/index PostgreSQL
├── seeds/                       # Dữ liệu mẫu
├── src/
│   ├── routes/                  # Định nghĩa endpoint
│   ├── services/                # Quy tắc nghiệp vụ
│   ├── repositories/            # Truy vấn PostgreSQL
│   ├── db.js                    # Kết nối PostgreSQL
│   └── index.js                 # Khởi động Express
├── tests/                       # Kiểm thử Node.js
├── .env.example                 # Mẫu cấu hình
├── .gitignore
├── package.json
└── README.md
```

## 5. Kiểm thử

Sử dụng **Node.js built-in test runner**:

```powershell
npm test
```

Kết quả ghi nhận ngày 27/10/2026: **24/24 PASS, 0 FAIL**. Nội dung kiểm thử gồm:

- Tạo cơ hội với `expected_value` âm bị từ chối.
- Chuyển giai đoạn hợp lệ; từ chối nhảy bước, lặp bước và đi lùi.
- Transaction cập nhật giai đoạn và lịch sử; rollback khi lỗi ghi lịch sử/cập nhật.
- Ghi kết quả chốt: kiểm tra giai đoạn `CHOT`, không ghi đè, bắt buộc lý do khi `THAT_BAI`, và xử lý xung đột.

Kiểm thử API bằng Postman đã bao gồm đọc cơ hội, chuyển giai đoạn, kiểm tra chuyển sai, ghi kết quả chốt. Luồng E2E trên React đã được thực hiện và ghi nhận thành công: **tạo → xem → chuyển ba giai đoạn → ghi kết quả → xem lại dữ liệu**.

**DataState:** Error và Retry đã được quan sát trên giao diện; Empty được kiểm tra với phản hồi `[]` mô phỏng, không xóa dữ liệu PostgreSQL. Trạng thái Loading và Error/Retry riêng ở màn hình chi tiết cần đính kèm minh chứng nếu chưa chụp.

Danh mục tên tệp minh chứng dự kiến trong `docs/` (chỉ đưa vào kho mã nguồn những ảnh đã được ghi nhận thực tế): `frontend-list.png`, `frontend-create.png`, `frontend-detail-stage.png`, `frontend-result.png`, `e2e-postgresql.png`, `unit-test-24-pass.png`, `datastate-error.png`, `datastate-empty.png`.

## 6. Trạng thái hiện tại

### Buổi 1–2

- [x] Chọn luồng L3 – Cơ hội bán hàng và phễu bán.
- [x] Khởi tạo repository GitHub và project Node.js.
- [x] Cài Express; tạo cấu trúc thư mục, `.gitignore`, `.env.example`.
- [x] Tạo và kiểm tra smoke test `/health`.

### Buổi 3–4

- [x] Phân tích yêu cầu; xây dựng User Story, FR, NFR.
- [x] Use Case Diagram, đặc tả Use Case, API Contract, SRS và truy vết.

### Buổi 5–6

- [x] Thiết kế kiến trúc phân lớp và ERD.
- [x] Thiết kế 6 bảng: `store`, `app_user`, `customer`, `product`, `opportunity`, `opportunity_stage_history`.
- [x] Hoàn thiện BT1, ghi nhận phản hồi và thay đổi thiết kế.

### Buổi 7–8 (Sprint 1)

- [x] Xây dựng Backend theo Routes → Services → Repositories.
- [x] Kết nối PostgreSQL, tạo migration, index và seed.
- [x] Xây dựng CRUD cơ hội và API `/health`.
- [x] Viết Unit Test đầu tiên (trước đây 1 PASS).

### Buổi 9–10 (Sprint 2)

- [x] Xây dựng Frontend React/Vite: danh sách, chi tiết và tạo cơ hội.
- [x] Tích hợp API thật; hiển thị dữ liệu từ PostgreSQL.
- [x] Chuyển giai đoạn tuần tự và ghi lịch sử chuyển giai đoạn.
- [x] Ghi nhận kết quả chốt thành công/thất bại (yêu cầu lý do nếu thất bại).
- [x] Chạy luồng E2E qua React từ tạo cơ hội đến ghi nhận kết quả.
- [x] `npm test`: **24 PASS, 0 FAIL**.
- [x] Kiểm tra Error và Retry trên danh sách; kiểm tra Empty bằng phản hồi `[]` mô phỏng.
- [x] Rà soát ESLint và API giả lập (theo kết quả đã thực hiện: ESLint đạt, 9/9 kiểm tra giả lập đạt).
- [ ] Hoàn thiện bằng chứng Loading và Error/Retry ở màn hình chi tiết (nếu chưa có).
- [ ] Kiểm chứng clone mới theo mục 3 (chưa có kết quả xác nhận).
- [ ] Kiểm tra/hoàn thành ảnh minh chứng trong `docs/` và liên kết GitHub.
- [ ] Kiểm tra đủ số lượng Conventional Commits và bổ sung peer review theo yêu cầu buổi 10.

### Hạn chế và phần việc sau

- Chưa có xác thực và phân quyền người dùng thực tế; chưa kiểm chứng luồng HTTP 401/đăng nhập lại. Trong lịch sử chuyển giai đoạn, `changed_by` hiện dùng nhân viên phụ trách cho dữ liệu demo, **chưa chứng minh được danh tính người thao tác**.
- Tài liệu API Contract cần đồng bộ mã kết quả với triển khai hiện tại (`THANH_CONG`/`THAT_BAI`, `failure_reason`) nếu còn ghi `WON`/`LOST`, `loss_reason`.
- Báo cáo phễu bán và tính năng phụ sẽ tiếp tục theo phạm vi/sprint sau nếu chưa triển khai.
- Không đưa mật khẩu PostgreSQL hoặc file `.env` thật vào GitHub.
