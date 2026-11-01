# Boi canh du an CDTN1 - L3: Co hoi ban hang va pheu ban

> Nguon ban dau: tai lieu va lich su trao doi trong ChatGPT Project CDTN1, doi chieu voi ban ZIP `cdtn1-ngophutai-l3.zip` duoc cung cap ngay 25/10/2026.
> Day la **ban tom tat chuyen ngu canh**, khong phai dong bo truc tiep voi ChatGPT. Truoc khi sua code, doi chieu lai cac file va git status trong workspace hien tai.

## 1. Tong quan
- Hoc phan: Chuyen de tot nghiep 1 (HK1 2026-2027), track Software Engineering (SE).
- Case study: Smart CRM - Mekong Mobile, doanh nghiep mo phong.
- Luong ca nhan: **L3 - Co hoi ban hang va pheu ban**.
- Nghiep vu: nhan vien ban hang ghi nhan co hoi, theo doi chuyen giai doan **Tiep can -> Tu van -> Bao gia -> Chot**, ghi nhan ket qua. Quan ly cua hang xem pheu ban hang.
- Pham vi KHONG lam theo SRS: du bao doanh thu; don hang, thanh toan, kho, bao hanh; tao/gop ho so khach hang; bao cao toan cong ty.
- Cong nghe da thay trong repo: Node.js, Express, PostgreSQL, `pg`, `dotenv`, JavaScript CommonJS; Bootstrap du kien su dung o frontend.

## 2. Tai lieu nguon can doi chieu
- `docs/srs.md`: pham vi, User Stories, FR, NFR, business rules, AC va truy vet. Uu tien file nay khi xac dinh **yeu cau**.
- `docs/api-contract.md`: hop dong API da dac ta.
- `docs/architecture.drawio`, `docs/erd.drawio`, `docs/usecase.drawio`, `docs/wireframe.png`: so do thiet ke va giao dien da nop.
- `docs/schema.sql`: DDL thiet ke; `migrations/*.sql`: DDL da hien thuc.
- `docs/thay-doi-thiet-ke.md`: phan hoi BT1 va cac quyet dinh thay doi.
- `README.md`: cach dung/moi truong/tinh trang theo lan cap nhat truoc; phai doi chieu code hien hanh.
- `docs/ai-disclosure.md`: khai bao AI phai tiep tuc cap nhat trung thuc.

## 3. Yeu cau nghiep vu chinh (tom tat, khong thay the SRS)
- SRS trong ZIP co **9 User Stories**, duoc truy vet voi 9 FR va 9 Use Cases; xem chi tiet ma va muc do MoSCoW tai SRS.
- Cac nghiep vu noi bat: tao co hoi, xem danh sach/chi tiet, cap nhat thong tin, chuyen giai doan, ghi nhan ket qua thanh cong/that bai, xem pheu va lich su.
- BR du kien trong SRS: chuyen giai doan tuan tu; chi ghi ket qua o Chot; neu that bai thi co ly do; chuyen giai doan + ghi lich su phai cung transaction; pheu dem moi co hoi mot lan theo stage hien tai.
- QT-14: gioi han du lieu theo don vi/nguoi duoc phan quyen. QT-15: che so dien thoai voi nhan vien theo vai tro.
- NFR trong SRS: p95 <= 2 giay voi du lieu/tai mo phong cu the; tu choi 100% truy cap trai phep; khong duoc co cap nhat stage thieu lich su khi loi.
- Luu y: SRS phan biet ro quy tac tu case study va quy tac de xuat can xac nhan. Dung code khong duoc bien gia dinh thanh 'quy tac da duyet' neu chua co bang chung.

## 4. Co so du lieu va kien truc
- 6 bang ERD: `store`, `app_user`, `customer`, `product`, `opportunity`, `opportunity_stage_history`.
- Thu muc code trong ZIP: `src/routes/opportunity.routes.js`, `src/services/opportunity.service.js`, `src/repositories/opportunity.repository.js`, `src/db.js`, `src/index.js`.
- Cac migration 001-007 va `seeds/001_seed_demo.sql` da co trong ZIP.
- Bieu thuc phu thuoc: HTTP route -> business service -> data repository -> PostgreSQL.

## 5. Trang thai duoc kiem tra TU MA NGUON ZIP (khong phai ket qua chay lai)
- `src/index.js`: dang ky `/api/opportunities`; co `GET /health` kiem tra ket noi PostgreSQL; port mac dinh 3000.
- `src/routes/opportunity.routes.js`: hien dinh nghia GET danh sach, GET chi tiet, POST tao, PATCH cap nhat, DELETE xoa co hoi.
- `src/services/opportunity.service.js`: co validation khi tao/cap nhat (truong bat buoc, nhu cau rong, gia tri du kien am).
- `src/repositories/opportunity.repository.js`: co cau lenh SQL cho cac thao tac tren.
- `tests/opportunity.service.test.js`: hien co 1 test kiem gia tri du kien am.
- `package.json`: `npm start` va `npm test` (Node built-in test runner).
- **Chua co bang chung da chay lai o lan kiem tra nay.** README ghi '1 PASS' la ket qua tu bao cao truoc do, khong phai test moi.
- README muc 'cong viec tiep theo' co the chua cap nhat kip code: no neu CRUD chua hoan thien, trong khi routes va repository da co CRUD. Can kiem chung **hanh vi thuc te**, khong danh dong 'co ham' voi 'da kiem thu chay dung'.

## 6. Viec dang can giai quyet (uu tien doi chieu thuc te truoc khi lam)
1. Doi chieu code voi SRS/API contract, xac nhan endpoint nao dung request/response/ma loi va phan quyen.
2. Kiem thu du 3 loai (luong dung, gia tri bien, du lieu sai), uu tien rules tai `service`.
3. Hoan thien cap nhat stage + ghi `opportunity_stage_history` cung transaction, neu chua co.
4. Trien khai/kiem chung ghi nhan ket qua, phan quyen va che so dien thoai neu thuoc pham vi duoc chot.
5. Xay dung giao dien ket noi API that, xu ly loading/empty/error, theo 3 man hinh wireframe.
6. Cap nhat README va nhat ky thay doi thiet ke; kiem thu end-to-end theo yeu cau BT2.

## 7. Diem can than trong
- `docs/thay-doi-thiet-ke.md` ghi lai viec giu **9 User Stories** du de BT1 goi y 5-7. Day la quyet dinh da ghi nhan, khong tu y sua ma US/FR.
- File code co `DELETE /api/opportunities/:id`, nhung yeu cau SRS can duoc doi chieu de xac dinh xoa co hoi co thuoc pham vi hay khong. Khong mac dinh no duoc phe duyet chi vi endpoint da ton tai.
- ZIP duoc cung cap co chua `.env`; file do co the chua thong tin nhay cam. **Khong dua `.env` vao GitHub, khong gui lai file do cho AI va khong ghi gia tri bi mat vao bao cao**. `.gitignore` da co quy tac bo qua `.env`, nhung ZIP khong tu dong bo qua file nay.

## 8. Cach chuyen ngu canh qua lai giua ChatGPT va Codex
- ChatGPT Project CDTN1: noi phan tich bai giang, doi chieu case study, ra quyet dinh.
- Sau quyet dinh quan trong: cap nhat tom tat chinh xac vao file nay va/hoac `docs/thay-doi-thiet-ke.md`.
- Codex: doc file nay va cac file nguon trong repo, sau do moi sua code theo nhiem vu duoc phe duyet.
- Ket thuc phien Codex: ghi ket qua da kiem chung, file sua, test pass/fail, van de con lai vao file nay; muon ChatGPT Project biet thay doi thi can dua ban cap nhat/tep vao cuoc tro chuyen hoac nguon cua Project. **Khong co dong bo ngu canh tu dong hai chieu.**


## Cập nhật 01/11/2026 — Hoàn thiện quyền thao tác L3
- Thay đổi: xóa/chuyển giai đoạn/ghi kết quả nhận tài khoản xác thực; chỉ SALES thao tác cơ hội phụ trách, SQL giới hạn owner và store. changed_by lấy từ tài khoản xác thực. Xóa cơ hội có lịch sử bị FK chặn và trả 409 OPPORTUNITY_HAS_HISTORY.
- Vì sao: tránh vượt quyền qua gọi API trực tiếp; truy vết FR5, FR6, QT-14.
- Ảnh hưởng: 3 lớp Backend, test nghiệp vụ và giao diện đăng nhập/token; form tạo bỏ owner_id. Không thêm quản lý tài khoản.
- Kiểm chứng: 39/39 test tự động PASS với repository/kết nối giả lập; chưa chạy PostgreSQL thật hoặc kiểm thử trình duyệt. Build tại môi trường Linux bị chặn bởi binding native Windows trong ZIP; cần npm run build trên máy sinh viên.


## 01/11/2026 — Phễu và lịch sử (FR7, FR9)
- Phễu chỉ cho MANAGER, nhóm theo stage hiện tại trong cửa hàng; trả đủ bốn stage, kể cả 0.
- Lịch sử kiểm tra quyền xem cơ hội, sắp thời gian và history_id tăng dần. Thêm bảng hiển thị với loading/empty/error.
- Giao diện quản lý ẩn thao tác chuyển giai đoạn/ghi kết quả, Backend vẫn kiểm tra quyền.
- AI soạn code và test; kiểm chứng tự động và API PGlite, chưa kiểm thử trình duyệt/PostgreSQL 16 trên máy sinh viên.
