# Huong dan Codex cho CDTN1 - Mekong Mobile L3

## Muc tieu va pham vi
- Du an mon Chuyen de tot nghiep 1, track SE, case study Smart CRM - Mekong Mobile.
- Luong L3: Co hoi ban hang va pheu ban.
- Stack hien co: JavaScript (CommonJS), Node.js, Express, PostgreSQL; Bootstrap la du kien cho giao dien.
- Chi hien thuc pham vi duoc xac dinh trong `docs/srs.md`. Khong tu y mo rong sang don hang, thanh toan, bao hanh, du bao doanh thu hoac cac tinh nang chua duoc duyet.

## Doc truoc khi lam viec
1. Doc `docs/project-context.md` de nam boi canh, trang thai va van de con mo.
2. Doc `docs/srs.md` va `docs/api-contract.md` de biet yeu cau, User Story, rang buoc va giao tiep API.
3. Doc `docs/thay-doi-thiet-ke.md` de biet cac quyet dinh, thay doi so voi BT1.
4. Kiem tra `README.md`, `src/`, `tests/`, `migrations/`, `seeds/` de xac dinh trang thai THUC TE, khong mac dinh tai lieu da cap nhat kip code.

## Nguyen tac ky thuat
- Giu kien truc tach lop: `src/routes/` -> `src/services/` -> `src/repositories/` -> PostgreSQL.
- Business rules nam tai service; SQL tai repository; routes nhan request va chuyen doi HTTP response.
- Trace moi chuc nang den ma US/FR trong SRS. Ton trong QT-14, QT-15 va cac quy tac BR da duoc chap thuan/xac minh.
- Neu co mau thuan giua SRS, code va tai lieu: neu ro mau thuan, de xuat huong xu ly; KHONG tu y sua pham vi.
- Trinh bay ngan gon: hien trang -> van de -> phuong an -> file se sua -> cach kiem chung.
- Truoc khi sua cac file quan trong, hay de xuat ke hoach ngan va doi phe duyet cua nguoi dung.
- Sau khi sua: kiem tra diff, chay test phu hop, bao cao test nao da chay, pass/fail va viec con lai. Khong khang dinh pass neu chua chay.
- Khong tu y commit, push, xoa du lieu, chay migration tren DB that, hay thay doi cau hinh neu chua duoc phe duyet.

## Bao mat, hoc thuat va bo nho lien tuc
- KHONG in, sao chep, cam ket, push, hay ghi ra file tai lieu cac gia tri trong `.env`, mat khau, JWT secret, token hoac thong tin ca nhan that.
- Can cap nhat `docs/ai-disclosure.md` trung thuc khi AI tham gia soan/kiem code, theo yeu cau mon hoc.
- Ghi cac thay doi thiet ke da chap thuan vao `docs/thay-doi-thiet-ke.md`.
- Chi cap nhat phan `Trang thai duoc xac minh` trong `docs/project-context.md` theo bang chung thuc te. Ghi ngay cap nhat va ket qua test; khong danh dau xong cho cong viec chua duoc kiem chung.
- Khi ket thuc mot phien, de xuat tom tat 5 muc: da lam, file thay doi, test, van de ton tai, buoc tiep theo.
