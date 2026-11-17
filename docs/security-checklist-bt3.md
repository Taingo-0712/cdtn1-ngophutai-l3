# BẢNG TỰ ĐÁNH GIÁ BẢO MẬT — BÀI TẬP 3
**Dự án:** Smart CRM – Mekong Mobile  

**Chuyên ngành:** Công nghệ phần mềm (SE)  

**Module:** L3 – Quản lý cơ hội bán hàng và phễu bán hàng  

**Phạm vi:** Prototype phục vụ học tập, chạy trên máy cá nhân bằng Docker Compose  

**Thời điểm kiểm chứng:** 15–16/11/2026  

**Trạng thái:** Đã kiểm thử các tiêu chí trong phạm vi được ghi nhận; còn một số giới hạn cần tiếp tục cải thiện.

## 1. Quy ước đánh giá
- **ĐÃ LÀM:** Đã triển khai và có bằng chứng kiểm chứng trong phạm vi xác định.

- **CHƯA LÀM:** Chưa triển khai hoặc chưa đủ bằng chứng để xác nhận hoàn thành.

- **KHÔNG ÁP DỤNG:** Không phù hợp với phạm vi dự án và có giải thích lý do.

Kết quả kiểm thử tự động, kiểm tra Git và quét thư viện được ghi nhận đúng theo kết quả thực tế. Không xem việc tất cả bài test đều PASS là bằng chứng toàn bộ hệ thống không có lỗ hổng bảo mật.

## 2. Bảng kiểm tra 7 tiêu chí bảo mật
| STT | Tiêu chí bảo mật | Trạng thái | Kết quả kiểm chứng và minh chứng |

|---|---|---|---|

| **01** | Không đưa mật khẩu thật, JWT, API secret hoặc file `.env` lên GitHub | **ĐÃ LÀM (phạm vi `.env`)** | `git check-ignore .env` trả về `.env`; `git ls-files -- .env` và `git log --all --oneline -- .env` không trả về kết quả. Xác nhận `.env` được bỏ qua và không tìm thấy trong lịch sử Git hiện có. Chưa quét toàn bộ các file và lịch sử Git để loại trừ mọi loại secret. **Ảnh:** `docs/screenshots/BT3-Security-01-Git-Secrets-PASS.png`. |

| **02** | Kiểm tra tính hợp lệ của dữ liệu đầu vào | **ĐÃ LÀM** | Chạy riêng hai nhóm kiểm thử `product.service.test.js` và `opportunity.service.test.js` trong Docker. Kết quả **8/8 PASS**. Đã kiểm tra từ chối tên sản phẩm rỗng, mã sản phẩm dài quá giới hạn, cập nhật body rỗng, giá trị cơ hội âm và số thập phân. **Ảnh:** `docs/screenshots/BT3-Security-02-Input-Validation-PASS.png`. |

| **03** | Xác thực, phân quyền và kiểm soát quyền sở hữu dữ liệu | **ĐÃ LÀM (phạm vi kiểm thử tự động)** | Hệ thống sử dụng `src/middlewares/auth.middleware.js` và các điều kiện phân quyền ở Service/Repository. Bộ test 73/73 PASS bao gồm các trường hợp từ chối MANAGER thực hiện thao tác dành cho SALES, từ chối thao tác ngoài phạm vi cơ hội và kiểm tra quyền ghi sản phẩm chỉ dành cho MANAGER. Một số bài test sử dụng thành phần giả lập; chưa xác nhận đầy đủ các trường hợp truy cập chéo bằng token thật với PostgreSQL thật. **Minh chứng:** `docs/screenshots/BT3-Security-03-Access-Control-PASS.png` (kiểm thử phân quyền riêng theo xác nhận của người thực hiện) và `docs/screenshots/BT3-01-Test-73-PASS.png` (bộ kiểm thử tổng thể). |

| **04** | Không lưu mật khẩu dạng văn bản thuần; bảo vệ dữ liệu nhạy cảm | **ĐÃ LÀM (phạm vi mật khẩu và che số điện thoại)** | `seeds/002_setup_demo_login.js` sử dụng bcrypt để băm mật khẩu; `src/services/auth.service.js` sử dụng bcrypt để đối chiếu. Kiểm tra PostgreSQL cho kết quả **6 tài khoản, 6 giá trị password_hash theo định dạng bcrypt, 0 giá trị NULL**. Có bài kiểm thử che số điện thoại trong dữ liệu trả về. Chưa triển khai hoặc chứng minh mã hóa toàn bộ thông tin khách hàng khi lưu trong database. **Ảnh:** `docs/screenshots/BT3-Security-04-Password-Hash-PASS.png`. |

| **05** | API trả lỗi có kiểm soát, không tiết lộ thông tin nội bộ | **ĐÃ LÀM (phạm vi kiểm tra HTTP)** | Gọi `GET /api/opportunities` không có token nhận **401 – UNAUTHENTICATED**. Gửi `POST /api/auth/login` với body `{}` nhận **400 – INVALID_LOGIN_DATA**. Hai phản hồi không chứa SQL, stack trace, mật khẩu hoặc cấu hình nội bộ. Chưa trực tiếp kiểm thử mọi trường hợp lỗi HTTP 500. Header `X-Powered-By: Express` vẫn xuất hiện và nên được tắt khi triển khai ngoài môi trường demo. **Ảnh:** `docs/screenshots/BT3-Security-05-API-Error-PASS.png`. |

| **06** | Log không ghi mật khẩu, JWT hoặc dữ liệu cá nhân không cần thiết | **ĐÃ LÀM (phạm vi đã kiểm tra)** | Ban đầu, log khởi động in bảng chi tiết cơ hội gồm username, user ID, nội dung nhu cầu và giá trị dự kiến. Đã loại bỏ bảng này khỏi log, thay bằng thông báo trạng thái khởi tạo dữ liệu. Đồng thời điều chỉnh hai lệnh ghi lỗi trong `src/routes/opportunity.routes.js` để không in toàn bộ đối tượng lỗi. Sau khi sửa, Docker build thành công, ba container healthy và log khởi động không còn hiển thị thông tin nghiệp vụ chi tiết, mật khẩu hoặc JWT. Chưa kiểm chứng tất cả nhánh lỗi có thể phát sinh. **Ảnh:** `docs/screenshots/BT3-Security-06-Logging-PASS.png`. |

| **07** | Khóa phiên bản thư viện, quét và xử lý lỗ hổng đã biết | **ĐÃ LÀM** | Backend và Frontend có `package-lock.json`. Ban đầu phát hiện 2 lỗ hổng Backend: `body-parser` 2.3.0 (High) và `qs` 6.16.0 (Moderate). Đã cập nhật lên `body-parser` 2.4.0 và `qs` 6.17.1 bằng `npm audit fix`. Sau cập nhật, Backend và Frontend đều báo **0 vulnerabilities** khi quét production dependencies. Build lại Docker thành công, ba container healthy và kiểm thử trong Docker đạt **73/73 PASS**. **Ảnh:** `docs/screenshots/BT3-Security-07-Npm-Audit-PASS.png`. |

## 3. Chi tiết phát hiện và khắc phục bảo mật
### 3.1. Khắc phục lỗ hổng thư viện
Khi chạy lệnh `npm audit --omit=dev`, hệ thống phát hiện:

| Thư viện | Phiên bản cũ | Mức độ | Phiên bản sau khi sửa |

|---|---|---|---|

| `body-parser` | 2.3.0 | Cao (High) | 2.4.0 |

| `qs` | 6.16.0 | Trung bình (Moderate) | 6.17.1 |

Hai lỗ hổng liên quan đến nguy cơ từ chối dịch vụ (Denial of Service – DoS).

**Biện pháp xử lý:** Sử dụng `npm audit fix` để cập nhật phiên bản tương thích, không dùng tùy chọn `--force`.

**Kết quả sau khi sửa:**

- Backend: 0 lỗ hổng được npm audit phát hiện.

- Frontend: 0 lỗ hổng được npm audit phát hiện.

- Kiểm thử trên Windows: 73/73 PASS.

- Build lại Docker: thành công.

- Kiểm thử trong Docker: 73/73 PASS.

- API Health: `status = ok`, `database = connected`.

### 3.2. Giảm thiểu rò rỉ dữ liệu qua log
**Vấn đề ban đầu:** Script `seeds/002_setup_demo_login.js` ghi bảng cơ hội demo ra Docker log, bao gồm thông tin người dùng, nội dung nhu cầu và giá trị dự kiến.

**Biện pháp xử lý:**

- Loại bỏ lệnh `console.table(testData.rows)` và truy vấn chỉ phục vụ việc in bảng.

- Thay bằng thông báo tổng quát về số tài khoản và trạng thái khởi tạo.

- Điều chỉnh cách ghi lỗi trong `src/routes/opportunity.routes.js` để hạn chế in toàn bộ đối tượng lỗi.

**Kết quả:** Log sau khi build lại không còn hiển thị bảng cơ hội chi tiết. Các thông báo cần thiết cho việc vận hành vẫn được giữ lại.

### 3.3. Kiểm tra mật khẩu lưu trong PostgreSQL
Kiểm tra bằng truy vấn tổng hợp số lượng tài khoản và số giá trị hash có tiền tố bcrypt, không hiển thị mật khẩu hoặc chuỗi hash cụ thể.

| Chỉ số | Kết quả |

|---|---:|

| Tổng số tài khoản | 6 |

| Số giá trị password_hash có định dạng bcrypt | 6 |

| Số giá trị password_hash NULL | 0 |

**Đánh giá:** Phần lưu trữ mật khẩu của sáu tài khoản demo đáp ứng kiểm tra định dạng hash đã thực hiện. Việc có tiền tố bcrypt không tự nó chứng minh mọi khía cạnh của quản lý mật khẩu đều an toàn.

## 4. Hạn chế và rủi ro còn tồn tại
1. **Quản lý bí mật:** File `.env.example` công khai các giá trị mẫu dùng để chạy demo. Đây không phải hệ thống quản lý secret cho production. Cần thay thông tin xác thực và JWT secret khi triển khai ngoài môi trường học tập.

2. **Kiểm toán Git:** Đã kiểm tra riêng `.env`, chưa hoàn thành quét toàn bộ repository và lịch sử commit để phát hiện các bí mật có thể nằm trong file khác.

3. **Phân quyền:** Một số bài kiểm thử sử dụng mock; cần kiểm thử bổ sung bằng token thật trên cơ sở dữ liệu thật để đánh giá đầy đủ các trường hợp truy cập chéo.

4. **Dữ liệu cá nhân:** Đã áp dụng phân quyền và che số điện thoại ở phản hồi phù hợp, nhưng chưa chứng minh dữ liệu khách hàng được mã hóa khi lưu trữ.

5. **Xử lý lỗi:** Đã xác minh các phản hồi lỗi 400 và 401; chưa bao phủ toàn bộ trường hợp lỗi bất ngờ 500.

6. **Ghi log:** Đã giảm thiểu dữ liệu nghiệp vụ trong log khởi động; chưa chứng minh mọi nhánh lỗi đều không làm lộ dữ liệu nhạy cảm.

7. **Triển khai công khai:** Chưa hoàn thiện HTTPS, sao lưu và khôi phục dữ liệu, giám sát vận hành và kiểm thử bảo mật chuyên sâu.

## 5. Danh sách minh chứng
| Mã | Tên file | Nội dung |

|---|---|---|

| SEC-01 | `BT3-Security-01-Git-Secrets-PASS.png` | Kiểm tra `.env` trong Git |

| SEC-02 | `BT3-Security-02-Input-Validation-PASS.png` | 8 bài kiểm thử dữ liệu đầu vào |

| SEC-03 | `BT3-Security-03-Access-Control-PASS.png` | Kiểm thử phân quyền và quyền sở hữu dữ liệu |

| SEC-04 | `BT3-Security-04-Password-Hash-PASS.png` | Kiểm tra mật khẩu băm trong PostgreSQL |

| SEC-05 | `BT3-Security-05-API-Error-PASS.png` | Kiểm tra HTTP 400 và 401 |

| SEC-06 | `BT3-Security-06-Logging-PASS.png` | Kiểm tra log sau khi giảm thiểu dữ liệu |

| SEC-07 | `BT3-Security-07-Npm-Audit-PASS.png` | Kết quả quét lỗ hổng thư viện |

**Thư mục lưu ảnh:** `docs/screenshots/`

**Minh chứng bổ sung:**

- `docs/screenshots/BT3-01-Test-73-PASS.png`

- `docs/screenshots/BT3-Docker-Healthy-API-Health.png`

- `docs/screenshots/BT3-Cold-Clone-Final-PASS.png`

- `docs/test-report.md`

- `docs/bug-log.md`

## 6. Kết luận
Dự án đã triển khai các biện pháp bảo mật cơ bản phục vụ prototype L3, bao gồm xác thực, phân quyền, kiểm tra đầu vào, băm mật khẩu, xử lý lỗi có kiểm soát, giảm thiểu dữ liệu trong log và quản lý lỗ hổng thư viện.

Các kết quả kiểm chứng nổi bật:

- **73/73 bài kiểm thử tự động PASS.**

- **8/8 bài kiểm thử Input Validation PASS.**

- **6/6 tài khoản có password_hash theo định dạng bcrypt.**

- **0 lỗ hổng production dependency được npm audit phát hiện** sau khi cập nhật.

- **3 container Docker healthy.**

- **API kết nối PostgreSQL thành công.**
