-- 1. Cửa hàng
INSERT INTO store (store_code, store_name)
VALUES ('MM001', 'Mekong Mobile - Chi nhanh 1')
ON CONFLICT (store_code) DO NOTHING;


-- 2. Nhân viên bán hàng
INSERT INTO app_user (store_id, full_name, role, email)
SELECT
    s.store_id,
    'Nguyen Van An',
    'SALES',
    'an.sales@mekongmobile.vn'
FROM store s
WHERE s.store_code = 'MM001'
  AND NOT EXISTS (
      SELECT 1
      FROM app_user u
      WHERE u.email = 'an.sales@mekongmobile.vn'
  );


-- 3. Quản lý
INSERT INTO app_user (store_id, full_name, role, email)
SELECT
    s.store_id,
    'Tran Thi Binh',
    'MANAGER',
    'binh.manager@mekongmobile.vn'
FROM store s
WHERE s.store_code = 'MM001'
  AND NOT EXISTS (
      SELECT 1
      FROM app_user u
      WHERE u.email = 'binh.manager@mekongmobile.vn'
  );


-- 4. Khách hàng
INSERT INTO customer (full_name, phone)
VALUES ('Le Minh Khoa', '0901234567')
ON CONFLICT (phone) DO NOTHING;


-- 5. Sản phẩm
INSERT INTO product (product_code, product_name)
VALUES ('IP15-128', 'iPhone 15 128GB')
ON CONFLICT (product_code) DO NOTHING;


-- 6. Cơ hội bán hàng mẫu
INSERT INTO opportunity (
    customer_id,
    product_id,
    owner_id,
    need_desc,
    expected_value,
    stage
)
SELECT
    c.customer_id,
    p.product_id,
    u.user_id,
    'Khach hang quan tam iPhone 15 128GB',
    20000000,
    'TIEP_CAN'
FROM customer c
JOIN product p
    ON p.product_code = 'IP15-128'
JOIN app_user u
    ON u.email = 'an.sales@mekongmobile.vn'
WHERE c.phone = '0901234567'
  AND NOT EXISTS (
      SELECT 1
      FROM opportunity o
      WHERE o.customer_id = c.customer_id
        AND o.product_id = p.product_id
        AND o.owner_id = u.user_id
        AND o.need_desc = 'Khach hang quan tam iPhone 15 128GB'
  );