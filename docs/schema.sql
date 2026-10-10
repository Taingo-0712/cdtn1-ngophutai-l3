-- BT1 L3: DDL skeleton PostgreSQL. Tài khoản/đăng nhập là hạ tầng có sẵn.
-- Chưa có điều chuyển người dùng giữa các cửa hàng trong prototype.
BEGIN;
CREATE TABLE store (
    store_id BIGSERIAL PRIMARY KEY,
    store_name VARCHAR(120) NOT NULL
);
CREATE TABLE app_user (
    user_id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL REFERENCES store(store_id),
    full_name VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('NHAN_VIEN','QUAN_LY'))
);
CREATE TABLE customer (
    customer_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE
);
CREATE TABLE product (
    product_id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL
);
CREATE TABLE opportunity (
    opportunity_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customer(customer_id),
    product_id BIGINT NOT NULL REFERENCES product(product_id),
    owner_id BIGINT NOT NULL REFERENCES app_user(user_id),
    need VARCHAR(500) NOT NULL CHECK (length(btrim(need)) BETWEEN 1 AND 500),
    expected_value NUMERIC(15,2) NOT NULL CHECK (expected_value >= 0),
    stage VARCHAR(20) NOT NULL DEFAULT 'TIEP_CAN'
        CHECK (stage IN ('TIEP_CAN','TU_VAN','BAO_GIA','CHOT')),
    result VARCHAR(20) CHECK (result IN ('THANH_CONG','THAT_BAI')),
    failure_reason VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- BR4: chỉ có kết quả ở Chốt; thất bại bắt buộc lý do.
    CONSTRAINT chk_result_stage CHECK (result IS NULL OR stage = 'CHOT'),
    CONSTRAINT chk_failure_reason CHECK (
        (result IS NULL AND failure_reason IS NULL)
        OR (result IS NOT DISTINCT FROM 'THANH_CONG' AND failure_reason IS NULL)
        OR (result IS NOT DISTINCT FROM 'THAT_BAI' AND failure_reason IS NOT NULL
            AND length(btrim(failure_reason)) BETWEEN 1 AND 500)
    )
);
CREATE TABLE opportunity_stage_history (
    history_id BIGSERIAL PRIMARY KEY,
    opportunity_id BIGINT NOT NULL REFERENCES opportunity(opportunity_id),
    from_stage VARCHAR(20) NOT NULL,
    to_stage VARCHAR(20) NOT NULL,
    changed_by BIGINT NOT NULL REFERENCES app_user(user_id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- BR3: mỗi dòng lịch sử ghi một lần chuyển sang giai đoạn kế tiếp.
    CONSTRAINT chk_stage_transition CHECK (
        (from_stage = 'TIEP_CAN' AND to_stage = 'TU_VAN')
        OR (from_stage = 'TU_VAN' AND to_stage = 'BAO_GIA')
        OR (from_stage = 'BAO_GIA' AND to_stage = 'CHOT')
    )
);
-- FR2/FR8 + NFR1: danh sách, lọc và sắp xếp trong phạm vi nhân viên.
CREATE INDEX idx_opportunity_owner_stage_created
    ON opportunity(owner_id, stage, created_at DESC);
-- FR7 + NFR1/NFR2: tìm người dùng của cửa hàng, nối tới cơ hội và đếm theo stage.
CREATE INDEX idx_app_user_store_role ON app_user(store_id, role);
-- FR9: lịch sử tăng dần theo thời gian; history_id giải quyết trường hợp cùng thời điểm.
CREATE INDEX idx_history_opportunity_time
    ON opportunity_stage_history(opportunity_id, changed_at, history_id);
COMMIT;
-- PK và UNIQUE đã có chỉ mục tự động: không tạo lại index customer(phone).
-- Service phải kiểm quyền/role của owner_id, changed_by (BR1), che điện thoại (QT-15),
-- và cấm sửa cơ hội đã có kết quả (BR4). FK không thay thế kiểm tra quyền.
-- BR6/NFR3: dùng CÙNG kết nối PostgreSQL cho BEGIN → UPDATE opportunity
-- → INSERT opportunity_stage_history → COMMIT; bất kỳ lỗi nào → ROLLBACK.
-- CHECK trên lịch sử chỉ kiểm tính hợp lệ của dòng, không tự bảo đảm UPDATE + INSERT đồng thời.
