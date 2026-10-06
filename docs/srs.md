# SRS rút gọn — L3: Cơ hội bán hàng và phễu bán

**Môn học:** Chuyên đề tốt nghiệp 1 · **Track:** SE · **Ngày:** 06/10/2026  
**Phiên bản:** 0.1 — Bản phân tích Buổi 4

## 1. Giới thiệu và phạm vi

Mekong Mobile là doanh nghiệp mô phỏng trong case study Smart CRM. Phân hệ L3 hỗ trợ ghi nhận khách đang quan tâm, theo dõi tiến trình bán hàng và tổng hợp số cơ hội theo giai đoạn.

**Phạm vi:** Nhân viên bán hàng tạo và cập nhật cơ hội từ khách quan tâm, chuyển cơ hội qua các giai đoạn Tiếp cận → Tư vấn → Báo giá → Chốt và ghi nhận kết quả; quản lý cửa hàng xem số cơ hội ở từng giai đoạn của phễu bán.

**Trong phạm vi:** tạo, xem, cập nhật thông tin, chuyển giai đoạn, ghi nhận kết quả, xem phễu, lọc theo giai đoạn và xem lịch sử chuyển giai đoạn. SHOULD vẫn thuộc phạm vi, triển khai sau MUST.

**WON'T trong phiên bản này:** dự báo doanh thu; quản lý đơn hàng, thanh toán, kho và bảo hành; tạo/gộp hồ sơ khách hàng; báo cáo toàn công ty cho ban giám đốc. Khách hàng và sản phẩm được dùng dưới dạng dữ liệu tham chiếu có sẵn.

| Thuật ngữ | Ý nghĩa thống nhất |
|---|---|
| Cơ hội bán hàng | Bản ghi theo dõi một nhu cầu mua sản phẩm của khách hàng; chưa phải đơn hàng. |
| Giai đoạn | Một trong bốn bước: Tiếp cận, Tư vấn, Báo giá, Chốt. |
| Kết quả | Thành công hoặc Thất bại; chưa có kết quả trước khi ghi nhận ở Chốt. |
| Phễu bán hàng | Số cơ hội được nhóm theo giai đoạn hiện tại. |
| Lịch sử chuyển giai đoạn | Các lần đổi giai đoạn, gồm giai đoạn cũ/mới, người thực hiện và thời điểm. |
| MUST / SHOULD / COULD / WON'T | Bắt buộc / nên có / có thể có / không làm trong phiên bản này. |
| FR / NFR / US / UC / TC | Yêu cầu chức năng / phi chức năng / User Story / Use Case / Test Case. |

## 2. Các bên liên quan và vai trò người dùng

| Vai trò | Quyền dự kiến | Giới hạn |
|---|---|---|
| Nhân viên bán hàng | Tạo cơ hội; xem danh sách/chi tiết; cập nhật thông tin, giai đoạn, kết quả; lọc và xem lịch sử trong phạm vi phụ trách. | Không truy cập cơ hội ngoài phạm vi; không xem số điện thoại đầy đủ; không xem phễu quản lý. |
| Quản lý cửa hàng | Xem phễu, danh sách và chi tiết cơ hội của đơn vị phụ trách; được xem số điện thoại đầy đủ. | Không xem dữ liệu đơn vị khác; quyền sửa cơ hội không thuộc phạm vi bản này. |

Nhân viên và quản lý là actor của phân hệ. Khách hàng không trực tiếp thao tác. 
## 3. Yêu cầu chức năng

### 3.1. User Story và mức ưu tiên

| Mã | User Story | MoSCoW |
|---|---|---|
| US1 | Là nhân viên bán hàng, tôi muốn tạo một cơ hội bán hàng cho khách hàng có nhu cầu mua sản phẩm để ghi nhận và bắt đầu theo dõi cơ hội bán hàng. | MUST |
| US2 | Là nhân viên bán hàng, tôi muốn xem danh sách các cơ hội thuộc phạm vi mình phụ trách để xác định cơ hội cần tiếp tục xử lý. | MUST |
| US3 | Là nhân viên bán hàng, tôi muốn xem thông tin chi tiết của một cơ hội thuộc phạm vi mình phụ trách để hiểu nhu cầu khách hàng và tình trạng xử lý trước khi thực hiện bước tiếp theo. | MUST |
| US4 | Là nhân viên bán hàng, tôi muốn cập nhật thông tin của cơ hội bán hàng để thông tin phản ánh đúng nhu cầu hiện tại của khách hàng. | SHOULD |
| US5 | Là nhân viên bán hàng, tôi muốn cập nhật giai đoạn của cơ hội bán hàng trong quá trình tư vấn để theo dõi tiến trình của từng cơ hội. | MUST |
| US6 | Là nhân viên bán hàng, tôi muốn ghi nhận kết quả thành công hoặc thất bại khi cơ hội đến giai đoạn Chốt để xác định kết quả cuối cùng của cơ hội. | SHOULD |
| US7 | Là quản lý cửa hàng, tôi muốn xem phễu bán hàng thể hiện số lượng cơ hội ở từng giai đoạn để theo dõi tình trạng chung của các cơ hội bán hàng. | SHOULD |
| US8 | Là nhân viên bán hàng, tôi muốn lọc danh sách cơ hội theo giai đoạn để nhanh chóng tìm các cơ hội cần xử lý ở từng bước bán hàng. | COULD |
| US9 | Là nhân viên bán hàng, tôi muốn xem lịch sử chuyển giai đoạn của một cơ hội để nắm được diễn biến và thời điểm xử lý cơ hội đó. | SHOULD |


### 3.2. Yêu cầu chức năng có mã

| Mã | Nội dung kiểm chứng được |
|---|---|
| FR1 | Cho phép tạo cơ hội với khách hàng, sản phẩm, nhu cầu và giá trị dự kiến hợp lệ; tự gán mã, nhân viên, cửa hàng, thời điểm tạo và giai đoạn Tiếp cận. Dữ liệu sai không được lưu. |
| FR2 | Hiển thị danh sách cơ hội trong phạm vi người dùng, gồm mã, khách hàng, sản phẩm, giai đoạn, kết quả và giá trị dự kiến; danh sách rỗng hiển thị thông báo không có cơ hội. |
| FR3 | Hiển thị chi tiết cơ hội hợp lệ trong phạm vi được phép; từ chối truy cập ngoài phạm vi và thông báo khi mã không tồn tại. |
| FR4 | Cho phép nhân viên phụ trách sửa sản phẩm, nhu cầu và giá trị dự kiến của cơ hội chưa có kết quả; từ chối dữ liệu sai và không thay đổi bản ghi. |
| FR5 | Cho phép nhân viên phụ trách chuyển cơ hội chưa có kết quả sang giai đoạn kế tiếp; đồng thời lưu giai đoạn cũ/mới, người thực hiện và thời điểm. Nếu không lưu được lịch sử, toàn bộ thao tác phải hủy. |
| FR6 | Cho phép ghi Thành công hoặc Thất bại khi cơ hội ở Chốt và chưa có kết quả; trường hợp Thất bại phải có lý do. |
| FR7 | Hiển thị số cơ hội theo từng giai đoạn hiện tại trong đơn vị quản lý; hiển thị đủ bốn giai đoạn, kể cả khi số lượng bằng 0. |
| FR8 | Lọc danh sách theo một giai đoạn hợp lệ, giữ nguyên giới hạn phân quyền; bỏ bộ lọc trả lại danh sách ban đầu. |
| FR9 | Hiển thị lịch sử chuyển giai đoạn của cơ hội được phép xem theo thời gian tăng dần; khi chưa chuyển lần nào, thông báo chưa có lịch sử. |

### 3.3. Tiêu chí chấp nhận cho các MUST

Given = điều kiện ban đầu; When = thao tác; Then = kết quả phải kiểm chứng được. Các trường và quy tắc cụ thể sử dụng các đề xuất ở Mục 5.

| Mã | Given — Khi đã có | When — Khi thực hiện | Then — Kết quả mong đợi |
|---|---|---|---|
| AC1.1 | Nhân viên có phiên đăng nhập hợp lệ và dữ liệu tạo cơ hội hợp lệ. | Gửi yêu cầu tạo cơ hội. | Tạo đúng một cơ hội có mã riêng, ở Tiếp cận, thuộc nhân viên/cửa hàng hiện tại. |
| AC1.2 | Thiếu khách hàng hoặc nhu cầu rỗng. | Gửi yêu cầu tạo cơ hội. | Báo lỗi trường tương ứng; không tạo bản ghi. |
| AC1.3 | Giá trị dự kiến là số âm. | Gửi yêu cầu tạo cơ hội. | Báo giá trị không hợp lệ; không tạo bản ghi. |
| AC2.1 | Có cơ hội trong và ngoài phạm vi phụ trách của nhân viên. | Mở danh sách. | Chỉ trả về cơ hội trong phạm vi; số điện thoại được che. |
| AC2.2 | Nhân viên chưa có cơ hội nào được giao. | Mở danh sách. | Hiển thị danh sách rỗng và thông báo chưa có cơ hội; không xuất hiện dữ liệu người khác. |
| AC2.3 | Phiên đăng nhập đã hết hạn. | Yêu cầu xem danh sách. | Yêu cầu đăng nhập lại; không trả dữ liệu cơ hội. |
| AC3.1 | Một cơ hội thuộc phạm vi phụ trách tồn tại. | Mở chi tiết theo mã. | Hiển thị đúng khách hàng, sản phẩm, nhu cầu, giá trị, giai đoạn và kết quả; số điện thoại được che. |
| AC3.2 | Cơ hội tồn tại nhưng ngoài phạm vi được phép. | Truy cập trực tiếp chi tiết theo mã. | Từ chối truy cập, không trả dữ liệu cơ hội. |
| AC3.3 | Mã cơ hội không tồn tại. | Yêu cầu xem chi tiết theo mã đó. | Thông báo không tìm thấy; không hiển thị nhầm cơ hội khác. |
| AC5.1 | Cơ hội của nhân viên đang ở Tiếp cận và chưa có kết quả. | Chuyển sang Tư vấn. | Cập nhật giai đoạn và thêm đúng một bản ghi lịch sử cũ/mới, người thực hiện, thời điểm. |
| AC5.2 | Cơ hội đang ở Tiếp cận. | Yêu cầu chuyển thẳng sang Báo giá. | Báo chuyển giai đoạn không hợp lệ; giữ nguyên giai đoạn và lịch sử. |
| AC5.3 | Cơ hội đủ điều kiện chuyển nhưng xảy ra lỗi lưu lịch sử. | Thực hiện chuyển giai đoạn. | Báo thao tác thất bại; không lưu một phần thay đổi. |



## 4. Yêu cầu phi chức năng


| Mã | Yêu cầu và ngưỡng đo | Cách kiểm chứng dự kiến |
|---|---|---|
| NFR1 | Với 100 cơ hội mô phỏng và 5 người dùng đồng thời trên môi trường cục bộ, 95% yêu cầu đọc danh sách, chi tiết và phễu có thời gian phản hồi API ≤ 2 giây. | Đo ít nhất 100 yêu cầu cho mỗi API sau khi khởi động ổn định; ghi cấu hình máy và kết quả p95. |
| NFR2 | 100% yêu cầu đọc/sửa cơ hội ngoài phạm vi và xem phễu bằng vai trò nhân viên bị từ chối; 100% phản hồi chứa số điện thoại cho nhân viên phải che số. | Kiểm thử ma trận hai vai trò, hai cửa hàng và hai nhân viên trong cùng cửa hàng. |
| NFR3 | Trong ít nhất 10 tình huống mô phỏng lỗi ghi lịch sử, có 0 trường hợp giai đoạn được cập nhật nhưng thiếu lịch sử tương ứng. | Gây lỗi ghi lịch sử có kiểm soát, kiểm tra cả cơ hội và lịch sử sau thao tác. |

## 5. Ràng buộc và quy tắc nghiệp vụ

### 5.1. Quy tắc từ case study

- **QT-14:** Nhân viên chỉ xem dữ liệu cửa hàng mình làm việc; quản lý xem đơn vị mình phụ trách. Mọi truy vấn danh sách, chi tiết, phễu và lịch sử phải áp dụng giới hạn này.
- **QT-15:** Số điện thoại khách hàng hiển thị dạng che với nhân viên, ví dụ `090****567`; quản lý được xem đầy đủ. Việc che phải áp dụng cả dữ liệu API trả về.
- **QT-13:** Không xóa vật lý hồ sơ khách hàng. Phân hệ này chỉ tham chiếu khách hàng và không cung cấp chức năng xóa hồ sơ; không suy diễn thành quy định cấm xóa cơ hội.

### 5.2. Quy tắc đề xuất cần xác nhận

| Mã | Đề xuất cho bản prototype |
|---|---|
| BR1 | Nhân viên chỉ xem/sửa cơ hội do mình phụ trách trong cửa hàng; quản lý xem mọi cơ hội của đơn vị phụ trách. |
| BR2 | Khách hàng và sản phẩm là mã tham chiếu tồn tại, bắt buộc. Nhu cầu sau khi bỏ khoảng trắng đầu/cuối dài 1–500 ký tự. Giá trị dự kiến là số tiền VND ≥ 0, bắt buộc. Không cho người dùng tự gán cửa hàng/nhân viên ngoài quyền. |
| BR3 | Chỉ chuyển lần lượt Tiếp cận → Tư vấn → Báo giá → Chốt; không bỏ bước, quay lại hoặc chuyển sang chính giai đoạn hiện tại. |
| BR4 | Chỉ ghi kết quả ở Chốt. Thất bại có lý do dài 1–500 ký tự sau khi bỏ khoảng trắng đầu/cuối; sau khi có kết quả, không sửa thông tin, giai đoạn hoặc kết quả trong phiên bản này. |
| BR5 | Phễu đếm theo giai đoạn hiện tại, mỗi cơ hội đúng một lần. Nhóm Chốt gồm cả cơ hội chưa ghi kết quả, Thành công và Thất bại; số ở Chốt không đồng nghĩa số bán thành công. |
| BR6 | Chuyển giai đoạn và ghi lịch sử là một giao dịch; lỗi ở một phần phải hoàn tác toàn bộ. |

**Ràng buộc triển khai dự kiến:** JavaScript, Node.js/Express, Bootstrap, PostgreSQL; chạy cục bộ. Sử dụng khoảng 100 cơ hội mô phỏng, ghi cách sinh và seed thực tế trong README. Không dùng dữ liệu cá nhân thật hoặc đưa bí mật vào repo. Tài khoản/phiên đăng nhập và vai trò là điều kiện hạ tầng; không mở rộng thành chức năng đăng ký người dùng.

## 6. Bảng truy vết yêu cầu
Các ca kiểm thử sử dụng dữ liệu mô phỏng và chưa được thực thi. NV: nhân viên; CH: cửa hàng; CHB: cơ hội bán hàng; KH: khách hàng; SP: sản phẩm. Mỗi ca được chuẩn bị dữ liệu độc lập.

| FR | User Story | Use Case | MoSCoW | Test Case dự kiến |
|---|---|---|---|---|
| FR1 | US1 | UC01 — Tạo cơ hội bán hàng | MUST | TC01–TC03; mô tả tại Mục 6.1 |
| FR2 | US2 | UC02 — Xem danh sách cơ hội | MUST | TC04–TC05, TC27; mô tả tại Mục 6.1 |
| FR3 | US3 | UC03 — Xem chi tiết cơ hội | MUST | TC06–TC08; mô tả tại Mục 6.1 |
| FR4 | US4 | UC04 — Cập nhật thông tin cơ hội | SHOULD | TC09–TC11; mô tả tại Mục 6.1 |
| FR5 | US5 | UC05 — Chuyển giai đoạn cơ hội | MUST | TC12–TC14; mô tả tại Mục 6.1 |
| FR6 | US6 | UC06 — Ghi nhận kết quả cơ hội | SHOULD | TC15–TC17, TC28; mô tả tại Mục 6.1 |
| FR7 | US7 | UC07 — Xem phễu bán hàng | SHOULD | TC18–TC20; mô tả tại Mục 6.1 |
| FR8 | US8 | UC08 — Lọc cơ hội theo giai đoạn | COULD | TC21–TC23; mô tả tại Mục 6.1 |
| FR9 | US9 | UC09 — Xem lịch sử chuyển giai đoạn | SHOULD | TC24–TC26; mô tả tại Mục 6.1 |

### 6.1. Mô tả test case dự kiến

| Mã TC | Truy vết | Điều kiện / dữ liệu đầu vào | Thao tác kiểm thử | Kết quả mong đợi |
|---|---|---|---|---|
| TC01 | FR1 | NV01 đăng nhập; KH01 và SP01 tồn tại. | Tạo cơ hội cho KH01, SP01; nhu cầu “Mua điện thoại”; giá trị 10.000.000 VND. | Tạo đúng một bản ghi có mã duy nhất, giai đoạn Tiếp cận, chưa có kết quả, thuộc NV01 và cửa hàng hiện tại; dữ liệu lưu khớp dữ liệu nhập. |
| TC02 | FR1 | NV01 đăng nhập; các trường khác hợp lệ. | Thử riêng hai lần: bỏ khách hàng; nhập nhu cầu chỉ gồm khoảng trắng. | Mỗi lần đều báo đúng trường thiếu/không hợp lệ và không tạo cơ hội. |
| TC03 | FR1 | Dữ liệu tạo cơ hội hợp lệ trừ giá trị dự kiến. | Nhập giá trị −1 VND và gửi yêu cầu tạo. | Báo giá trị phải ≥ 0; không tạo bản ghi. |
| TC04 | FR2 | NV01 và NV02 cùng CH01; NV03 thuộc CH02; mỗi người có cơ hội riêng. | Đăng nhập NV01 và mở danh sách. | Chỉ thấy cơ hội NV01 phụ trách; không thấy cơ hội NV02/NV03. Có đủ các trường FR2; nếu trả số điện thoại thì phải che cả ở API. |
| TC05 | FR2 | NV01 không có cơ hội phụ trách. | Mở danh sách cơ hội. | Trả danh sách rỗng, hiển thị thông báo chưa có cơ hội, không lấy dữ liệu của nhân viên khác thay thế. |
| TC06 | FR3 | CHB01 thuộc NV01; có sẵn khách hàng, sản phẩm, nhu cầu, giá trị, giai đoạn. | Đăng nhập NV01 và mở chi tiết CHB01. | Các trường hiển thị khớp bản ghi; số điện thoại khách hàng được che trên giao diện và trong phản hồi API. |
| TC07 | FR3 | Có cơ hội của NV02 cùng cửa hàng và NV03 ở cửa hàng khác. | NV01 truy cập trực tiếp mã từng cơ hội trên. | Cả hai lần đều bị từ chối; không trả thông tin khách hàng, sản phẩm hoặc dữ liệu cơ hội. |
| TC08 | FR3 | NV01 đăng nhập; mã CHB9999 không tồn tại. | Mở chi tiết CHB9999. | Thông báo không tìm thấy; không hiển thị dữ liệu cũ hoặc dữ liệu của cơ hội khác. |
| TC09 | FR4 | CHB01 thuộc NV01, chưa có kết quả. | Đổi nhu cầu thành “Mua điện thoại 256GB”, giá trị 12.000.000 VND rồi lưu và mở lại. | Thông tin mới được lưu đúng; mã, người phụ trách, cửa hàng và giai đoạn không đổi. |
| TC10 | FR4 | CHB01 chưa có kết quả; ghi lại dữ liệu trước thử. | Sửa giá trị dự kiến thành −1 VND rồi lưu. | Báo lỗi giá trị; bản ghi giữ nguyên toàn bộ thông tin trước lần lưu thất bại. |
| TC11 | FR4 | CHB01 đã có kết quả Thành công hoặc Thất bại. | Thử sửa nhu cầu và lưu. | Từ chối chỉnh sửa; dữ liệu không đổi theo BR4. |
| TC12 | FR5 | CHB01 thuộc NV01, ở Tiếp cận; ghi nhận số dòng lịch sử ban đầu. | Chuyển CHB01 sang Tư vấn một lần. | Giai đoạn đổi thành Tư vấn; thêm đúng một dòng lịch sử Tiếp cận → Tư vấn, người NV01, thời điểm nằm trong khoảng thực hiện thao tác. |
| TC13 | FR5 | CHB01 ở Tiếp cận, chưa có kết quả. | Yêu cầu chuyển trực tiếp sang Báo giá. | Báo chuyển giai đoạn không hợp lệ; giai đoạn và số dòng lịch sử không đổi. |
| TC14 | FR5 | CHB01 đủ điều kiện chuyển; môi trường thử có thể gây lỗi ghi lịch sử. | Gây lỗi ghi lịch sử rồi chuyển từ Tiếp cận sang Tư vấn. | Thao tác thất bại; cơ hội vẫn ở Tiếp cận; không có bản ghi lịch sử dở dang. Lặp ít nhất 10 lần để kiểm chứng NFR3. |
| TC15 | FR6 | CHB01 ở Chốt, chưa có kết quả và thuộc NV01. | Ghi kết quả Thành công rồi mở lại. | Kết quả Thành công được lưu; giai đoạn vẫn là Chốt; không bắt buộc lý do thất bại. |
| TC16 | FR6 | CHB01 ở Chốt, chưa có kết quả. | Ghi Thất bại với lý do “Khách chọn cửa hàng khác”. | Lưu đúng kết quả và lý do; giai đoạn vẫn là Chốt. |
| TC17 | FR6 | CHB01 ở Chốt, chưa có kết quả. | Ghi Thất bại nhưng để lý do rỗng hoặc chỉ có khoảng trắng. | Báo thiếu lý do; kết quả vẫn chưa được ghi nhận. |
| TC18 | FR7 | CH01 có 2 cơ hội Tiếp cận, 1 Tư vấn, 0 Báo giá, 3 Chốt; ba cơ hội Chốt lần lượt chưa có kết quả, Thành công, Thất bại. | Quản lý CH01 mở phễu. | Hiển thị đủ bốn nhóm với số lượng 2–1–0–3; tổng 6, không đếm lặp và không bỏ các cơ hội Chốt đã có kết quả. |
| TC19 | FR7 | CH01 có 6 cơ hội; CH02 có 4 cơ hội; quản lý chỉ phụ trách CH01. | Mở phễu; thử yêu cầu dữ liệu CH02 bằng cách sửa tham số nếu API có tham số cửa hàng. | Phễu chỉ đếm 6 cơ hội CH01; yêu cầu CH02 bị từ chối và không lộ số liệu CH02. |
| TC20 | FR7 | NV01 có phiên đăng nhập vai trò nhân viên. | Truy cập trực tiếp chức năng/API xem phễu quản lý. | Từ chối truy cập và không trả số liệu tổng hợp của cửa hàng. |
| TC21 | FR8 | NV01 có cơ hội ở nhiều giai đoạn; NV02 cũng có cơ hội ở Tư vấn. | NV01 chọn bộ lọc Tư vấn. | Chỉ hiện cơ hội ở Tư vấn do NV01 phụ trách; không hiện cơ hội NV02 hoặc giai đoạn khác. |
| TC22 | FR8 | Danh sách đang được lọc theo Tư vấn. | Bỏ bộ lọc giai đoạn. | Trả lại tất cả cơ hội trong phạm vi NV01; giới hạn phân quyền vẫn giữ nguyên. |
| TC23 | FR8 | NV01 đăng nhập. | Gửi giá trị bộ lọc không nằm trong bốn giai đoạn, ví dụ “ABC”. | Báo giai đoạn không hợp lệ, không trả dữ liệu ngoài quyền. |
| TC24 | FR9 | CHB01 thuộc NV01, có hai lần chuyển đã lưu tại 09:00 và 14:00. | Mở lịch sử CHB01. | Hiển thị đủ hai lần theo thứ tự 09:00 rồi 14:00; mỗi dòng khớp giai đoạn cũ/mới, người thực hiện và thời điểm. |
| TC25 | FR9 | CHB01 thuộc NV01 và chưa chuyển giai đoạn lần nào. | Mở lịch sử CHB01. | Hiển thị chưa có lịch sử chuyển giai đoạn; không tự tạo một lần chuyển giả. |
| TC26 | FR9 | Cơ hội thuộc nhân viên khác hoặc cửa hàng khác. | NV01 yêu cầu xem lịch sử bằng mã cơ hội đó. | Từ chối truy cập; không trả bất kỳ dòng lịch sử nào. |
| TC27 | FR2 | Phiên đăng nhập đã hết hạn. | Yêu cầu xem danh sách cơ hội. | Yêu cầu đăng nhập lại; không trả dữ liệu cơ hội. |
| TC28 | FR6 | CHB01 đang ở Báo giá, chưa có kết quả. | Gửi yêu cầu ghi kết quả Thành công. | Từ chối do chưa ở Chốt; giai đoạn vẫn là Báo giá và kết quả vẫn chưa ghi nhận. |





