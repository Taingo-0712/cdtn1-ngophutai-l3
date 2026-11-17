# L3 — Cơ hội bán hàng và phễu bán

**Sinh viên:** Ngô Phú Tài — **MSSV:** 2374802010441 — **Track:** SE  
**Học phần:** Chuyên đề tốt nghiệp 1 — **Case study:** Smart CRM, Mekong Mobile  
**Bản cập nhật:** 17/11/2026 — hoàn thiện hồ sơ và kiểm chứng BT3.

## Chức năng hiện có

- Nhân viên bán hàng (SALES) đăng nhập, tạo cơ hội từ khách hàng và sản phẩm có sẵn, xem danh sách và chi tiết cơ hội mình phụ trách. Quản lý (MANAGER) xem cơ hội của cửa hàng. SALES xem số điện thoại đã che; MANAGER xem số đầy đủ trong phạm vi cửa hàng.
- **FR4** — Nhân viên phụ trách có thể sửa sản phẩm gắn với cơ hội, nhu cầu và giá trị dự kiến từ trang chi tiết. Có thể sửa ở giai đoạn Chốt khi cơ hội chưa có kết quả. Sau khi ghi kết quả, hệ thống khóa chỉnh sửa.
- Nhân viên phụ trách chuyển tuần tự Tiếp cận → Tư vấn → Báo giá → Chốt. Hệ thống cập nhật cơ hội và ghi lịch sử trong cùng giao dịch. Nếu ghi lịch sử lỗi, hệ thống hoàn tác cập nhật.
- Ở giai đoạn Chốt, nhân viên phụ trách ghi kết quả Thành công hoặc Thất bại. Kết quả chỉ được ghi một lần. Thất bại cần lý do.
- Quản lý xem phễu của cửa hàng. Phễu hiển thị đủ bốn giai đoạn và đếm mỗi cơ hội ở giai đoạn hiện tại. Người dùng xem lịch sử chuyển giai đoạn trong phạm vi được phép.
- **FR8** — Nhân viên và quản lý có thể lọc danh sách cơ hội theo giai đoạn trong phạm vi được phép xem.
- Màn hình **Quản lý sản phẩm** cho MANAGER xem danh mục, thêm, sửa và ngừng sử dụng sản phẩm. Hộp thoại xác nhận hiển thị tên sản phẩm trước khi thực hiện. Khi thành công, hệ thống tải lại danh sách đang hoạt động và hiển thị thông báo. Ngừng sử dụng đặt `is_active = false` để cơ hội cũ vẫn tham chiếu được sản phẩm.
- Giao diện React có các trạng thái đang tải, danh sách rỗng và lỗi. Khách hàng trong L3 là dữ liệu tham chiếu có sẵn. Nghiệp vụ tạo và gộp hồ sơ khách hàng thuộc L1.

## Môi trường

**Chạy thủ công:** Node.js 22.12+ hoặc 24, npm, PostgreSQL 16 và `psql`; PowerShell trên Windows. Backend: Express, pg, bcryptjs, jsonwebtoken. Frontend: React/Vite. Hai ứng dụng dùng hai `package-lock.json` riêng.

**Docker (khuyến nghị để tái hiện BT3):** Git, Docker Desktop / Docker Compose. Ba dịch vụ: PostgreSQL 16 (`db`), Node.js/Express (`api`) và React/Nginx (`web`). Không cần cài Node.js hoặc PostgreSQL riêng trên máy host.

## Chạy nhanh bằng Docker Compose — BT3 / v1.0

Bản phát hành BT3 được đánh dấu bằng tag **`v1.0`**, commit **`0dd09d1`**. Các tài liệu cập nhật sau ngày gắn tag được lưu trên `main`, không tự xuất hiện trong tag cũ.

```powershell
git clone --branch v1.0 --single-branch https://github.com/Taingo-0712/cdtn1-ngophutai-l3.git cdtn1-l3-v1
cd cdtn1-l3-v1
Copy-Item .env.example .env
```

Mở `.env`, kiểm tra các biến `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `DEMO_PASSWORD`. Mẫu `.env.example` chỉ dùng để thử cục bộ, không dùng làm bí mật hệ thống công khai. Không commit `.env`.

```powershell
docker compose -p cdtn1-l3-v1-check config --quiet
docker compose -p cdtn1-l3-v1-check up -d --build
docker compose -p cdtn1-l3-v1-check ps
Invoke-RestMethod http://localhost:3000/health
docker compose -p cdtn1-l3-v1-check exec api npm test
```

Mở giao diện tại `http://localhost:5173` và đăng nhập bằng tài khoản demo. Ở lần khởi tạo volume PostgreSQL mới, migrations 001–008 và các seed được chạy tự động. Nếu tên Compose project `cdtn1-l3-v1-check` đã tồn tại, hãy dùng tên `-p` mới để tách biệt volume. Nếu cổng `3000` hoặc `5173` đang được dùng, thay `APP_PORT` và `WEB_PORT` trong `.env`; dùng đúng cổng mới để truy cập.

**Đã kiểm chứng trên tag `v1.0` (17/11/2026):** Clone vào thư mục riêng trên Windows, chạy Compose với project/volume độc lập, `db`, `api`, `web` đều healthy (**3/3**); `GET /health` trả `{"status":"ok","database":"connected"}`; frontend mở được, đăng nhập demo thành công; `npm test` trong container API đạt **73 PASS, 0 FAIL**.

**Lưu ý khi có lỗi PostgreSQL `28P01`:** Clone khác thư mục nhưng cùng Compose project mặc định vẫn có thể tái sử dụng volume cũ. Lần kiểm chứng ban đầu đã gặp lỗi xác thực DB với tên project mặc định; khi chạy project độc lập và volume mới, hệ thống khởi động thành công. Không xóa volume chứa dữ liệu cần giữ. Xem chi tiết trong [Deployment Guide](docs/deployment-guide.md).

## Dựng từ mã nguồn (không sử dụng Docker)

### 1. Lấy mã và cài dependencies

```powershell
git clone https://github.com/Taingo-0712/cdtn1-ngophutai-l3.git
cd cdtn1-ngophutai-l3
npm ci
npm ci --prefix frontend
```

Để kiểm tra phiên bản cụ thể, chuyển sang tag/commit cần dùng trước khi cài dependencies. Tag BT2: `v0.2`; tag BT3: `v1.0`.

### 2. Cấu hình — chỉ làm khi chưa có .env

```powershell
Copy-Item .env.example .env
```

Mở `.env`, điền `DB_PASSWORD` của PostgreSQL; đặt `DEMO_PASSWORD` dài ít nhất 8 ký tự, tối đa 72 byte UTF-8. Các tài khoản demo dùng mật khẩu này sau khi chạy seed đăng nhập. Để dựng trên database thử riêng, có thể dùng `DB_NAME=mekong_mobile_l3_verify`. Giữ `.env` trên máy, chỉ đưa `.env.example` lên Git.

Tạo `JWT_SECRET` một lần tại thư mục gốc:

```powershell
@'
const fs = require('node:fs');
const crypto = require('node:crypto');
let content = fs.readFileSync('.env', 'utf8');
const pattern = /^JWT_SECRET\s*=.*$/m;
const line = 'JWT_SECRET=' + crypto.randomBytes(32).toString('hex');
content = pattern.test(content) ? content.replace(pattern, line) : content + '\n' + line + '\n';
fs.writeFileSync('.env', content);
console.log('Da thiet lap JWT_SECRET.');
'@ | node
```

Đổi khóa làm token cũ mất hiệu lực. Không cần tạo lại mỗi lần khởi động.

### 3. Tạo database mới

Khởi động PostgreSQL 16. Dưới đây dùng `localhost:5432`, tài khoản `postgres` và tên database mặc định. Cập nhật các biến nếu môi trường máy khác.

```powershell
$psqlPath = 'C:\Program Files\PostgreSQL\16\bin\psql.exe'
$dbHost = 'localhost'
$dbPort = '5432'
$dbUser = 'postgres'
$dbName = 'mekong_mobile_l3'
& $psqlPath -h $dbHost -p $dbPort -U $dbUser -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE $dbName;"
```

Nếu dựng lại độc lập, đặt `$dbName = 'mekong_mobile_l3_verify'` trước lệnh tạo database và bảo đảm trùng `DB_NAME` trong `.env`. Nếu database đã tồn tại, bỏ qua `CREATE DATABASE`. Nhập mật khẩu PostgreSQL khi được hỏi.

### 4. Chạy migrations 001–008 và seed

Chạy tại thư mục gốc, cùng cửa sổ PowerShell đã khai báo biến ở bước 3:

```powershell
Get-ChildItem migrations -Filter *.sql | Sort-Object Name | ForEach-Object {
    & $psqlPath -h $dbHost -p $dbPort -U $dbUser -d $dbName -v ON_ERROR_STOP=1 -f $_.FullName
    if ($LASTEXITCODE -ne 0) { throw "Migration that bai: $($_.Name)" }
}
```

Chạy lần lượt từng seed khi lệnh trước thành công:

```powershell
& $psqlPath -h $dbHost -p $dbPort -U $dbUser -d $dbName -v ON_ERROR_STOP=1 -f seeds/001_seed_demo.sql
node seeds/002_setup_demo_login.js
node seeds/004_seed_references.js
```

Seed 001 tạo dữ liệu nền; seed 002 thiết lập tài khoản/cơ hội demo cho hai cửa hàng; seed 004 bổ sung khách hàng/sản phẩm tham chiếu. Seed 002 dùng `DEMO_PASSWORD` trong `.env`. ID có thể khác nhau giữa các lần dựng.

| Tài khoản | Vai trò | Cửa hàng |
|---|---|---|
| `sales01`, `sales02` | SALES | MM001 |
| `manager01` | MANAGER | MM001 |
| `sales03` | SALES | MM002 |
| `manager02` | MANAGER | MM002 |

Bảng liệt kê năm tài khoản thường sử dụng trong ví dụ thao tác; seed còn tạo thêm một tài khoản SALES, tổng cộng **6 tài khoản demo**.

### 5. Chạy ứng dụng

Terminal 1 tại thư mục gốc:

```powershell
npm start
```

Backend mặc định tại `http://localhost:3000`. Mở một PowerShell khác để kiểm tra:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Kết quả mong đợi: `status = ok` và `database = connected`.

Terminal 2 tại thư mục gốc:

```powershell
npm run dev --prefix frontend
```

Mở URL do Vite in ra (thường `http://localhost:5173`) và đăng nhập tài khoản demo. Vite chuyển `/api` tới backend cổng `3000`. Nếu đổi `PORT`, sửa proxy trong `frontend/vite.config.js`. Dừng tiến trình bằng Ctrl+C. Backend dùng `npm start` cần chạy lại sau khi sửa mã nguồn. Token được giữ trong `sessionStorage` và hết hạn sau một giờ.

## Kiểm thử và build

Chạy trong thư mục gốc:

```powershell
npm test
npm run build --prefix frontend
```

- **Kiểm thử tự động:** Mốc cũ ngày 10/11 là **70/70 PASS**. Sau khi sửa BUG-03, bộ kiểm thử đạt **73/73 PASS, 0 FAIL**; kết quả này cũng được xác nhận trong container API của Cold Clone `v1.0`. Một số kiểm thử tự động sử dụng mock; chúng không đồng nghĩa với 15 ca trong [Test Report](docs/test-report.md).
- **Kiểm thử trên giao diện:** Minh chứng được lưu trong [thư mục kiểm thử tự động](docs/testing_minh%20chung/), [minh chứng frontend](docs/frontend_minh%20chung/) và [minh chứng E2E](docs/End-to-End/). Luồng gồm đăng nhập, tạo cơ hội, chuyển giai đoạn, sửa trước khi ghi kết quả và quản lý sản phẩm.
- **Test Report BT3:** **15/15 test case PASS** sau khi sửa ba lỗi BUG-01, BUG-02 và BUG-03; có các trường hợp unit, integration và system/API, chi tiết trong [Test Report](docs/test-report.md) và [Bug Log](docs/bug-log.md).
- **Build frontend:** `npm run build --prefix frontend` xuất giao diện vào `frontend/dist/`.

Khi kiểm tra thủ công trên hệ thống đang chạy:

1. Đăng nhập `sales01`, tạo cơ hội ở `TIEP_CAN` và dùng bộ lọc giai đoạn để kiểm tra FR8.
2. Chuyển cơ hội tới `CHOT`, sửa trước khi ghi kết quả; sau khi ghi kết quả, thử sửa qua API để xác nhận `409 OPPORTUNITY_FINALIZED`.
3. Đăng nhập `manager01`, xem phễu và lịch sử trong cửa hàng; thêm, sửa, ngừng sử dụng một sản phẩm demo và xem danh sách đang hoạt động.
4. Chỉ xóa cơ hội thử: cơ hội đủ điều kiện trả `200`; cơ hội đã có lịch sử có thể bị từ chối với `409 OPPORTUNITY_HAS_HISTORY`.

### Kiểm chứng p95 và ghi đồng thời trên PostgreSQL 16

Kết quả ngày 10/11/2026 trên Windows, PostgreSQL 16.15 và Node.js 24.12.0; Intel Core i5-1235U, 7,7 GiB RAM. Script `kiem-chung-pg16.cjs` dựng database thử riêng và gọi API HTTP cục bộ.

**NFR1:** Đo trên 100 cơ hội demo với 5 tài khoản chạy đồng thời. Mỗi API thu 100 mẫu sau làm nóng; ngưỡng p95: **2.000 ms**.

| API | Số mẫu | p95 (ms) | Kết quả |
|---|---:|---:|---|
| `GET /api/opportunities` | 100 | 11.33 | Đạt |
| `GET /api/opportunities/:id` | 100 | 9.68 | Đạt |
| `GET /api/opportunities/funnel` | 100 | 10.83 | Đạt |

**FR4:** Trên cơ hội thử số `101` ở `CHOT`, hai yêu cầu cùng chờ khóa. Yêu cầu ghi kết quả vào hàng chờ trước trả HTTP `200`; yêu cầu sửa trả `409 OPPORTUNITY_FINALIZED`. PostgreSQL xác nhận cơ hội vẫn ở `CHOT`, kết quả `THANH_CONG`, giữ nguyên nhu cầu và giá trị dự kiến ban đầu. Ca kiểm chứng đạt.

## API chính

Các API cơ hội, sản phẩm và `GET /api/auth/me` cần `Authorization: Bearer <token>`, trừ API đăng nhập và `/health`.

| Method | Đường dẫn | Quyền và mục đích |
|---|---|---|
| GET | `/health` | Backend và kết nối PostgreSQL |
| POST | `/api/auth/login` | Xác thực, cấp token |
| GET | `/api/auth/me` | Thông tin tài khoản |
| GET | `/api/opportunities` | Danh sách theo quyền; có thể lọc `?stage=TU_VAN` |
| GET | `/api/opportunities/references` | Danh sách khách hàng/sản phẩm để chọn |
| GET | `/api/opportunities/funnel` | MANAGER xem phễu cửa hàng |
| GET | `/api/opportunities/:id` | Chi tiết cơ hội theo quyền |
| GET | `/api/opportunities/:id/history` | Lịch sử giai đoạn theo quyền |
| POST | `/api/opportunities` | SALES tạo cơ hội; owner từ tài khoản |
| PATCH | `/api/opportunities/:id` | SALES phụ trách sửa product, need_desc, expected_value |
| PATCH | `/api/opportunities/:id/stage` | SALES phụ trách chuyển giai đoạn liền sau |
| PATCH | `/api/opportunities/:id/result` | SALES phụ trách ghi kết quả |
| DELETE | `/api/opportunities/:id` | SALES phụ trách xóa cơ hội hợp lệ |
| GET | `/api/products`, `/api/products/:id` | SALES / MANAGER xem sản phẩm đang hoạt động |
| POST | `/api/products` | MANAGER thêm sản phẩm |
| PATCH | `/api/products/:id` | MANAGER sửa sản phẩm |
| DELETE | `/api/products/:id` | MANAGER ngừng sử dụng sản phẩm (xóa mềm) |

Các giai đoạn: `TIEP_CAN`, `TU_VAN`, `BAO_GIA`, `CHOT`; kết quả: `THANH_CONG`, `THAT_BAI`. Mã HTTP thường gặp: `400` dữ liệu không hợp lệ, `401` chưa xác thực, `403` thiếu quyền, `404` không tìm thấy/ngoài phạm vi, `409` xung đột nghiệp vụ và `500` lỗi nội bộ. Chi tiết request/response: [API Documentation (English)](docs/api-docs.md).

## Kiến trúc và tài liệu

- `src/routes`: nhận HTTP và ánh xạ lỗi.
- `src/services`: validation, nghiệp vụ, phân quyền; không viết SQL.
- `src/repositories`: truy vấn PostgreSQL, transaction.
- `migrations`: schema và index; `seeds`: dữ liệu demo.
- `frontend/src`: React gọi API.
- `tests`: Node test runner.
- `docs`: SRS, thiết kế, khai báo AI và ảnh minh chứng.

**Tài liệu BT3:** [Test Report](docs/test-report.md) · [Bug Log](docs/bug-log.md) · [API Docs (English)](docs/api-docs.md) · [Deployment Guide (English)](docs/deployment-guide.md) · [Security Checklist](docs/security-checklist-bt3.md) · [AI Disclosure](docs/ai-disclosure.md).

## Giới hạn và điểm cần công khai

- Một số tên trường và mã trong hợp đồng API BT1 khác với API đang triển khai. Bảng API ở trên phản ánh hệ thống hiện hành.
- Đây là prototype phục vụ học tập tại môi trường cục bộ; triển khai công khai cần cấu hình bảo mật, sao lưu, HTTPS và giám sát phù hợp.

## Phép thử dựng lại độc lập

**Trạng thái: PASS — 17/11/2026.** Cold Clone tag `v1.0` (commit `0dd09d1`) đã được thử trong thư mục riêng trên cùng máy Windows có Docker Desktop. Với Compose project `cdtn1-l3-v1-check` và PostgreSQL volume mới: ba container healthy, `/health` kết nối DB thành công, giao diện và đăng nhập hoạt động, `npm test` đạt **73/73 PASS**.

Phép thử này dùng **bản clone và volume độc lập trên cùng máy**, không phải máy tính vật lý khác. Xem cách tái hiện và xử lý lỗi trong [Deployment Guide](docs/deployment-guide.md). Người muốn chạy thủ công không dùng Docker có thể làm theo mục *Dựng từ mã nguồn* phía trên.
