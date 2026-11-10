# L3 — Cơ hội bán hàng và phễu bán

**Sinh viên:** Ngô Phú Tài — **MSSV:** 2374802010441 — **Track:** SE  
**Học phần:** Chuyên đề tốt nghiệp 1 — **Case study:** Smart CRM, Mekong Mobile  
**Bản cập nhật:** 10/11/2026.

## Chức năng hiện có

- Nhân viên bán hàng (SALES) đăng nhập, tạo cơ hội từ khách hàng và sản phẩm có sẵn, xem danh sách và chi tiết cơ hội mình phụ trách. Quản lý (MANAGER) xem cơ hội của cửa hàng. SALES xem số điện thoại đã che. MANAGER xem số đầy đủ trong phạm vi cửa hàng.
- **FR4** — Nhân viên phụ trách có thể sửa sản phẩm gắn với cơ hội, nhu cầu và giá trị dự kiến từ trang chi tiết. Có thể sửa ở giai đoạn Chốt khi cơ hội chưa có kết quả. Sau khi ghi kết quả, hệ thống khóa chỉnh sửa.
- Nhân viên phụ trách chuyển tuần tự Tiếp cận → Tư vấn → Báo giá → Chốt. Hệ thống cập nhật cơ hội và ghi lịch sử trong cùng giao dịch. Nếu ghi lịch sử lỗi, hệ thống hoàn tác cập nhật.
- Ở giai đoạn Chốt, nhân viên phụ trách ghi kết quả Thành công hoặc Thất bại. Kết quả chỉ được ghi một lần. Thất bại cần lý do.
- Quản lý xem phễu của cửa hàng. Phễu hiển thị đủ bốn giai đoạn và đếm mỗi cơ hội ở giai đoạn hiện tại. Người dùng xem lịch sử chuyển giai đoạn trong phạm vi được phép.
- **FR8** — Nhân viên và quản lý có thể lọc danh sách cơ hội theo giai đoạn trong phạm vi được phép xem.
- Màn hình **Quản lý sản phẩm** cho MANAGER xem danh mục, thêm, sửa và ngừng sử dụng sản phẩm. Hộp thoại xác nhận hiển thị tên sản phẩm trước khi thực hiện. Khi thành công, hệ thống tải lại danh sách đang hoạt động và hiển thị thông báo. Ngừng sử dụng đặt `is_active = false` để cơ hội cũ vẫn tham chiếu được sản phẩm.
- Giao diện React có các trạng thái đang tải, danh sách rỗng và lỗi. Khách hàng trong L3 là dữ liệu tham chiếu có sẵn. Nghiệp vụ tạo và gộp hồ sơ khách hàng thuộc L1.

## Môi trường

Node.js 22.12+ hoặc 24, npm, PostgreSQL 16 và psql; PowerShell trên Windows. Backend: Express, pg, bcryptjs, jsonwebtoken. Frontend: React/Vite. Hai ứng dụng dùng hai package-lock.json riêng.

## Dựng từ mã nguồn

### 1. Lấy mã và cài dependencies

```powershell
git clone https://github.com/Taingo-0712/cdtn1-ngophutai-l3.git
cd cdtn1-ngophutai-l3
npm ci
npm ci --prefix frontend
```

Dùng commit cần kiểm tra cho phép thử dựng lại. Nếu cần mở đúng bản nộp BT2 và GitHub đã có tag `v0.2`, chạy `git checkout v0.2` sau khi clone, rồi chạy lại hai lệnh `npm ci` theo phiên bản đó.

### 2. Cấu hình — chỉ làm khi chưa có .env

```powershell
Copy-Item .env.example .env
```

Mở `.env` và điền `DB_PASSWORD` của tài khoản PostgreSQL. Đặt `DEMO_PASSWORD` dài ít nhất 8 ký tự và tối đa 72 byte UTF-8. Năm tài khoản mô phỏng dùng mật khẩu này sau khi chạy seed đăng nhập. Với phép thử dựng lại, đặt `DB_NAME=mekong_mobile_l3_verify`. Giữ tệp `.env` trên máy và đưa `.env.example` lên Git.

Tạo `JWT_SECRET` một lần bằng khối lệnh dưới đây tại thư mục gốc. Lệnh ghi khóa trực tiếp vào `.env`.

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

Đổi khóa làm token cũ mất hiệu lực. Không cần tạo lại khóa mỗi lần chạy ứng dụng.

### 3. Tạo database mới

Khởi động PostgreSQL 16. Các lệnh dưới dùng host `localhost`, cổng `5432` và tài khoản `postgres`. Nếu máy em dùng cấu hình khác, sửa các biến PowerShell và giá trị tương ứng trong `.env`.

```powershell
$psqlPath = 'C:\Program Files\PostgreSQL\16\bin\psql.exe'
$dbHost = 'localhost'
$dbPort = '5432'
$dbUser = 'postgres'
$dbName = 'mekong_mobile_l3'
& $psqlPath -h $dbHost -p $dbPort -U $dbUser -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE $dbName;"
```

Dùng tên database chữ thường có thể gồm chữ số và dấu gạch dưới. Với phép thử dựng lại, đổi `$dbName` thành `mekong_mobile_l3_verify` **trước khi chạy lệnh tạo database**. Giá trị `$dbName` phải trùng với `DB_NAME` trong `.env`. Nếu database đã tồn tại, bỏ qua lệnh `CREATE DATABASE`. Nhập mật khẩu PostgreSQL khi được hỏi.

### 4. Chạy migration 001–008 rồi seed

Từ thư mục gốc, dùng cùng cửa sổ PowerShell đã khai báo các biến ở bước 3.

```powershell
Get-ChildItem migrations -Filter *.sql | Sort-Object Name | ForEach-Object {
    & $psqlPath -h $dbHost -p $dbPort -U $dbUser -d $dbName -v ON_ERROR_STOP=1 -f $_.FullName
    if ($LASTEXITCODE -ne 0) { throw "Migration that bai: $($_.Name)" }
}
```

Chạy các lệnh seed theo thứ tự. Chỉ chuyển sang lệnh tiếp theo khi lệnh trước thành công.

```powershell
& $psqlPath -h $dbHost -p $dbPort -U $dbUser -d $dbName -v ON_ERROR_STOP=1 -f seeds/001_seed_demo.sql
node seeds/002_setup_demo_login.js
node seeds/004_seed_references.js
```

Seed 001 tạo dữ liệu nền. Seed 002 thiết lập tài khoản và cơ hội mô phỏng cho hai cửa hàng. Seed 004 bổ sung khách hàng và sản phẩm để chọn trên giao diện. Seed 002 dùng `DEMO_PASSWORD` hiện tại để thiết lập mật khẩu demo. Mã bản ghi do database cấp có thể khác giữa các lần dựng.

| Tài khoản | Vai trò | Cửa hàng |
|---|---|---|
| `sales01`, `sales02` | SALES | MM001 |
| `manager01` | MANAGER | MM001 |
| `sales03` | SALES | MM002 |
| `manager02` | MANAGER | MM002 |

### 5. Chạy ứng dụng

Terminal 1, chạy ở thư mục gốc.

```powershell
npm start
```

Backend mặc định chạy ở cổng `3000`. Mở một cửa sổ PowerShell khác và chạy lệnh sau để kiểm tra kết nối PostgreSQL.

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Kết quả mong đợi có `status = ok` và `database = connected`.

Terminal 2, chạy ở thư mục gốc.

```powershell
npm run dev --prefix frontend
```

Mở URL Local mà Vite in ra, thường là `http://localhost:5173`. Đăng nhập bằng tài khoản mô phỏng ở bảng trên. Vite chuyển yêu cầu `/api` đến backend ở cổng `3000`. Nếu đổi `PORT`, cập nhật proxy trong `frontend/vite.config.js` cho khớp.

Dừng tiến trình bằng Ctrl+C. Sau khi sửa backend, lưu tệp, dừng tiến trình cũ rồi chạy lại `npm start`. Tải lại trang sẽ hiện màn hình đăng nhập. Token lưu trong `sessionStorage` và hết hạn sau một giờ.

## Kiểm thử và build

Chạy trong thư mục gốc.

```powershell
npm test
npm run build --prefix frontend
```

- **Kiểm thử tự động** — Kết quả ghi nhận trên máy phát triển là **70/70 ca đạt, 0 lỗi**. Các ca có dùng dữ liệu hoặc kết nối giả lập. Minh chứng được lưu trong [thư mục kiểm thử tự động](docs/testing_minh%20chung/).
- **Kiểm thử trên giao diện** — Ảnh màn hình nằm trong [minh chứng frontend](docs/frontend_minh%20chung/) và [minh chứng E2E](docs/End-to-End/). Luồng kiểm tra gồm đăng nhập, tạo cơ hội, chuyển giai đoạn, sửa trước khi ghi kết quả và quản lý sản phẩm.
- **Build frontend** — Lệnh `npm run build --prefix frontend` đóng gói giao diện vào `frontend/dist/`. Ghi kết quả build khi chạy phép thử dựng lại độc lập.

Khi kiểm tra trên hệ thống đang chạy:

1. Đăng nhập `sales01`, tạo cơ hội và kiểm tra cơ hội mới ở `TIEP_CAN`. Lọc theo giai đoạn để kiểm tra FR8.
2. Chuyển cơ hội đến `CHOT`. Sửa thông tin trước khi ghi kết quả. Sau khi ghi kết quả, thử sửa lại qua API và kiểm tra mã `409 OPPORTUNITY_FINALIZED`.
3. Đăng nhập `manager01`, xem phễu và lịch sử trong cửa hàng. Trong **Quản lý sản phẩm**, thêm một sản phẩm thử, sửa tên rồi ngừng sử dụng. Kiểm tra thông báo thành công và danh sách đang hoạt động.
4. Nếu kiểm tra xóa cơ hội qua API, dùng cơ hội thử. Cơ hội đủ điều kiện xóa trả `200`. Cơ hội có lịch sử trả `409 OPPORTUNITY_HAS_HISTORY`.

### Kiểm chứng p95 và ghi đồng thời trên PostgreSQL 16

Kết quả ngày 10/11/2026 trên Windows, PostgreSQL 16.15 và Node.js 24.12.0. Máy thử dùng Intel Core i5-1235U và 7,7 GiB RAM. Script `kiem-chung-pg16.cjs` dựng database thử riêng và kiểm chứng qua API HTTP cục bộ.

**NFR1** — Đo trên 100 cơ hội mô phỏng với 5 tài khoản chạy đồng thời. Mỗi API có 100 mẫu sau giai đoạn chạy làm nóng. Ngưỡng p95 là 2.000 ms cho từng API.

| API | Số mẫu | p95 (ms) | Kết quả |
|---|---:|---:|---|
| `GET /api/opportunities` | 100 | 11.33 | Đạt |
| `GET /api/opportunities/:id` | 100 | 9.68 | Đạt |
| `GET /api/opportunities/funnel` | 100 | 10.83 | Đạt |

**FR4** — Trên cơ hội thử số 101 ở giai đoạn `CHOT`, PostgreSQL ghi nhận cả hai yêu cầu cùng chờ khóa. Yêu cầu ghi kết quả được đưa vào hàng chờ trước và trả HTTP `200`. Yêu cầu sửa trả HTTP `409 OPPORTUNITY_FINALIZED`. Kiểm tra trực tiếp trong PostgreSQL cho thấy cơ hội ở `CHOT`, có kết quả `THANH_CONG` và vẫn giữ nhu cầu cùng giá trị dự kiến ban đầu. Ca kiểm chứng đạt.

## API chính

Các API cơ hội, sản phẩm và `GET /api/auth/me` cần header `Authorization: Bearer <token>`. Lấy token qua API đăng nhập.

| Method | Đường dẫn | Quyền và mục đích |
|---|---|---|
| GET | `/health` | Kiểm tra backend và kết nối PostgreSQL |
| POST | `/api/auth/login` | Nhận `username`, `password` và cấp token |
| GET | `/api/auth/me` | Xem thông tin tài khoản xác thực |
| GET | `/api/opportunities` | Xem danh sách trong phạm vi. Có thể dùng `?stage=TU_VAN` để lọc |
| GET | `/api/opportunities/references` | Lấy khách hàng và sản phẩm tham chiếu cho biểu mẫu |
| GET | `/api/opportunities/funnel` | MANAGER xem phễu của cửa hàng |
| GET | `/api/opportunities/:id` | Xem chi tiết cơ hội trong phạm vi được phép |
| GET | `/api/opportunities/:id/history` | Xem lịch sử chuyển giai đoạn trong phạm vi được phép |
| POST | `/api/opportunities` | SALES tạo cơ hội. Hệ thống gán người phụ trách từ tài khoản |
| PATCH | `/api/opportunities/:id` | SALES phụ trách sửa `product_id`, `need_desc` và `expected_value` trước khi ghi kết quả |
| PATCH | `/api/opportunities/:id/stage` | SALES phụ trách chuyển sang giai đoạn kế tiếp |
| PATCH | `/api/opportunities/:id/result` | SALES phụ trách ghi `result` và `failure_reason` |
| DELETE | `/api/opportunities/:id` | SALES phụ trách xóa cơ hội đủ điều kiện |
| GET | `/api/products`, `/api/products/:id` | SALES và MANAGER xem sản phẩm đang hoạt động |
| POST | `/api/products` | MANAGER thêm sản phẩm |
| PATCH | `/api/products/:id` | MANAGER sửa mã hoặc tên sản phẩm |
| DELETE | `/api/products/:id` | MANAGER ngừng sử dụng sản phẩm |

Giai đoạn dùng các mã `TIEP_CAN`, `TU_VAN`, `BAO_GIA` và `CHOT`. Kết quả dùng `THANH_CONG` hoặc `THAT_BAI`.

Mã HTTP thường gặp gồm `400` dữ liệu sai, `401` chưa xác thực, `403` thiếu quyền theo vai trò, `404` không tìm thấy hoặc ngoài phạm vi của cơ hội, `409` xung đột nghiệp vụ và `500` lỗi nội bộ.

## Kiến trúc và tài liệu

- src/routes: nhận HTTP, chuyển mã lỗi.
- src/services: validation, phân quyền/nghiệp vụ; không viết SQL.
- src/repositories: truy vấn PostgreSQL, transaction.
- migrations: schema/index; seeds: dữ liệu mô phỏng.
- frontend/src: React gọi API thật.
- tests: Node test runner.
- docs: SRS, thiết kế, thay đổi thiết kế, khai báo AI, minh chứng.

## Giới hạn và điểm cần công khai

- Một số tên trường và mã trong hợp đồng API BT1 khác với API hiện hành. Bảng API ở trên mô tả bản đang triển khai.

## Phép thử dựng lại độc lập

**Trạng thái** — Chưa thực hiện phép thử từ bản clone và database mới. Kết quả kiểm thử ở trên được ghi nhận trên máy phát triển.

1. Sau khi push commit cần kiểm tra, mở PowerShell ở thư mục chứa dự án và clone vào thư mục riêng.

   ```powershell
   git clone https://github.com/Taingo-0712/cdtn1-ngophutai-l3.git cdtn1-ngophutai-l3-verify
   cd cdtn1-ngophutai-l3-verify
   git rev-parse --short HEAD
   npm ci
   npm ci --prefix frontend
   ```

2. Làm theo bước 2–4 ở trên. Đặt `DB_NAME` trong `.env` của bản clone và `$dbName` trong PowerShell cùng là `mekong_mobile_l3_verify`.
3. Trước khi thao tác trên web, ghi số bản ghi ở các bảng `store`, `app_user`, `customer`, `product` và `opportunity`. Chạy lại ba lệnh seed ở bước 4 trên database thử rồi đối chiếu số bản ghi. Kết quả mong đợi là chạy thành công và số bản ghi giữ nguyên.
4. Chạy `npm test` và `npm run build --prefix frontend`. Khởi động backend, kiểm tra `/health`, mở frontend và đăng nhập bằng tài khoản mô phỏng. Thử một luồng nghiệp vụ trên database thử.
5. Ghi lại mã commit, kết quả cài đặt, migration, seed hai lần, test, build và chạy ứng dụng. Nếu cần dùng thêm một lệnh để dựng được hệ thống, bổ sung lệnh đó vào README.
