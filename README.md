# L3 — Cơ hội bán hàng và phễu bán

**Sinh viên:** Ngô Phú Tài — **MSSV:** 2374802010441 — **Track:** SE  
**Học phần:** Chuyên đề tốt nghiệp 1 — **Case study:** Smart CRM, Mekong Mobile  
**Bản cập nhật:** 01/11/2026, chuẩn bị BT2.

## Chức năng hiện có

- Nhân viên đăng nhập, tạo cơ hội từ khách hàng/sản phẩm có sẵn; xem và sửa cơ hội phụ trách.
- Chuyển tuần tự Tiếp cận → Tư vấn → Báo giá → Chốt; cập nhật và ghi lịch sử trong cùng transaction. Lỗi ghi lịch sử thì rollback.
- Ghi Thành công/Thất bại ở Chốt, không ghi đè kết quả; Thất bại cần lý do.
- Quản lý xem danh sách, chi tiết và phễu trong cửa hàng. Phễu đếm theo giai đoạn hiện tại, luôn có đủ bốn giai đoạn.
- Xem lịch sử trong phạm vi được phép, theo thời gian tăng dần.
- API CRUD sản phẩm (thực thể CRUD thứ hai); xóa mềm bằng is_active.
- React có đăng nhập, tạo, danh sách, chi tiết, chuyển giai đoạn, kết quả, phễu và lịch sử; có trạng thái đang tải/rỗng/lỗi.

Khách hàng là dữ liệu tham chiếu được chuẩn bị sẵn. Tạo/gộp hồ sơ khách hàng thuộc L1, ngoài phạm vi L3. Không có đơn hàng, thanh toán, kho, bảo hành hay dự báo doanh thu.

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

Khi tag v0.2 đã được đẩy, dùng `git checkout v0.2` để lấy đúng bản nộp. Không copy node_modules giữa các máy/hệ điều hành.

### 2. Cấu hình — chỉ làm khi chưa có .env

```powershell
Copy-Item .env.example .env
```

Mở .env, điền DB_PASSWORD đúng tài khoản PostgreSQL; DEMO_PASSWORD tự đặt ít nhất 8 ký tự, tối đa 72 byte UTF-8. Năm tài khoản mô phỏng dùng mật khẩu này sau khi chạy seed đăng nhập. Không gửi hoặc commit .env.

Tạo JWT_SECRET một lần bằng lệnh sau tại thư mục gốc; khóa được lưu trực tiếp, không in ra màn hình:

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

Khởi động dịch vụ PostgreSQL. Ví dụ dưới dùng PostgreSQL 16 cài mặc định; thay đường dẫn, host, cổng và tài khoản nếu máy khác. Tên DB phải trùng DB_NAME trong .env.

```powershell
$psqlPath = 'C:\Program Files\PostgreSQL\16\bin\psql.exe'
& $psqlPath -h localhost -p 5432 -U postgres -d postgres -v ON_ERROR_STOP=1 -c 'CREATE DATABASE mekong_mobile_l3;'
```

Nếu database đã có thì bỏ qua lệnh CREATE DATABASE; không xóa database để sửa lỗi. Nhập mật khẩu ở lời nhắc psql.

### 4. Chạy migration 001–008 rồi seed

Từ thư mục gốc, cùng Terminal đã khai báo $psqlPath:

```powershell
Get-ChildItem migrations -Filter *.sql | Sort-Object Name | ForEach-Object {
    & $psqlPath -h localhost -p 5432 -U postgres -d mekong_mobile_l3 -v ON_ERROR_STOP=1 -f $_.FullName
    if ($LASTEXITCODE -ne 0) { throw "Migration that bai: $($_.Name)" }
}
& $psqlPath -h localhost -p 5432 -U postgres -d mekong_mobile_l3 -v ON_ERROR_STOP=1 -f seeds/001_seed_demo.sql
```

Chỉ tiếp tục nếu SQL không báo ERROR. Sau đó:

```powershell
node seeds/002_setup_demo_login.js
node seeds/004_seed_references.js
```

001 tạo dữ liệu nền; 002 thiết lập tài khoản và cơ hội mô phỏng cho hai cửa hàng; 004 bổ sung 10 khách hàng mô phỏng, 8 sản phẩm để chọn trên giao diện. Các script chạy lại không thêm trùng dữ liệu mẫu còn tồn tại. 002 đặt lại mật khẩu demo theo DEMO_PASSWORD hiện tại; không đặt lại giai đoạn/kết quả cơ hội đã xử lý. ID tự sinh nên không cố định giữa các database.

| Tài khoản | Vai trò | Cửa hàng |
|---|---|---|
| sales01, sales02 | SALES | MM001 |
| manager01 | MANAGER | MM001 |
| sales03 | SALES | MM002 |
| manager02 | MANAGER | MM002 |

### 5. Chạy ứng dụng

Terminal 1, thư mục gốc:

```powershell
npm start
```

Mặc định Backend http://localhost:3000. GET /health trả status=ok, database=connected khi kết nối được PostgreSQL.

Terminal 2, thư mục gốc:

```powershell
npm run dev --prefix frontend
```

Mở URL Local Vite in ra (thường http://localhost:5173). Vite chuyển /api sang localhost:3000; nếu đổi PORT thì sửa proxy trong frontend/vite.config.js tương ứng. Đăng nhập bằng một tài khoản mô phỏng ở bảng trên.

Dừng tiến trình bằng Ctrl+C. Sau khi sửa Backend, lưu file rồi dừng và npm start lại. Frontend tải lại trang sẽ yêu cầu đăng nhập; token lưu trong sessionStorage, hết hạn sau 1 giờ kể từ khi cấp. Hết hạn thì đăng xuất và đăng nhập lại.

## Kiểm thử và build

```powershell
npm test
npm run build --prefix frontend
```

Bản hiện tại có 44 unit test, dùng Repository/kết nối giả lập; đã chạy 44 PASS trong môi trường AI. Không cần database thật cho bộ test này. Không đồng nhất kết quả này với Postman hay kiểm thử PostgreSQL thực tế.

Kiểm tra lại seed:

```powershell
node seeds/002_setup_demo_login.js
node seeds/004_seed_references.js
```

Cơ hội vừa tạo ở TIEP_CAN; chuyển TU_VAN → BAO_GIA → CHOT rồi ghi kết quả. Gửi lặp kết quả phải 409. SALES chỉ xem/xử lý cơ hội phụ trách, MANAGER xem dữ liệu trong cửa hàng và không được sửa. Xem hướng dẫn Postman trong docs/kiem-tra-ban-sua.md.

Xóa cơ hội mới chưa có lịch sử: 200; cơ hội đã có lịch sử: 409 OPPORTUNITY_HAS_HISTORY, giữ dữ liệu liên quan. Đây là DELETE hiện có được bảo vệ, không phải quy trình xóa nghiệp vụ đầy đủ.

## API chính

Tất cả API cơ hội cần Authorization: Bearer <token>. POST /api/auth/login nhận username/password, trả token và thông tin người dùng; GET /api/auth/me kiểm tra tài khoản hiện tại.

| Method | Đường dẫn | Quyền / mục đích |
|---|---|---|
| GET | /api/opportunities | Danh sách trong phạm vi |
| GET | /api/opportunities/references | Chọn khách hàng/sản phẩm, không trả số điện thoại |
| GET | /api/opportunities/funnel | MANAGER, phễu cửa hàng |
| GET | /api/opportunities/:id | Chi tiết trong phạm vi |
| GET | /api/opportunities/:id/history | Lịch sử trong phạm vi |
| POST | /api/opportunities | SALES, tự gán owner_id từ tài khoản |
| PATCH | /api/opportunities/:id | SALES phụ trách, sửa nhu cầu/giá trị |
| PATCH | /api/opportunities/:id/stage | SALES phụ trách, stage kế tiếp |
| PATCH | /api/opportunities/:id/result | SALES phụ trách, result và failure_reason |
| DELETE | /api/opportunities/:id | SALES phụ trách, bị chặn khi có lịch sử |

Các mã đang triển khai: TIEP_CAN, TU_VAN, BAO_GIA, CHOT; kết quả THANH_CONG/THAT_BAI. 401: chưa xác thực; 403: sai vai trò; 404: không tìm thấy hoặc ngoài quyền; 400: dữ liệu sai; 409: xung đột nghiệp vụ; 500: lỗi nội bộ.

## Kiến trúc và tài liệu

- src/routes: nhận HTTP, chuyển mã lỗi.
- src/services: validation, phân quyền/nghiệp vụ; không viết SQL.
- src/repositories: truy vấn PostgreSQL, transaction.
- migrations: schema/index; seeds: dữ liệu mô phỏng.
- frontend/src: React gọi API thật.
- tests: Node test runner.
- docs: SRS, thiết kế, thay đổi thiết kế, khai báo AI, minh chứng.

## Giới hạn và điểm cần công khai

- Chưa có lọc danh sách theo giai đoạn (FR8).
- FR4 chưa đầy đủ: chưa sửa sản phẩm và chưa khóa sửa thông tin khi cơ hội đã có kết quả. API sửa nhu cầu/giá trị đã có phân quyền, nhưng chưa có form sửa trong React.
- API sản phẩm chưa áp dụng đăng nhập/phân quyền; không dùng bản này cho dữ liệu thật.
- Không trả số điện thoại trong API tham chiếu; chưa triển khai màn hình hiển thị/che số theo vai trò.
- Chưa đo p95/tải hoặc kiểm chứng concurrency trên PostgreSQL 16. Kiểm tra SQL/API trong môi trường AI dùng PGlite, không phải PostgreSQL server trên Windows.
- Hợp đồng API BT1 có tên trường/mã cũ; bảng API ở README phản ánh triển khai hiện tại, sai lệch cần đối chiếu khi nghiệm thu.
- Chưa xác nhận phép thử clone sạch với database mới trên máy sinh viên. Không ghi đã tái lập thành công trước khi thực hiện.

## Phép thử dựng lại độc lập

Clone vào thư mục khác, dùng database MỚI (ví dụ mekong_mobile_l3_verify), sửa DB_NAME trong .env của bản clone và tên DB trong mọi lệnh psql cho thống nhất. Làm lần lượt các bước cài thư viện, cấu hình, migration, seed, test, Backend và Frontend ở trên. Giữ bản đang chạy và database cũ nguyên vẹn.

Ghi nhận node --version, npm --version, psql --version; chụp /health, đăng nhập, tạo/chuyển/ghi kết quả, phễu/lịch sử; chạy seed lần hai và kiểm tra số bản ghi. Ghi PASS/FAIL thật và lỗi đã xử lý. Chỉ tạo tag v0.2 sau khi commit bản cuối và kiểm tra nội dung repo public.
