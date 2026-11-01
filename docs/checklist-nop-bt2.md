# Checklist chốt BT2 — L3

## Trước khi nộp
- [ ] Chạy npm test trên bản cuối, 44 PASS; ảnh thật có lệnh và tổng kết.
- [ ] Build frontend bản cuối thành công; chụp kết quả.
- [ ] Seed chạy lại không lỗi/nhân đôi; không khẳng định dựng lại độc lập nếu chưa thử.
- [ ] README và .env.example đúng cấu hình thực tế, có DEMO_PASSWORD và JWT_SECRET trống trong mẫu.
- [ ] Ảnh frontend: đăng nhập, danh sách, tạo, chi tiết/chuyển, kết quả, phễu, lịch sử; loading/empty/error. Nêu rõ ảnh cũ thuộc lần kiểm tra trước.
- [ ] Ảnh API: luồng đúng, dữ liệu sai và chặn ngoài quyền; che token/mật khẩu khi chụp.
- [ ] Báo cáo mô tả module, kiến trúc, kiểm thử ba loại (đúng/biên/sai), tích hợp và cách chạy; phụ lục AI có cách kiểm chứng.
- [ ] Ghi các giới hạn FR4/FR8, phân quyền sản phẩm và phép thử còn thiếu; không khai đã hoàn tất toàn bộ SRS.
- [ ] Báo cáo PDF có ảnh chạy thật và link repo/tag; mở PDF kiểm tra đọc được.
- [ ] git status và git diff --cached --stat; không đưa .env, node_modules, token vào Git.
- [ ] Commit/push code, tài liệu, ảnh; repo public; tag v0.2 trỏ đúng commit cuối và đã push.
- [ ] Nộp PDF + link GitHub theo đề; mở lại bài nộp để kiểm tra.

## Lệnh Git (chạy sau khi đã kiểm tra file)
```powershell
git status
git add README.md .env.example src tests frontend/src migrations seeds docs
git diff --cached --stat
git diff --cached --name-only
```
Nếu đúng các file muốn nộp:
```powershell
git commit -m "feat: complete L3 prototype and BT2 documentation"
git push
```
Kiểm tra tag trước khi tạo:
```powershell
git tag --list v0.2
```
Nếu chưa tồn tại:
```powershell
git tag -a v0.2 -m "BT2 - L3 prototype"
git push origin v0.2
```
Nếu tag đã tồn tại, kiểm tra commit nó trỏ tới; không tự ghi đè tag đang dùng.
